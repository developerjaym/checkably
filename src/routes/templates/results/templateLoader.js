import storageService from "../../../services/storage/StorageService";

export async function templateLoader() {
  return (await storageService.searchTemplates({term: ''})).filter(
    (checklistObject) => checklistObject.isRoot
  );
}
