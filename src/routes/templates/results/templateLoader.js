import storageService from "../../../services/storage/StorageService";

export async function templateLoader() {
  const data = await storageService.search({term: '', isTemplate: true})
  return data.filter(
    (checklistObject) => checklistObject.isRoot
  );
}
