import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../reusable/card/Card";
import CardBody from "../../reusable/card/CardBody";
import CardHeader from "../../reusable/card/CardHeader";
import CardMenu from "../../reusable/card/CardMenu";
import storageService from "../../services/storage/StorageService";
import { TOAST_MOODS, toastManager } from "../../toast/ToastService";
import unflattenData from "../../utility/unflattenData";
import "./ChecklistResults.css";
import { homeLoader } from "./homeLoader";

export default function ChecklistResults() {
    const [list, setList] = useState([])
    useEffect(() => {
      const load = async () => {
        const roots = await homeLoader();
        setList(roots);
      }
      load();
    }, [])
    const data = unflattenData(list);
    const navigate = useNavigate();
    const confirmDeletionDialogRef = useRef(null)
    const focusedResult = useRef(null);
    const addChecklist = () => {
      storageService.post({isRoot: true, tags: []}).then(
        ({id}) => navigate(`/checklists/${id}`)
      )
    }
    const openConfirmDeletionDialog = (checklistNode) => {
      focusedResult.current = checklistNode;
      confirmDeletionDialogRef.current.showModal();
    }
    const closeConfirmDeletionDialog = () => {
      confirmDeletionDialogRef.current.close();
    }
    const confirmDeletion = () => {
      closeConfirmDeletionDialog();
      storageService.deleteItem(focusedResult.current).then(
        () => homeLoader()
      )
      .then(newList => setList(newList))
      .then(() => toastManager.push("Deleted", TOAST_MOODS.NEUTRAL))
      .catch((err) => toastManager.push(`Failed: ${err}`, TOAST_MOODS.SAD))
    }
    const checklistCards = data.map(checklistObject => (
      <Card key={checklistObject.id}>
        <CardHeader title={checklistObject.title}/>
        <CardBody>
        <p>{checklistObject.description}</p>
        </CardBody>
        <CardMenu links={[{href: `/checklists/${checklistObject.id}`, text: 'View'}]}>
          <button className="button" onClick={()=>openConfirmDeletionDialog(checklistObject)}><span className="button__icon">🗑</span><span className="big-screen-only">Delete</span></button>
        </CardMenu>
      </Card>
    ));

    return (<>
    <section className='search'>
        <label className='label search__label'>
          <span className='label__text'>🔍</span>
          <input className='input input--search' type="search"/>
        </label>
      </section>
      <div className="results__container">

    {checklistCards}
      </div>
    <button className="button button--primary" onClick={addChecklist}>+Add checklist</button>
    <dialog className="dialog" ref={confirmDeletionDialogRef}>
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
    </dialog>
    </>)
}