import { Await, useLoaderData } from "react-router-dom";
import "./Checklist.css";
import React from "react";

export default function Checklist() {
  const data = useLoaderData();
  console.log("checklist component", data);

  return (
    <React.Suspense fallback={<p>Loading...</p>}>
      <Await
        resolve={data.checklistData}
        errorElement={<p>Error loading checklist data</p>}
        children={(item) => <ChecklistWrapper item={item} />}
      />
    </React.Suspense>
  );
}

function ChecklistWrapper({ item }) {
  console.log("checklistwrapper", item);
  const onChecked = (value, id) => {
    console.log("checklistwrapper item checked", id, value);
    item.checked = item;
  };
  return (
    <section>
      <header>
        <h2>{item.title}</h2>
      </header>
      <div className="checklist__body">
        <ChecklistItem checkable={item} onChecked={onChecked} />
      </div>
    </section>
  );
}

function ChecklistItem({ checkable, onChecked }) {
  console.log("checklistitem", checkable);

  const onChildChecked = (value, id) => {
    console.log("checklistitem checked", value, id);
    checkable.items.find((item) => item.id === id).checked = value;
    onChecked(
      checkable.items.every((item) => item.checked),
      checkable.id
    );
  };

  return (
    <details className="checklist__item">
      <summary>
        <label className="label">
          <span className="label__text">{checkable.title}</span>
          <input
            type="checkbox"
            value={checkable.checked}
            onChange={e => onChecked(e.target.checked, checkable.id)}
          />
        </label>
      </summary>
      {checkable.items.map((item) => (
        <ChecklistItem
          key={item.id}
          checkable={item}
          onChecked={onChildChecked}
        />
      ))}
      <button>+Add item under {checkable.title}</button>
    </details>
  );
}
