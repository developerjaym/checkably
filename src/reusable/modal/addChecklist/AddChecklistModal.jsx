import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import storageService from "../../../services/storage/StorageService";
import Card from "../../card/Card";
import CardBody from "../../card/CardBody";
import CardHeader from "../../card/CardHeader";
import ChecklistMetadataForm from "../../form/ChecklistMetadataForm";
import "./AddChecklistModal.css";

export default function AddChecklistModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const navigate = useNavigate();

  if (open) {
    dialogRef.current?.close();
    dialogRef.current?.showModal();
  } else {
    dialogRef.current?.close();
  }

  const closeDialog = (e) => {
    e?.preventDefault();
    e.target?.parentNode?.parentNode?.reset();
    dialogRef.current.close();
    onClose();
  };
  const onCreate = (newChecklistData) => {
    storageService
      .post({
        ...newChecklistData,
        isRoot: true,
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
          <ChecklistMetadataForm onSubmit={onCreate}>
            <button className="button button--primary" value="default">
              Create!
            </button>
            <button className="button" value="cancel" onClick={closeDialog}>
              Never mind!
            </button>
          </ChecklistMetadataForm>
        </CardBody>
      </Card>
    </dialog>
  );
}
