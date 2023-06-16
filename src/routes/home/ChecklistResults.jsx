import { NavLink, useLoaderData } from "react-router-dom";
import "./ChecklistResults.css";

export default function ChecklistResults() {
    const data = useLoaderData();
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
    return (<>
    <section className='search'>
        <label className='label search__label'>
          <span className='label__text'>Search</span>
          <input className='input input--search' type="search"/>
        </label>
      </section>
    {checklistCards}
    </>)
}