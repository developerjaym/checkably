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
  const [detailsOpen, setDetailsOpen] = useState(isRoot || checkable?.items?.length);
  const onSelfChecked = (checked) => {
    storageService.patch(checklistNode.id, { checked }).then((response) => {
      setCheckable({ ...response, items: [...checkable.items] });
      onChecked(checkable.id, checked);
    });
  };

  const onSelfTitleUpdated = (title) => {
    storageService
      .patch(checklistNode.id, { title })
      .then((response) => {
        setCheckable({ ...response, items: [...checkable.items] })});
  };

  const onChildItemDeleted = (node) => {
    checkable.items = checkable.items.filter((i) => i.id !== node.id);
    setCheckable({
      ...checkable,
    });

    // Consider self checked if self is checked OR if self has items and all items are checked
    onSelfChecked(
      checkable.checked ||
        (checkable.items.length &&
          checkable.items.every((item) => item.checked))
    );
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
      setDetailsOpen(true);
      setCheckable({ ...checkable });
      onSelfChecked(checkable.items.every((item) => item.checked));
    });
  };
  return (
    <div
      className={"checklist__item"}
    >
      <div className="item__summary">
        <div className="summary__container">
          <button aria-label={detailsOpen ? `Hide subitems.` : 'Show subitems.'} className={`button button--icon summary__button summary__button--${detailsOpen ? 'open' : 'closed'}`} onClick={() => setDetailsOpen(!detailsOpen)}>▼</button>
          <input
            className="input item__checkbox"
            type="checkbox"
            disabled={checklistNode.isTemplate}
            checked={checkable.checked}
            onChange={(e) => onSelfChecked(e.target.checked)}
            aria-label={isRoot ? checklistNode.title : checkable.title}
          />
          {isRoot || checklistNode.isTemplate ? (
            <span className="item__text">{checklistNode.title}</span>
          ) : (
            <input
              type="text"
              className="input item__input item__text"
              value={checkable.title}
              onChange={(e) => onSelfTitleUpdated(e.target.value)}
              autoFocus={!checkable.title}
            />
          )}
          <menu className="summary__menu">
            {isRoot || checklistNode.isTemplate ? null : (
              <li>
                <button
                  className="button button--icon"
                  onClick={() => onSelfDeleted()}
                >
                  🗑
                </button>
              </li>
            )}
            {checklistNode.isTemplate ? null : (
              <button
                disabled={checklistNode.isTemplate}
                className="button button--icon"
                title={`Add item under ${
                  isRoot ? checklistNode.title : checkable.title
                }`}
                onClick={() => onChildAddedToSelf()}
              >
                +
              </button>
            )}
          </menu>
        </div>
      </div>
      <div className={`item__body item__body--${detailsOpen ? 'open' : 'closed'}`}>
      {checkable.items.map((item) => (
        <ChecklistTree
          key={item.id}
          node={item}
          onChecked={onChildChecked}
          onDeleted={onChildItemDeleted}
        />
      ))}
      </div>
    </div>
  );
}
