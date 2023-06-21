import { Form, useNavigate } from "react-router-dom";
import "./AddChecklistModal.css";
import Card from "../../card/Card";
import CardHeader from "../../card/CardHeader";
import CardBody from "../../card/CardBody";
import CardMenu from "../../card/CardMenu";
import { useRef } from "react";
import storageService from "../../../services/storage/StorageService";
import arrayifyTags from "../../../utility/arrayifyTags";

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

  const closeDialog = () => {
    dialogRef.current.close();
    formRef.current.reset();
    onClose();
  };
  const onCreate = (e) => {
    e.preventDefault();
    const newChecklistData = Object.fromEntries(new FormData(formRef.current));
    storageService
      .post({
        ...newChecklistData,
        isRoot: true,
        tags: arrayifyTags(newChecklistData.tags),
      })
      .then(({ id }) => navigate(`/checklists/${id}`));
    closeDialog();
    navigate(``);
  };

  return (
    <dialog className="dialog" ref={dialogRef}>
      <Card>
        <CardHeader title={"Create New Checklist"} />
        <CardBody>
          <form className="form" ref={formRef}>
            <label className="label">
              <span className="label__text">Checklist Title</span>
              <input className="input" type="text" name="title" />
            </label>
            <label className="label">
              <span className="label__text">Tags (comma-separated list)</span>
              <input className="input" type="text" name="tags" />
            </label>
            <label className="label">
              <span className="label__text">Description</span>
              <textarea className="input" name="description" />
            </label>
            <CardMenu>
              <button
                className="button button--primary"
                value="default"
                onClick={onCreate}
              >
                Create!
              </button>
              <button
                className="button"
                value="cancel"
                formMethod="dialog"
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
