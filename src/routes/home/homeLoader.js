import unflattenData from "../../utility/unflattenData";
import storageService from "../../services/storage/StorageService"

// const cacheObj = {};
const KEY = import.meta.env.VITE_LOCALSTORAGE_KEY;
// const URL = import.meta.env.VITE_DATA_URL;



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
  const flatData = await storageService.read();
  return flatData;
  // return unflattenData(flatData);
}