import { useRef } from "react";
import Card from "../../card/Card";
import CardBody from "../../card/CardBody";
import CardHeader from "../../card/CardHeader";
import CardMenu from "../../card/CardMenu";
import "./ConfirmDeletionModal.css";
import storageService from "../../../services/storage/StorageService";
import { TOAST_MOODS, toastManager } from "../../../toast/ToastService";
import icons from "../../../icons/Icons";
import Icon from "../../icon/Icon";

export default function ConfirmDeletionModal({
  open,
  id,
  onDeleted,
  onCanceled,
}) {
  const confirmDeletionDialogRef = useRef(null);

  if (open) {
    confirmDeletionDialogRef.current?.close();
    confirmDeletionDialogRef.current?.showModal();
  } else {
    confirmDeletionDialogRef.current?.close();
  }
  const closeConfirmDeletionDialog = () => {
    confirmDeletionDialogRef.current.close();
    onCanceled();
  };
  const confirmDeletion = () => {
    closeConfirmDeletionDialog();
    storageService
      .deleteItem(id)
      .then(() => onDeleted())
      .then(() => toastManager.push("Deleted", TOAST_MOODS.NEUTRAL))
      .catch((err) => toastManager.push(`Failed: ${err}`, TOAST_MOODS.SAD));
  };

  return (
    <dialog
      id="delete-dialog"
      className="dialog"
      ref={confirmDeletionDialogRef}
    >
      <Card>
        <CardHeader title={"Confirm"} icon={icons.delete}/>
        <CardBody>
          <p>Are you sure? Like really really sure you want to delete this?</p>
        </CardBody>
        <CardMenu>
          <li>
            <button className="button button--primary" onClick={confirmDeletion}>
              <Icon icon={icons.delete} className="button__icon" />
              <span className="big-screen-only">Yes, delete it.</span>
            </button>
          </li>
          <li>
            <button className="button" onClick={closeConfirmDeletionDialog}>
              <Icon icon={icons.cancel} className="button__icon" />
              <span className="big-screen-only">Oops, never mind!</span>
            </button>
          </li>
        </CardMenu>
      </Card>
    </dialog>
  );
}
