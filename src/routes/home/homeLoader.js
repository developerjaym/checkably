import storageService from "../../services/storage/StorageService";


export async function homeLoader() {
  return (await storageService.read()).filter(checklistObject => checklistObject.isRoot);
}