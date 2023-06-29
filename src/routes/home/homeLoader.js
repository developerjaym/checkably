import storageService from "../../services/storage/StorageService";


export async function homeLoader() {
  return (await storageService.search({term: ''})).filter(checklistObject => checklistObject.isRoot);
}