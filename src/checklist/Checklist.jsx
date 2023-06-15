import { Await, useLoaderData } from "react-router-dom";
import "./Checklist.css";
import React, { useEffect, useState } from "react";

export default function Checklist() {
  const data = useLoaderData();
  console.log("checklist component", data);

  return (
    <React.Suspense fallback={<p>Loading...</p>}>
      <Await
        resolve={data.checklistData}
        errorElement={<p>Error loading checklist data</p>}
        children={(item) => <ChecklistRoot item={item} />}
      />
    </React.Suspense>
  );
}

function ChecklistRoot({ item }) {
    const [itemState, setItemState] = useState(item);
    useEffect(() => {
        console.log('re-rendering root', JSON.stringify(itemState, null, 2))
    })
  const onChecked = (value, id) => {
    console.log("checklistwrapper item checked", item.title, value);
    // item.checked = item;
    setItemState({ ...itemState, checked: value });
  };
  return (
    <section>
      <header>
        <h2>{itemState.title}</h2>
      </header>
      <div className="checklist__body">
        <ChecklistItem item={itemState} onChecked={onChecked} />
      </div>
    </section>
  );
}

function ChecklistItem({ item: checklistItem, onChecked }) {
  const [checkable, setCheckable] = useState(checklistItem);
  useEffect(() => {
    console.log('re-rendering item', checkable.checked, checkable.title)
})
  const onSelfChecked = (value) => {
    console.log('selfchecked', value);
    setCheckable({ ...checkable, checked: true });
    onChecked(value, checkable.id);
  };

  const onChildChecked = (value, id) => {
    checkable.items.find((item) => item.id === id).checked = value;

    onSelfChecked(checkable.items.every((item) => item.checked));
  };

  return (
    <details className="checklist__item">
      <summary>
        <label className="label">
          <span className="label__text">{checkable.title}</span>
          <input
            type="checkbox"
            checked={checkable.checked}
            onChange={(e) => onSelfChecked(e.target.checked)}
          />
        </label>
      </summary>
      <h2>checked: {checkable.checked ? 'true' : 'false'}</h2>
      {checkable.items.map((item) => (
        <ChecklistItem key={item.id} item={item} onChecked={onChildChecked} />
      ))}
      <button>+Add item under {checkable.title}</button>
    </details>
  );
}
