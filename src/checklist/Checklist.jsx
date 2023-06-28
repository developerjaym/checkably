import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Card from "../reusable/card/Card";
import CardBody from "../reusable/card/CardBody";
import CardHeader from "../reusable/card/CardHeader";
import ConfirmDeletionModal from "../reusable/modal/confirmDeletion/ConfirmDeletionModal";
import UpdateChecklistModal from "../reusable/modal/updateChecklist/UpdateChecklistModal";
import storageService from "../services/storage/StorageService";
import { TOAST_MOODS, toastManager } from "../toast/ToastService";
import "./Checklist.css";
import ChecklistTree from "./ChecklistTree";

export default function Checklist() {
  const { checklistId } = useParams();
  const [root, setRoot] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const navigate = useNavigate();
  const correctBackRoute = root?.isTemplate ? "/templates" : "/my-checklists"; 
  useEffect(() => {
    storageService
      .readOne(checklistId)
      .then((response) => setRoot(response))
      .catch((err) => {
        toastManager.push("Unable to display checklist", TOAST_MOODS.SAD);
        navigate(-1);
      });
  }, [checklistId, navigate]);

  const onDeleted = () => {
    setOpenDeleteDialog(false);
    navigate(correctBackRoute);
  };

  const onMetadataChanged = (newChecklistData) => {
    setOpenUpdateDialog(false);
    storageService
      .patch(root.id, newChecklistData)
      .then(() => storageService.readOne(checklistId))
      .then((response) => setRoot(response))
      .then(() => toastManager.push("SAVED", TOAST_MOODS.HAPPY));
  };

  const clone = async () => {
    const newId = await storageService.clone(root.id);
    navigate(`/my-checklists/${newId}`)
  }
  if (!root) {
    return <p>Loading!!!</p>;
  }
  return (
    <>
      <header className="page__header">
        <nav>
          <NavLink
            to={correctBackRoute}
            className="button button--icon"
          >
            ☚
          </NavLink>
        </nav>
        <h2>{root.title}</h2>
        <menu className="header__menu">
          {root.isTemplate ? (
            <button className="button" onClick={clone}>
              <span className="button__icon">+</span>
              <span className="big-screen-only">Clone</span>
            </button>
          ) : (
            <>
              <button
                className="button"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <span className="button__icon">🗑</span>
                <span className="big-screen-only">Delete</span>
              </button>
              <button
                className="button"
                disabled={root.isTemplate}
                onClick={() => setOpenUpdateDialog(true)}
              >
                <span className="button__icon">✏</span>
                <span className="big-screen-only">Edit</span>
              </button>
            </>
          )}
        </menu>
      </header>

      <Card>
        <CardHeader title={root.isTemplate ? 'Template' : 'Checklist'} />
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
      <UpdateChecklistModal
        metadata={root}
        onCancel={() => setOpenUpdateDialog(false)}
        onSave={onMetadataChanged}
        open={openUpdateDialog}
      />
    </>
  );
}
