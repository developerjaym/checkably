import { NavLink, useLoaderData } from "react-router-dom";
import "./ChecklistResults.css";

export default function ChecklistResults() {
    const data = useLoaderData();
    console.log('checklistresults', data);
    const checklistCards = data.map(checklistObject => <section className='card' key={checklistObject.id}>
      <header className='card__header'>
  
      <h2>{checklistObject.title}</h2>
      </header>
      <div className='card__body'>
        <p>{checklistObject.description}</p>
      </div>
      <menu className="card__menu">
      <NavLink className="button menu-item__action" to={`/checklists/${checklistObject.id}`}>Play</NavLink>

      </menu>
    </section>)
    return (<>{checklistCards}</>)
}