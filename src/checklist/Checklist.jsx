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
import arrayifyTags from "../utility/arrayifyTags";
import { checklistValidationRules } from "../services/validators/checklistValidator";

export default function Checklist() {
  const { checklistId } = useParams();
  const [root, setRoot] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    storageService.readOne(checklistId).then((response) => setRoot(response)).catch(err => {
      toastManager.push("Unable to display checklist", TOAST_MOODS.SAD)
      navigate("/checklists")
    });
  }, [checklistId, navigate]);

  const onDeleted = () => {
    navigate("/checklists")
  }

  const onMetadataChanged = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    formData.tags = arrayifyTags(formData.tags);
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
          <button className="button" onClick={() => setOpenDeleteDialog(true)}><span className="button__icon">🗑</span><span className="big-screen-only">Delete</span></button>
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
                  maxLength={checklistValidationRules.title.maxLength}
                  minLength={checklistValidationRules.title.minLength}
                  required={checklistValidationRules.title.required}
                />
              </label>
              <label className="label">
                <span className="label__text">Tags (comma-separated list)</span>
                <input
                  className="input"
                  type="text"
                  name="tags"
                  defaultValue={root.tags.join(", ")}
                  maxLength={checklistValidationRules.tags.maxLength}
                  minLength={checklistValidationRules.tags.minLength}
                  required={checklistValidationRules.tags.required}
                />
              </label>
              <label className="label">
                <span className="label__text">Description</span>
                <textarea
                  className="input"
                  name="description"
                  defaultValue={root.description}
                  maxLength={checklistValidationRules.description.maxLength}
                  minLength={checklistValidationRules.description.minLength}
                  required={checklistValidationRules.description.required}
                />
              </label>
              <button className="button button--submit"><span className="button__icon">💾</span><span className="big-screen-only">Save</span></button>
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


