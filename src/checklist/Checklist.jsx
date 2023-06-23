import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Card from "../reusable/card/Card";
import CardBody from "../reusable/card/CardBody";
import CardHeader from "../reusable/card/CardHeader";
import ChecklistMetadataForm from "../reusable/form/ChecklistMetadataForm";
import ConfirmDeletionModal from "../reusable/modal/confirmDeletion/ConfirmDeletionModal";
import storageService from "../services/storage/StorageService";
import { TOAST_MOODS, toastManager } from "../toast/ToastService";
import "./Checklist.css";
import ChecklistTree from "./ChecklistTree";
import UpdateChecklistModal from "../reusable/modal/updateChecklist/UpdateChecklistModal";

export default function Checklist() {
  const { checklistId } = useParams();
  const [root, setRoot] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    storageService
      .readOne(checklistId)
      .then((response) => setRoot(response))
      .catch((err) => {
        toastManager.push("Unable to display checklist", TOAST_MOODS.SAD);
        navigate("/checklists");
      });
  }, [checklistId, navigate]);

  const onDeleted = () => {
    setOpenDeleteDialog(false)
    navigate("/checklists");
  };

  const onMetadataChanged = (newChecklistData) => {
    setOpenUpdateDialog(false);
    storageService
      .patch(root.id, newChecklistData)
      .then(() => storageService.readOne(checklistId))
      .then((response) => setRoot(response))
      .then(() => toastManager.push("SAVED", TOAST_MOODS.HAPPY));
  };
  if (!root) {
    return <p>Loading!!!</p>;
  }
  return (
    <>
      <header className="page__header">
        <nav>
          <NavLink to="/checklists" className="button button--icon">
            ⭠
          </NavLink>
        </nav>
        <h2>{root.title}</h2>
        <menu className="header__menu">
          <button className="button" onClick={() => setOpenDeleteDialog(true)}>
            <span className="button__icon">🗑</span>
            <span className="big-screen-only">Delete</span>
          </button>
          <button className="button" onClick={() => setOpenUpdateDialog(true)}>
            <span className="button__icon">✏</span>
            <span className="big-screen-only">Edit</span>
          </button>
        </menu>
      </header>
      
      <Card>
        <CardHeader title={`Checklist`} />
        <CardBody>
          <ChecklistTree
            node={root}
            isRoot={true}
            onChecked={(value) => {
              console.log("the whole thing's checked value", value);
            }}
            onDeleted={() => {
              console.log("whole thing deleted");
            }}
          />
        </CardBody>
      </Card>
      <ConfirmDeletionModal
        open={openDeleteDialog}
        onCanceled={() => setOpenDeleteDialog(false)}
        onDeleted={onDeleted}
        node={root}
      />
      <UpdateChecklistModal metadata={root} onCancel={() => setOpenUpdateDialog(false)} onSave={onMetadataChanged} open={openUpdateDialog}/>
    </>
  );
}
