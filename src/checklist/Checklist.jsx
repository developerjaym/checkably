import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Card from "../reusable/card/Card";
import CardBody from "../reusable/card/CardBody";
import CardHeader from "../reusable/card/CardHeader";
import storageService from "../services/storage/StorageService";
import "./Checklist.css";
import ChecklistTree from "./ChecklistTree";
import {toastManager, TOAST_MOODS} from "../toast/ToastService";
import ConfirmDeletionModal from "../reusable/modal/confirmDeletion/ConfirmDeletionModal";

export default function Checklist() {
  const { checklistId } = useParams();
  const [root, setRoot] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    storageService.readOne(checklistId).then((response) => setRoot(response));
  }, [checklistId]);

  const onDeleted = () => {
    navigate("/checklists")
  }

  const onMetadataChanged = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    formData.tags = formData.tags
      .split(",")
      .filter(Boolean)
      .map((tag) => tag.toUpperCase().trim());
    storageService
      .patch(root.id, formData)
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
          <NavLink to="/checklists" className="button button--icon">←</NavLink>
        </nav>
        <h2>{root.title}</h2>
        <menu>
          <button className="button" onClick={() => setOpenDeleteDialog(true)}>Delete</button>
        </menu>
      </header>
        <Card>
          <CardHeader title={`Metadata for ${root.title}`} />
          <CardBody>
            <form className="form" onSubmit={onMetadataChanged}>
              <label className="label">
                <span className="label__text">Checklist Title</span>
                <input
                  className="input"
                  type="text"
                  name="title"
                  defaultValue={root.title}
                />
              </label>
              <label className="label">
                <span className="label__text">Tags (comma-separated list)</span>
                <input
                  className="input"
                  type="text"
                  name="tags"
                  defaultValue={root.tags.join(", ")}
                />
              </label>
              <label className="label">
                <span className="label__text">Description</span>
                <textarea
                  className="input"
                  name="description"
                  defaultValue={root.description}
                />
              </label>
              <button className="button">Save</button>
            </form>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title={`Tree for ${root.title}`} />
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
        <ConfirmDeletionModal open={openDeleteDialog} onCanceled={() => setOpenDeleteDialog(false)} onDeleted={onDeleted} node={root}/>

    </>
  );
}


