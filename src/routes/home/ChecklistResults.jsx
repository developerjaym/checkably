import { useEffect, useRef, useState } from "react";
import Card from "../../reusable/card/Card";
import CardBody from "../../reusable/card/CardBody";
import CardHeader from "../../reusable/card/CardHeader";
import CardMenu from "../../reusable/card/CardMenu";
import ConfirmDeletionModal from "../../reusable/modal/confirmDeletion/ConfirmDeletionModal";
import unflattenData from "../../utility/unflattenData";
import "./ChecklistResults.css";
import { homeLoader } from "./homeLoader";
import { Link } from "react-router-dom";
import storageService from "../../services/storage/StorageService";
import icons from "../../icons/Icons";

export default function ChecklistResults() {
  const [list, setList] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const focusedNode = useRef(null);
  useEffect(() => {
    const load = async () => {
      const roots = await homeLoader();
      setList(roots);
    };
    load();
  }, []);
  const data = unflattenData(list);

  const onDeleted = () => {
    setOpenDeleteDialog(false);
    homeLoader().then((newList) => setList(newList));
  };

  const onSearch = (e) => {
    e.preventDefault();
    const searchQuery = Object.fromEntries(new FormData(e.target))
    storageService.search(searchQuery).then(results => setList(results))
  }

  const checklistCards = data.map((checklistObject) => (
    <Card key={checklistObject.id}>
      <CardHeader title={checklistObject.title} icon={checklistObject.checked ? icons.checked  : null} />
      <CardBody>
        <p>{checklistObject.description}</p>
      </CardBody>
      <CardMenu>
        <button
          className="button"
          onClick={() => {
            focusedNode.current = checklistObject;
            setOpenDeleteDialog(true);
          }}
        >
          <span className="button__icon">🗑</span>
          <span className="big-screen-only">Delete</span>
        </button>
        <Link className="button" to={`/checklists/${checklistObject.id}`}>
          <span className="button__icon">➝</span>
          <span className="big-screen-only">View</span>
        </Link>
      </CardMenu>
    </Card>
  ));

  return (
    <>
        <form className="search main__header" role="search" aria-label="Search through saved checklists" onSubmit={onSearch}>

        <label className="label search__label">
          <span className="label__text">🔍</span>
          <input className="input input--search" type="search" name="term" />
        </label>
        </form>
      <div className="results__container">{checklistCards}</div>

      <ConfirmDeletionModal
        open={openDeleteDialog}
        onCanceled={() => setOpenDeleteDialog(false)}
        onDeleted={onDeleted}
        node={focusedNode.current}
      />
    </>
  );
}
