import { defer } from "react-router-dom";
import { homeLoader } from "../routes/home/homeLoader";

export async function checklistLoader({ params }) {
  return defer({
    checklistData: homeLoader().then((checklists) =>
      checklists.find((element) => `${element.id}` === params.checklistId)
    ),
  });
}
