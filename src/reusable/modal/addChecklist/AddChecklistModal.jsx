import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import storageService from "../../../services/storage/StorageService";
import { checklistValidationRules } from "../../../services/validators/checklistValidator";
import arrayifyTags from "../../../utility/arrayifyTags";
import Card from "../../card/Card";
import CardBody from "../../card/CardBody";
import CardHeader from "../../card/CardHeader";
import CardMenu from "../../card/CardMenu";
import "./AddChecklistModal.css";

export default function AddChecklistModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();

  if (open) {
    dialogRef.current?.close();
    dialogRef.current?.showModal();
  } else {
    dialogRef.current?.close();
  }

  const closeDialog = (e) => {
    e.preventDefault()
    dialogRef.current.close();
    formRef.current.reset();
    onClose();
  };
  const onCreate = (e) => {
    e.preventDefault();
    const newChecklistData = Object.fromEntries(new FormData(e.target));
    storageService
      .post({
        ...newChecklistData,
        isRoot: true,
        tags: arrayifyTags(newChecklistData.tags),
      })
      .then(({ id }) => navigate(`/checklists/${id}`));
    closeDialog(e);
    navigate(``);
  };

  return (
    <dialog className="dialog" ref={dialogRef}>
      <Card>
        <CardHeader title={"Create New Checklist"} />
        <CardBody>
          <form className="form" ref={formRef}  onSubmit={onCreate}>
            <label className="label">
              <span className="label__text">Checklist Title</span>
              <input className="input" type="text" name="title" maxLength={checklistValidationRules.title.maxLength}
                  minLength={checklistValidationRules.title.minLength}
                  required={checklistValidationRules.title.required}/>
            </label>
            <label className="label">
              <span className="label__text">Tags (comma-separated list)</span>
              <input className="input" type="text" name="tags" maxLength={checklistValidationRules.tags.maxLength}
                  minLength={checklistValidationRules.tags.minLength}
                  required={checklistValidationRules.tags.required}/>
            </label>
            <label className="label">
              <span className="label__text">Description</span>
              <textarea className="input" name="description" maxLength={checklistValidationRules.description.maxLength}
                  minLength={checklistValidationRules.description.minLength}
                  required={checklistValidationRules.description.required}/>
            </label>
            <CardMenu>
              <button
                className="button button--primary"
                value="default"
              >
                Create!
              </button>
              <button
                className="button"
                value="cancel"
                onClick={closeDialog}
              >
                Never mind!
              </button>
            </CardMenu>
          </form>
        </CardBody>
      </Card>
    </dialog>
  );
}
