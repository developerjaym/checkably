import { NavLink, useLoaderData } from "react-router-dom";
import "./ChecklistResults.css";
import unflattenData from "../../utility/unflattenData";
import Card from "../../reusable/card/Card";
import CardHeader from "../../reusable/card/CardHeader";
import CardBody from "../../reusable/card/CardBody";
import CardMenu from "../../reusable/card/CardMenu";

export default function ChecklistResults() {
    const list = useLoaderData();
    const data = unflattenData(list);
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
    </>)
}