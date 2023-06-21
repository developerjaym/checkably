import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../reusable/card/Card";
import CardBody from "../../reusable/card/CardBody";
import CardHeader from "../../reusable/card/CardHeader";
import CardMenu from "../../reusable/card/CardMenu";
import ConfirmDeletionModal from "../../reusable/modal/confirmDeletion/ConfirmDeletionModal";
import storageService from "../../services/storage/StorageService";
import unflattenData from "../../utility/unflattenData";
import "./ChecklistResults.css";
import { homeLoader } from "./homeLoader";

export default function ChecklistResults() {
    const [list, setList] = useState([])
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const focusedNode = useRef(null)
    useEffect(() => {
      const load = async () => {
        const roots = await homeLoader();
        setList(roots);
      }
      load();
    }, [])
    const data = unflattenData(list);
    const navigate = useNavigate();
    const addChecklist = () => {
      storageService.post({isRoot: true, tags: []}).then(
        ({id}) => navigate(`/checklists/${id}`)
      )
    }
    const onDeleted = () => {
      setOpenDeleteDialog(false);
      homeLoader().then(newList => setList(newList))
    }
    const checklistCards = data.map(checklistObject => (
      <Card key={checklistObject.id}>
        <CardHeader title={checklistObject.title}/>
        <CardBody>
        <p>{checklistObject.description}</p>
        </CardBody>
        <CardMenu links={[{href: `/checklists/${checklistObject.id}`, text: 'View'}]}>
          <button className="button" onClick={()=>{focusedNode.current = checklistObject; setOpenDeleteDialog(true)}}><span className="button__icon">🗑</span><span className="big-screen-only">Delete</span></button>
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
    
    <ConfirmDeletionModal open={openDeleteDialog} onCanceled={() => setOpenDeleteDialog(false)} onDeleted={onDeleted} node={focusedNode.current}/>
    </>)
}