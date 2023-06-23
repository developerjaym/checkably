
import { useRef } from "react";
import Card from "../../card/Card";
import CardBody from "../../card/CardBody";
import CardHeader from "../../card/CardHeader";
import ChecklistMetadataForm from "../../form/ChecklistMetadataForm";

export default function UpdateChecklistModal({ metadata, open, onCancel, onSave }) {
  const dialogRef = useRef(null);

  if (open) {
    dialogRef.current?.close();
    dialogRef.current?.showModal();
  } else {
    dialogRef.current?.close();
  }

  const closeDialog = (e) => {
    e.preventDefault();
    e.target?.parentNode?.parentNode?.reset();
    dialogRef.current.close();
    onCancel();
  };
  const presubmit = (newChecklistData) => {
    dialogRef.current.close();
    onSave(newChecklistData)
  };

  return (
    <dialog id="delete-dialog" className="dialog" ref={dialogRef}>
      <Card>
        <CardHeader title={`Update ${metadata.title}`} />
        <CardBody>
          <ChecklistMetadataForm onSubmit={presubmit} defaultValues={metadata}>
          <button className="button button--submit" value="default">
              <span className="button__icon">💾</span>
              <span className="big-screen-only">Save</span>
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
