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
import Logo from "../../reusable/logo/Logo";
import HelpModal from "../../reusable/modal/help/HelpModal";

export default function ChecklistResults() {
  const [list, setList] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

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
    storageService
      .search({ ...searchQuery, isTemplate: false })
      .then((results) => setList(results));
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
        <li>
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
        </li>
        <li>
          <Link className="button" to={`/my-checklists/${checklistObject.id}`}>
            <span className="button__icon">&gt;</span>
            <span className="big-screen-only">View</span>
          </Link>
        </li>
      </CardMenu>
    </Card>
  ));

  return (
    <>
      <header className="page__header">
        <Logo />

        <h2 className="page__title">My Checklists</h2>
        <menu className="header__menu">
          <li>
            <button
              className="button button--toolbar"
              onClick={() => setOpenAddDialog(true)}
              title="Create Checklist"
            >
              <span className="button__icon">+</span>
              <span className="big-screen-only">Create Checklist</span>
            </button>
          </li>
          <li>
            <button
              className="button button--toolbar"
              onClick={() => setHelpModalOpen(true)}
            >
              <span className="button__icon">?</span>
              <span className="big-screen-only">Help</span>
            </button>
          </li>
        </menu>
      </header>
      <main>
        <SearchForm
          onSearch={onSearch}
          ariaLabel={"Search through saved checklists"}
        />
        <div className="results__container">{checklistCards}</div>
      </main>

      <ConfirmDeletionModal
        open={openDeleteDialog}
        onCanceled={() => setOpenDeleteDialog(false)}
        onDeleted={onDeleted}
        id={focusedNode.current?.id}
      />

      <AddChecklistModal
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />

      <HelpModal
        open={helpModalOpen}
        onCanceled={() => setHelpModalOpen(false)}
      />
    </>
  );
}
