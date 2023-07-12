import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import storageService from "../../../services/storage/StorageService";
import Card from "../../card/Card";
import CardBody from "../../card/CardBody";
import CardHeader from "../../card/CardHeader";
import ChecklistMetadataForm from "../../form/ChecklistMetadataForm";
import "./AddChecklistModal.css";
import Icon from "../../icon/Icon";
import icons from "../../../icons/Icons";

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
    e?.preventDefault();
    formRef.current.reset()
    dialogRef.current.close();
    onClose();
  };
  const onCreate = (newChecklistData) => {
    storageService
      .post({
        ...newChecklistData,
        isRoot: true,
      })
      .then(({ id }) => navigate(`/my-checklists/${id}`));
    closeDialog();
    navigate(``);
  };

  return (
    <dialog className="dialog" ref={dialogRef}>
      <Card>
        <CardHeader title={"Create New Checklist"} />
        <CardBody>
          <ChecklistMetadataForm onSubmit={onCreate} formRef={formRef}>
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
