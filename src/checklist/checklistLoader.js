import { defer } from "react-router-dom";
import { homeLoader } from "../routes/home/homeLoader";
import unflattenData from "../utility/unflattenData";
import flattenData from "../utility/flattenData";



export async function checklistLoader({ params }) {
  return defer({
    checklistData: homeLoader().then((checklists) => {
      const checklistTree = unflattenData(checklists)
      const root = checklistTree.find((element) => `${element.id}` === params.checklistId);
      return flattenData(root);
    }),
  });
}
