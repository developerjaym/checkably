import { useRef } from "react";
import Card from "../../card/Card";
import CardBody from "../../card/CardBody";
import CardHeader from "../../card/CardHeader";
import CardMenu from "../../card/CardMenu";
import "./ConfirmDeletionModal.css";
import storageService from "../../../services/storage/StorageService";
import { TOAST_MOODS, toastManager } from "../../../toast/ToastService";

export default function ConfirmDeletionModal({open, node, onDeleted}) {
    const confirmDeletionDialogRef = useRef(null)

    if(open) {
        confirmDeletionDialogRef.current?.close()
        confirmDeletionDialogRef.current?.showModal();
    }
    else {
        confirmDeletionDialogRef.current?.close()
    }
      const closeConfirmDeletionDialog = () => {
        confirmDeletionDialogRef.current.close();
      }
      const confirmDeletion = () => {
        closeConfirmDeletionDialog();
        storageService.deleteItem(node.id).then(
          () => onDeleted()
        )
        .then(() => toastManager.push("Deleted", TOAST_MOODS.NEUTRAL))
        .catch(console.error)//(err) => toastManager.push(`Failed: ${err}`, TOAST_MOODS.SAD))
      }

    return(<dialog className="dialog" ref={confirmDeletionDialogRef}>
    <Card>
      <CardHeader title={'Confirm'}/>
      <CardBody>
        <p>Are you sure? Like really really sure you want to delete this?</p>
      </CardBody>
      <CardMenu>
        <button className="button button--primary" onClick={confirmDeletion}>Yes, delete it.</button>
        <button className="button" onClick={closeConfirmDeletionDialog}>Oops, do not delete!</button>
      </CardMenu>
    </Card>
  </dialog>)
}