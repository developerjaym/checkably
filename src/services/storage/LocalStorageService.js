import flattenData from "../../utility/flattenData";
import unflattenData from "../../utility/unflattenData";

const textSearchMatches = (property, queryTerm) => {
  return property.toLowerCase().includes(queryTerm.toLowerCase().trim());
};

const tagSearchMatches = (tags, queryTerm) => {
  return tags.some((tag) => textSearchMatches(tag, queryTerm));
};

const templates = [
  {
    id: "96ec6268-d1ac-4868-a000-bf35e51c49f1",
    title: "Cruise Packing List",
    description: "Everything you need to pack for a tropical cruise.",
    tags: ["vacation", "packing", "cruise"],
    checked: false,
    isRoot: true,
    isTemplate: true,
  },
  {
    id: "36cf3af0-cebe-4a78-ba5e-f5ceec3c5636",
    title: "Grocery Shopping List",
    description: "Standard items needed from the grocery.",
    tags: ["grocery", "food", "shopping"],
    checked: false,
    isRoot: true,
    isTemplate: true,
  },
  {
    id: "bfb94f2a-9d2a-464a-b92f-2692568c07f5",
    title: "Dairy",
    checked: false,
    parent: "36cf3af0-cebe-4a78-ba5e-f5ceec3c5636",
    isTemplate: true,
  },
  {
    id: "3166b704-7ac6-4925-a8ae-ef6bb5ef14d8",
    title: "Cheese",
    checked: false,
    parent: "bfb94f2a-9d2a-464a-b92f-2692568c07f5",
    isTemplate: true,
  },
];

class LocalStorageService {
  #key;
  #data;
  constructor(key) {
    this.#key = key;
    this.#data = [];
  }
  async read() {
    this.#data = JSON.parse(
      localStorage.getItem(this.#key) || JSON.stringify([])
    );
    // TODO destroy accidental orphans
    this.#destroyOrphans();
    this.#update();
    return structuredClone(this.#data);
  }
  async search(queryObject) {
    return await this.read()
      .filter((item) => item.isRoot)
      .filter(
        (item) =>
          tagSearchMatches(item.tags, queryObject.term) ||
          textSearchMatches(item.title, queryObject.term) ||
          textSearchMatches(item.description, queryObject.term)
      );
  }
  async searchTemplates(queryObject) {
    return await templates
      .filter((item) => item.isRoot)
      .filter(
        (item) =>
          tagSearchMatches(item.tags, queryObject.term) ||
          textSearchMatches(item.title, queryObject.term) ||
          textSearchMatches(item.description, queryObject.term)
      );
  }
  async readOne(id) {
    const checklistTree = unflattenData((await this.read()).concat(templates));
    const root = checklistTree.find((element) => `${element.id}` === id);
    if (!root) {
      throw Error(`Checklist with id ${id} was not found`);
    }
    return structuredClone(root);
  }
  async clone(id) {
    const templateTree = unflattenData(templates);
    const templateRoot = templateTree.find((template) => template.id === id);
    const templateRootClone = structuredClone(templateRoot);
    const recursivelyChangeIds = (node, newParentId) => {
      node.id = crypto.randomUUID();
      node.isTemplate = false;
      if (newParentId) {
        node.parent = newParentId;
      }
      node.items.forEach((item) => recursivelyChangeIds(item, node.id));
    };
    const recursivelyPost =  (node) => {
      this.post({...node, items: null})
      node.items.forEach((item) => recursivelyPost(item));
    };
    recursivelyChangeIds(templateRootClone);
    recursivelyPost(templateRootClone)
    return templateRootClone.id;
  }
  async post(value) {
    value = { id: crypto.randomUUID(), checked: false, title: "", ...value }; // throw some default values in there
    this.#data.push(value);
    this.#update();
    return structuredClone(value);
  }
  async patch(id, patchValue) {
    const checklist = this.#data.find((checklist) => checklist.id === id);
    for (const key in patchValue) {
      checklist[key] = patchValue[key];
    }
    this.#update();
    return structuredClone(checklist);
  }
  async deleteItem(id) {
    // find all children
    const childrenIds = this.#findDescendentIds(id, this.#data, [id]);
    this.#data = this.#data.filter(
      (checklist) => !childrenIds.includes(checklist.id)
    );
    this.#update();
    return true;
  }
  #update() {
    localStorage.setItem(this.#key, JSON.stringify(this.#data, null, 2));
  }
  #findDescendentIds(parentId, flatData, array) {
    const children = flatData.filter((item) => item.parent === parentId);
    array.push(...children.map((child) => child.id));
    children.forEach((child) =>
      this.#findDescendentIds(child.id, flatData, array)
    );
    return array;
  }
  #destroyOrphans() {
    let orphans = this.#findOrphans(this.#data);
    while (orphans.length) {
      orphans.forEach((orphan) => this.deleteItem(orphan.id));
      orphans = this.#findOrphans(this.#data);
    }
  }
  #findOrphans(flatData) {
    const ids = flatData.map((item) => item.id);
    const orphans = flatData.filter(
      (item) => !item.isRoot && !ids.includes(item.parent)
    );
    return orphans;
  }
}

const localStorageService = new LocalStorageService(
  import.meta.env.VITE_LOCALSTORAGE_KEY
);

export default localStorageService;
