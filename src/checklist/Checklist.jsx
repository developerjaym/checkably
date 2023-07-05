import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
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
    navigate(`/my-checklists/${newId}`);
  };
  if (!root) {
    return <p>Loading!!!</p>;
  }
  return (
    <>
      <header className="page__header">
        <nav>
          <NavLink to={correctBackRoute} className="button button--icon">
            ☚
          </NavLink>
        </nav>
        <h2>{root.title}</h2>
        <menu className="header__menu">
          <li>
            <button
              className="button"
              onClick={clone}
              title="Clone this checklist"
            >
              <span className="button__icon">🖇</span>
              <span className="big-screen-only">Clone</span>
            </button>
          </li>
          {root.isTemplate ? null : (
            <>
              <li>
                <button
                  className="button"
                  onClick={() => setOpenDeleteDialog(true)}
                  title="Delete this checklist"
                >
                  <span className="button__icon">🗑</span>
                  <span className="big-screen-only">Delete</span>
                </button>
              </li>
              <li>
                <button
                  className="button"
                  disabled={root.isTemplate}
                  title="Edit name, description, and tags"
                  onClick={() => setOpenUpdateDialog(true)}
                >
                  <span className="button__icon button__icon--pencil">✏</span>
                  <span className="big-screen-only">Edit</span>
                </button>
              </li>
            </>
          )}
        </menu>
      </header>

      <ChecklistTree
        key={`${root.title}-${root.id}`}
        id={root.id}
        onChecked={(value) => {
        }}
        onDeleted={() => {
        }}
      />
      <ConfirmDeletionModal
        key={`delete-${root.id}`}
        open={openDeleteDialog}
        onCanceled={() => setOpenDeleteDialog(false)}
        onDeleted={onDeleted}
        id={root.id}
      />
      <UpdateChecklistModal
        key={`update-${root.id}`}
        metadata={root}
        onCancel={() => setOpenUpdateDialog(false)}
        onSave={onMetadataChanged}
        open={openUpdateDialog}
      />
    </>
  );
}
