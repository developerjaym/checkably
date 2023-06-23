import { useState } from "react";
import storageService from "../services/storage/StorageService";
import "./Checklist.css";

export default function ChecklistTree({
  node: checklistNode,
  onChecked,
  onDeleted,
  isRoot,
}) {
  const [checkable, setCheckable] = useState(checklistNode);
  const onSelfChecked = (checked) => {
    storageService.patch(checklistNode.id, { checked }).then((response) => {
      setCheckable({ ...response, items: [...checkable.items] });
      onChecked(checkable.id, checked);
    });
  };

  const onSelfTitleUpdated = (title) => {
    storageService
      .patch(checklistNode.id, { title })
      .then((response) => setCheckable({ ...checkable, ...response }));
  };

  const onChildItemDeleted = (node) => {
    checkable.items = checkable.items.filter((i) => i.id !== node.id);
    setCheckable({
      ...checkable,
    });

    // Consider self checked if self is checked OR if self has items and all items are checked
    onSelfChecked(checkable.checked || (checkable.items.length && checkable.items.every((item) => item.checked)));
  };

  const onSelfDeleted = () => {
    if (isRoot) {
      return;
    }
    storageService.deleteItem(checkable.id).then(() => onDeleted(checkable));
  };

  const onChildChecked = (id, checked) => {
    checkable.items.find((item) => item.id === id).checked = checked;
    onSelfChecked(checkable.items.every((item) => item.checked));
  };

  const onChildAddedToSelf = () => {
    storageService.post({ parent: checkable.id }).then((newItem) => {
      checkable.items.push(newItem);
      newItem.items = [];
      setCheckable({ ...checkable });
      onSelfChecked(checkable.items.every((item) => item.checked));
    });
  };

  return (
    <details className="checklist__item" open={isRoot || checkable.items.length}>
      <summary className="item__summary">
        <div className="summary__container">
          <label className="label">
            <input
              className="input"
              type="checkbox"
              checked={checkable.checked}
              onChange={(e) => onSelfChecked(e.target.checked)}
            />
            <span className="label__text">
            {isRoot ? <span>{checklistNode.title}</span> :
              <input
                type="text"
                className="input item__input"
                readOnly={isRoot}
                value={checkable.title}
                onChange={(e) => onSelfTitleUpdated(e.target.value)}
                autoFocus={!checkable.title}
              />}
            </span>
          </label>
          <menu className="summary__menu">
          {isRoot ? null :
          <button
              className="button button--icon"
              onClick={() => onSelfDeleted()}
            >
              🗑
            </button>}
           
          </menu>
        </div>
      </summary>
      {checkable.items.map((item) => (
        <ChecklistTree
          key={item.id}
          node={item}
          onChecked={onChildChecked}
          onDeleted={onChildItemDeleted}
        />
      ))}
      <button className="button item__add-button small-text" onClick={() => onChildAddedToSelf()}>
        +Add item under {isRoot ? checklistNode.title : checkable.title}
      </button>
    </details>
  );
}
