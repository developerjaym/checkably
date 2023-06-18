import { useState } from "react";
import storageService from "../services/storage/StorageService";
import "./Checklist.css"

export default function ChecklistTree({ node: checklistNode, onChecked, onDeleted }) {
    const [checkable, setCheckable] = useState(checklistNode);
    const onSelfChecked = (checked) => {
      storageService.patch(checklistNode.id, { checked });
      setCheckable({ ...checkable, checked });
      onChecked(checkable.id, checked);
    };
  
    const onSelfTitleUpdated = (title) => {
      storageService.patch(checklistNode.id, { title });
      setCheckable({ ...checkable, title });
    };
  
    const onChildItemDeleted = (node) => {
      checkable.items = checkable.items.filter((i) => i.id !== node.id);
      setCheckable({
        ...checkable,
      });
      onSelfChecked(checkable.items.every((item) => item.checked));
    };
  
    const onSelfDeleted = () => {
      storageService.deleteItem(checkable).then(() => onDeleted(checkable));
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
      <details className="checklist__item" open>
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
                <input
                  type="text"
                  className="input item__input"
                  value={checkable.title}
                  onChange={(e) => onSelfTitleUpdated(e.target.value)}
                />
              </span>
            </label>
            <menu className="summary__menu">
              <button
                className="button button--icon"
                onClick={() => onSelfDeleted()}
              >
                🗑
              </button>
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
        <button className="button" onClick={() => onChildAddedToSelf()}>
          +Add item under {checkable.title}
        </button>
      </details>
    );
  }