import React, { useState } from "react";
import { Await, useLoaderData } from "react-router-dom";
import "./Checklist.css";
import storageService from "../services/storage/StorageService";
import unflattenData from "../utility/unflattenData";

export default function Checklist() {
  const data = useLoaderData();
  return (
    <React.Suspense fallback={<p>Loading...</p>}>
      <Await
        resolve={data.checklistData}
        errorElement={<p>Error loading checklist data</p>}
        children={(list) => <ChecklistRoot list={list} />}
      />
    </React.Suspense>
  );
}

function ChecklistRoot({ list }) {
  // TODO unflatten here;
  const [itemState, setItemState] = useState(list);
  const itemTree = unflattenData(itemState)[0]; // unflattenData returns an array of trees, I just need the only element
  const onChecked = (id, checked) => {
    setItemState(
        itemState.map((item) => (item.id === id ? { ...item, checked } : item))
      );
  };
  const onTitleChanged = (id, title) => {
    setItemState(
      itemState.map((item) => (item.id === id ? { ...item, title } : item))
    );
  };
  const onMetadataChanged = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    formData.tags = formData.tags
      .split(",")
      .filter(Boolean)
      .map((tag) => tag.toUpperCase().trim());
    storageService
      .patch(itemState.id, formData)
      .then((updatedItem) =>
        setItemState(
          itemState.map((item) => (item.isRoot ? updatedItem : item))
        )
      );
  };
  const onItemAdded = (parentId) => {
    storageService.post({ parent: parentId }).then((newItem) => {
      setItemState([...itemState, newItem]);
    });
  };
  return (
    <section>
      <header>
        <h2>{itemTree.title}</h2>
        <form className="form" onSubmit={onMetadataChanged}>
          <label className="label">
            <span className="label__text">Tags (comma-separated list)</span>
            <input
              type="text"
              name="tags"
              defaultValue={itemTree.tags.join(", ")}
            />
          </label>
          <label className="label">
            <span className="label__text">Description</span>
            <textarea name="description" defaultValue={itemTree.description} />
          </label>
          <button>Save</button>
        </form>
      </header>
      <div className="checklist__body">
        <ChecklistItem
          item={itemTree}
          onChecked={onChecked}
          onTitleUpdated={onTitleChanged}
          onItemAdded={onItemAdded}
        />
      </div>
    </section>
  );
}

function ChecklistItem({
  item: checklistItem,
  onChecked,
  onTitleUpdated,
  onItemAdded,
}) {
  const [checkable, setCheckable] = useState(checklistItem);
  const onSelfChecked = (checked) => {
    storageService.patch(checklistItem.id, { checked });
    setCheckable({ ...checkable, checked });
    onChecked(checkable.id, checked);
  };

  const onSelfTitleUpdated = (title) => {
    storageService.patch(checklistItem.id, { title });
    setCheckable({ ...checkable, title });
    onTitleUpdated(checkable.id, title);
  };

  const onChildChecked = (id, checked) => {
    checkable.items.find((item) => item.id === id).checked = checked;
    onSelfChecked(checkable.items.every((item) => item.checked));
  };

  return (
    <details className="checklist__item">
      <summary>
        <label className="label">
          <span className="label__text">
            <input
              type="text"
              value={checkable.title}
              onChange={(e) => onSelfTitleUpdated(e.target.value)}
            />
          </span>
          <input
            type="checkbox"
            checked={checkable.checked}
            onChange={(e) => onSelfChecked(e.target.checked)}
          />
        </label>
      </summary>
      {checkable.items.map((item) => (
        <ChecklistItem
          key={item.id}
          item={item}
          onChecked={onChildChecked}
          onTitleUpdated={() => {
            /*NO OP*/
          }}
          onItemAdded={onItemAdded}
        />
      ))}
      <button onClick={() => onItemAdded(checkable.id)}>
        +Add item under {checkable.title}
      </button>
    </details>
  );
}