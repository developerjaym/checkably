import { useEffect, useRef, useState } from "react";
import Card from "../../card/Card";
import CardBody from "../../card/CardBody";
import CardHeader from "../../card/CardHeader";
import CardMenu from "../../card/CardMenu";
import "./ShareModal.css";
import icons from "../../../icons/Icons";
import Icon from "../../icon/Icon";
import clipboardCopier from "../../../utility/clipboardCopier";
import { TOAST_MOODS, toastManager } from "../../../toast/ToastService";
import exportToServer from "../../../utility/exportToServer";
import storageService from "../../../services/storage/StorageService";
import flattenData from "../../../utility/flattenData";

export default function ShareModal({ id, open, onCanceled }) {
  const dialogRef = useRef(null);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const copyLink = () => {
    clipboardCopier(
      link,
      () => toastManager.push("Copied!", TOAST_MOODS.HAPPY),
      () => toastManager.push("Copy Failed!", TOAST_MOODS.SAD)
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      const deepData = await storageService.readOneDeep(id);
      return flattenData(deepData);
    };

    if (open) {
      fetchData()
        .then((data) => exportToServer(data))
        .then((id) =>
          setLink(`${import.meta.env.VITE_SHARE_FRONTEND_URL}/${id}`)
        )
        .then(() => setLoading(false));
    }
  }, [id, open]);

  if (open) {
    dialogRef.current?.close();
    dialogRef.current?.showModal();
  } else {
    dialogRef.current?.close();
  }
  const closeDialog = () => {
    dialogRef.current.close();
    onCanceled();
  };

  return (
    <dialog id="share-dialog" className="dialog" ref={dialogRef}>
      <Card>
        <CardHeader title={"Share"} icon={icons.share} />
        <CardBody>
          {loading ? (
            <p>Your shareable link will appear shortly...</p>
          ) : (
            <p>
              Copy this link to your clipboard and send it to whoever wants it.
            </p>
          )}
          <div className="share__container">
            <input type="text" value={link} disabled className="share__link" />
            <button className="button" onClick={copyLink}>
              <Icon icon={icons.clipboard} className="button__icon" />
              <span className="big-screen-only">Copy</span>
            </button>
          </div>
        </CardBody>
        <CardMenu>
          <li>
            <button
              className="button button--primary"
              onClick={() => {
                copyLink();
                closeDialog();
              }}
              disabled={!link}
            >

              <Icon icon={icons.clipboard} className="button__icon" />
              <span className="big-screen-only">
                Copy and close
              </span>
            </button>
          </li>
          <li>
            <button className="button" onClick={closeDialog}>
              <Icon icon={icons.cancel} className="button__icon" />
              <span className="big-screen-only">Never mind!</span>
            </button>
          </li>
        </CardMenu>
      </Card>
    </dialog>
  );
}
