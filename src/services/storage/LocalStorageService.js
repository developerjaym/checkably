const testData = [
  {
    id: "96ec6268-d1ac-4868-a000-bf35e51c49f1",
    title: "Sleep",
    description: "Remember to get some rest",
    tags: ["todo", "test", "sleep"],
    checked: false,
    isRoot: true,
  },
  {
    id: "36cf3af0-cebe-4a78-ba5e-f5ceec3c5636",
    title: "TODO",
    description: "This is what I need to do",
    tags: ["todo", "test"],
    checked: false,
    isRoot: true,
  },
  {
    id: "bfb94f2a-9d2a-464a-b92f-2692568c07f5",
    title: "fix code",
    checked: false,
    parent: "36cf3af0-cebe-4a78-ba5e-f5ceec3c5636",
  },
  {
    id: "3166b704-7ac6-4925-a8ae-ef6bb5ef14d8",
    title: "make router work",
    checked: false,
    parent: "bfb94f2a-9d2a-464a-b92f-2692568c07f5",
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
      localStorage.getItem(this.#key) || JSON.stringify(testData)
    );
    this.#update()
    return this.#data;
  }
  async post(value) {
    value = {id: crypto.randomUUID(), checked: false, title: '', ...value}; // throw some default values in there
    this.#data.push(
      value
    )
    this.#update()
    return value;
  }
  async patch(id, patchValue) {
    const checklist = this.#data.find((checklist) => checklist.id === id);
    for (const key in patchValue) {
      checklist[key] = patchValue[key];
    }
    this.#update();
    return checklist;
  }
  #update() {
    localStorage.setItem(this.#key, JSON.stringify(this.#data, null, 2))
  }
}

const localStorageService = new LocalStorageService(
  import.meta.env.VITE_LOCALSTORAGE_KEY
);

export default localStorageService;