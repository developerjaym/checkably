import unflattenData from "../../utility/unflattenData";

// const cacheObj = {};
const KEY = import.meta.env.VITE_LOCALSTORAGE_KEY;
// const URL = import.meta.env.VITE_DATA_URL;

const flatData = [
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



export async function homeLoader() {
  //   if (cacheObj) {
  //     return cacheObj;
  //   }
  //   try {
  //     const res = await fetch(URL);
  //     const data = await res.json();
  //     cacheObj = data;
  //     localStorage.setItem(KEY, JSON.stringify(cacheObj, null, 2));
  //     return cacheObj;
  //   } catch (e) {
  // return JSON.parse(localStorage.getItem(KEY)) || []
  //   }

  // return JSON.parse(localStorage.getItem(KEY) || "[]")
  return unflattenData(flatData);
}
