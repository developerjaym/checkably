import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import icons from "../../icons/Icons";
import Card from "../../reusable/card/Card";
import CardBody from "../../reusable/card/CardBody";
import CardHeader from "../../reusable/card/CardHeader";
import CardMenu from "../../reusable/card/CardMenu";
import AddChecklistModal from "../../reusable/modal/addChecklist/AddChecklistModal";
import ConfirmDeletionModal from "../../reusable/modal/confirmDeletion/ConfirmDeletionModal";
import storageService from "../../services/storage/StorageService";
import unflattenData from "../../utility/unflattenData";
import "./ChecklistResults.css";
import { homeLoader } from "./homeLoader";
import SearchForm from "../../reusable/form/search/SearchForm";

export default function ChecklistResults() {
  const [list, setList] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

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
    const searchQuery = Object.fromEntries(new FormData(e.target));
    storageService.search(searchQuery).then((results) => setList(results));
  };

  const checklistCards = data.map((checklistObject) => (
    <Card key={checklistObject.id}>
      <CardHeader
        title={checklistObject.title}
        icon={checklistObject.checked ? icons.checked : null}
      />
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
        <Link className="button" to={`/my-checklists/${checklistObject.id}`}>
          <span className="button__icon">☛</span>
          <span className="big-screen-only">View</span>
        </Link>
      </CardMenu>
    </Card>
  ));

  return (
    <>
      <header className="page__header">
        <h2>My Checklists</h2>
        <menu className="header__menu">
          <button
            className="button"
            onClick={() => setOpenAddDialog(true)}
            title="Create Checklist"
          >
            <span className="button__icon">+</span>
            <span className="big-screen-only">Create Checklist</span>
          </button>
        </menu>
      </header>
      <SearchForm onSearch={onSearch} ariaLabel={"Search through saved checklists"}/>
      <div className="results__container">{checklistCards}</div>

      <ConfirmDeletionModal
        open={openDeleteDialog}
        onCanceled={() => setOpenDeleteDialog(false)}
        onDeleted={onDeleted}
        node={focusedNode.current}
      />

      <AddChecklistModal
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />
    </>
  );
}
