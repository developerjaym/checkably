import unflattenData from "../../utility/unflattenData";
import templates from "./localTemplates";
const recursivelyChangeIds = (node, newParentId) => {
  node.id = crypto.randomUUID();
  node.isTemplate = false;
  if (newParentId) {
    node.parent = newParentId;
  }
  node?.items.forEach((item) => recursivelyChangeIds(item, node.id));
};

const scoreChecklist = (queryObject) => (item) => {
  let score = 0;

  // tag
  if (tagSearchMatches(item.tags, queryObject.term)) {
    score += 10;
  }

  // title
  if (textSearchMatches(item.title, queryObject.term, true)) {
    score += 25;
  } else if (textSearchMatches(item.title, queryObject.term, false)) {
    score += 5;
  }

  // description
  if (textSearchMatches(item.description, queryObject.term, false)) {
    score += 5;
  }

  // completion
  if (item.checked) {
    score -= 5;
  }

  return { item, score };
};

const textSearchMatches = (property, queryTerm, exact = false) => {
  return exact
    ? property.toLowerCase() === queryTerm.toLowerCase().trim()
    : property.toLowerCase().includes(queryTerm.toLowerCase().trim());
};

const tagSearchMatches = (tags, queryTerm) => {
  return tags.some((tag) => textSearchMatches(tag, queryTerm));
};

const templateSearchMatches = (checklist, queryIsTemplate) => {
  return Boolean(checklist.isTemplate) === Boolean(queryIsTemplate);
};

class LocalStorageService {
  #key;
  #myChecklists;
  #templates;
  constructor(key) {
    this.#key = key;
    this.#myChecklists = [];
    this.#templates = templates;
  }
  async read() {
    this.#myChecklists = JSON.parse(
      localStorage.getItem(this.#key) || JSON.stringify([])
    );
    this.#destroyOrphans();
    this.#normalize();
    this.#update();
    return structuredClone(this.#myChecklists.concat(this.#templates));
  }
  async search(queryObject) {
    const data = await this.read();
    return data
      .filter(
        (item) =>
          item.isRoot && templateSearchMatches(item, queryObject.isTemplate)
      )
      .filter(
        (item) =>
          tagSearchMatches(item.tags, queryObject.term) ||
          textSearchMatches(item.title, queryObject.term) ||
          textSearchMatches(item.description, queryObject.term)
      )
      .map(scoreChecklist(queryObject))
      .sort(
        (searchScoreA, searchScoreB) => searchScoreB.score - searchScoreA.score
      ).sort((searchItemA, searchItemB) => searchItemB.item?.timestamp.localeCompare(searchItemA.item.timestamp))
      .map((searchScore) => searchScore.item);
  }
  async readOne(id) {
    const all = await this.read();
    const root = all.find((node) => node.id === id);
    this.patch(id, {timestamp: new Date().toISOString()})
    if (!root) {
      throw Error(`Checklist with id ${id} was not found`);
    }
    root.items = all.filter((node) => node.parent === root.id);
    return structuredClone(root);
  }
  async readOneDeep(id) {
    const checklistTree = unflattenData(await this.read());
    const root = checklistTree.find((element) => `${element.id}` === id);
    this.patch(id, {timestamp: new Date().toISOString()})
    if (!root) {
      throw Error(`Checklist with id ${id} was not found`);
    }
    this.#update()
    return structuredClone(root);
  }
  async import(data) {
    const tree = unflattenData(data)[0];
    
    tree.timestamp = new Date().toISOString();
    recursivelyChangeIds(tree);
    this.#recursivelyPost(tree);
    return tree.id;
  }
  async clone(id) {
    const templateTree = await this.readOneDeep(id);

    templateTree.timestamp = new Date().toISOString();
    const templateRootClone = structuredClone(templateTree);
    templateRootClone.title = `[CLONED] ${templateRootClone.title}`;

    recursivelyChangeIds(templateRootClone);
    this.#recursivelyPost(templateRootClone);
    return templateRootClone.id;
  }
  async post(value) {
    value = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      checked: false,
      title: "",
      ...value,
    }; // throw some default values in there
    this.#myChecklists.push(value);
    this.#update();
    return structuredClone(value);
  }
  async patch(id, patchValue) {
    const checklist = this.#myChecklists.find(
      (checklist) => checklist.id === id
    );
    if(!checklist) {
      return;
    }
    for (const key in patchValue) {
      checklist[key] = patchValue[key];
    }
    this.#update();
    return structuredClone(checklist);
  }
  async deleteItem(id) {
    // find all children
    const childrenIds = this.#findDescendentIds(id, this.#myChecklists, [id]);
    this.#myChecklists = this.#myChecklists.filter(
      (checklist) => !childrenIds.includes(checklist.id)
    );
    this.#update();
    return true;
  }
  #recursivelyPost(node) {
    this.post({ ...node, items: null });
    node.items.forEach((item) => this.#recursivelyPost(item));
  }
  #update() {
    localStorage.setItem(
      this.#key,
      JSON.stringify(this.#myChecklists, null, 2)
    );
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
    let orphans = this.#findOrphans(this.#myChecklists);
    while (orphans.length) {
      orphans.forEach((orphan) => this.deleteItem(orphan.id));
      orphans = this.#findOrphans(this.#myChecklists);
    }
  }
  #findOrphans(flatData) {
    const ids = flatData.map((item) => item.id);
    const orphans = flatData.filter(
      (item) => !item.isRoot && !ids.includes(item.parent)
    );
    return orphans;
  }
  #normalize() {
    this.#myChecklists.forEach(
      (checklist) =>
        (checklist.timestamp = checklist.timestamp || new Date().toISOString())
    );
  }
}

const localStorageService = new LocalStorageService(
  import.meta.env.VITE_LOCALSTORAGE_KEY
);

export default localStorageService;
