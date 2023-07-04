import { memo, useEffect, useState } from "react";
import storageService from "../services/storage/StorageService";
import "./Checklist.css";

const ChecklistMemo = memo(ChecklistTree, (oldProps, newProps) => oldProps.id === newProps.id)

export default function ChecklistTree({
  id,
  onChecked,
  onDeleted
}) {
  const [checkable, setCheckable] = useState(null);
  const [title, setTitle] = useState('');
  useEffect(() => {
    const getCheckable = async () => {
      const thisNode = await storageService.readOne(id);
      setDetailsOpen(thisNode.isRoot || thisNode?.items?.length)
      setCheckable(thisNode)
      setTitle(thisNode.title);
    }
    getCheckable();
  }, [id]);
  const [detailsOpen, setDetailsOpen] = useState(checkable?.isRoot || checkable?.items?.length);
  const onSelfChecked = (checked) => {
    storageService.patch(id, { checked }).then((response) => {
      setCheckable({ ...response, items: [...checkable.items] });
      onChecked(checkable.id, checked);
    });
  };

  const onSelfTitleUpdated = (title) => {
    setTitle(title);
  }

  const onTitleCommitted = (title) => {
    storageService
      .patch(id, { title })
      // .then((response) => {
      //   setCheckable({ ...response, items: [...checkable.items] })});
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
    if (checkable.isRoot) {
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
  if(!checkable) {
    return <h1>Loading...</h1>
  }
  return (
    <div
      className={"checklist__item"}
    >
      <div className="item__summary">
          <button aria-label={detailsOpen ? `Hide subitems.` : 'Show subitems.'} className={`button button--icon summary__button summary__button--${detailsOpen ? 'open' : 'closed'}`} onClick={() => setDetailsOpen(!detailsOpen)}>▼</button>
          <input
            className="input item__checkbox"
            type="checkbox"
            disabled={checkable.isTemplate}
            checked={checkable.checked}
            onChange={(e) => onSelfChecked(e.target.checked)}
            aria-label={checkable.isRoot ? checkable.title : checkable.title}
          />
          {checkable.isRoot || checkable.isTemplate ? (
            <span className="item__text">{checkable.title}</span>
          ) : (
            <input
              type="text"
              className="input item__input item__text"
              value={title}
              onChange={(e) => onSelfTitleUpdated(e.target.value)}
              autoFocus={checkable?.title === ''}
              onBlur={() => onTitleCommitted(title)}
            />
          )}
          <menu className="summary__menu">
            {checkable.isRoot || checkable.isTemplate ? null : (
              <li>
                <button
                  className="button button--icon"
                  title={`Delete ${
                  checkable.isRoot ? checkable.title : checkable.title
                }${checkable?.items?.length ? ' and its subitems' : ''}`}
                  onClick={() => onSelfDeleted()}
                >
                  🗑
                </button>
              </li>
            )}
            {checkable.isTemplate ? null : (
              <button
                disabled={checkable.isTemplate}
                className="button button--icon"
                title={`Add item under ${
                  checkable.isRoot ? checkable.title : checkable.title
                }`}
                onClick={() => onChildAddedToSelf()}
              >
                +
              </button>
            )}
          </menu>
      </div>
      <div className={`item__body item__body--${detailsOpen ? 'open' : 'closed'}`}>
      {checkable.items.map((item) => (
        <ChecklistMemo
          key={item.id}
          id={item.id}
          onChecked={onChildChecked}
          onDeleted={onChildItemDeleted}
        />
      ))}
      </div>
    </div>
  );
}
