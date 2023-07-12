import { useRef } from "react";
import Card from "../../card/Card";
import CardBody from "../../card/CardBody";
import CardHeader from "../../card/CardHeader";
import CardMenu from "../../card/CardMenu";
import "./HelpModal.css";
import icons from "../../../icons/Icons";
import Icon from "../../icon/Icon";

export default function HelpModal({ open, onCanceled }) {
  const dialogRef = useRef(null);

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
    <dialog id="delete-dialog" className="dialog" ref={dialogRef}>
      <Card>
        <CardHeader title={"Help"} icon={icons.help} />
        <CardBody>
          <p className="dialog__paragraph">
            You can create a checklist by hitting the <div className="button-replica"><Icon icon={icons.add} className="button__icon"/> <span className="big-screen-only">Create Checklist</span></div>
            button from the &apos;My Checklists&apos; page.</p> 
            <p className="dialog__paragraph">You can also hit the
            <div className="button-replica"><Icon icon={icons.clone} className="button__icon"/> <span className="big-screen-only">Clone</span></div> button on the &apos;Templates&apos; page. Either
            way, you&apos;ll end up with a checklist you can use to keep track
            of your most important work.
          </p>
        </CardBody>
        <CardMenu>
          <li>
            <button className="button" onClick={closeDialog}>
              <Icon icon={icons.cancel} className="button__icon" />
              <span className="big-screen-only">Ok, thanks!</span>
            </button>
          </li>
        </CardMenu>
      </Card>
    </dialog>
  );
}
