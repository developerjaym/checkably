import { useLoaderData, useNavigate } from "react-router-dom";
import Card from "../../reusable/card/Card";
import CardBody from "../../reusable/card/CardBody";
import CardHeader from "../../reusable/card/CardHeader";
import CardMenu from "../../reusable/card/CardMenu";
import storageService from "../../services/storage/StorageService";
import unflattenData from "../../utility/unflattenData";
import "./ChecklistResults.css";

export default function ChecklistResults() {
    const list = useLoaderData();
    const data = unflattenData(list);
    const navigate = useNavigate();
    const addChecklist = () => {
      storageService.post({isRoot: true, tags: []}).then(
        ({id}) => navigate(`/checklists/${id}`)
      )
    }
    const checklistCards = data.map(checklistObject => (
      <Card key={checklistObject.id}>
        <CardHeader title={checklistObject.title}/>
        <CardBody>
        <p>{checklistObject.description}</p>
        </CardBody>
        <CardMenu links={[{href: `/checklists/${checklistObject.id}`, text: 'View'}]}/>
      </Card>
    ));

    return (<>
    <section className='search'>
        <label className='label search__label'>
          <span className='label__text'>🔍</span>
          <input className='input input--search' type="search"/>
        </label>
      </section>
    {checklistCards}
    <button className="button button--primary" onClick={addChecklist}>+Add checklist</button>
    </>)
}