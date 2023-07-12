import { useRef } from "react";
import Card from "../../card/Card";
import CardBody from "../../card/CardBody";
import CardHeader from "../../card/CardHeader";
import ChecklistMetadataForm from "../../form/ChecklistMetadataForm";
import unicodeSymbols from "../../../icons/UnicodeSymbols";
import Icon from "../../icon/Icon";
import icons from "../../../icons/Icons";

export default function UpdateChecklistModal({
  metadata,
  open,
  onCancel,
  onSave,
}) {
  const dialogRef = useRef(null);
  const formRef = useRef(null);

  if (open) {
    dialogRef.current?.close();
    dialogRef.current?.showModal();
  } else {
    dialogRef.current?.close();
  }

  const closeDialog = (e) => {
    e.preventDefault();
    formRef.current.reset();
    dialogRef.current.close();
    onCancel();
  };
  const presubmit = (newChecklistData) => {
    dialogRef.current.close();
    onSave(newChecklistData);
  };

  return (
    <dialog id="delete-dialog" className="dialog" ref={dialogRef}>
      <Card>
        <CardHeader title={`Update ${metadata.title}`} />
        <CardBody>
          <ChecklistMetadataForm
            onSubmit={presubmit}
            defaultValues={metadata}
            formRef={formRef}
          >
            <button className="button button--submit" value="default">
              <Icon icon={icons.ok} className="button__icon" />
              <span className="big-screen-only">Save</span>
            </button>
            <button className="button" value="cancel" onClick={closeDialog}>
              <Icon icon={icons.cancel} className="button__icon" />
              <span className="big-screen-only">Never mind!</span>
            </button>
          </ChecklistMetadataForm>
        </CardBody>
      </Card>
    </dialog>
  );
}
