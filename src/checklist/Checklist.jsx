import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../reusable/card/Card";
import CardBody from "../reusable/card/CardBody";
import CardHeader from "../reusable/card/CardHeader";
import storageService from "../services/storage/StorageService";
import "./Checklist.css";
import ChecklistTree from "./ChecklistTree";

export default function Checklist() {
  const { checklistId } = useParams();
  const [root, setRoot] = useState(null);
  useEffect(() => {
    storageService.readOne(checklistId).then((response) => setRoot(response));
  }, [checklistId]);

  const onMetadataChanged = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));
    formData.tags = formData.tags
      .split(",")
      .filter(Boolean)
      .map((tag) => tag.toUpperCase().trim());
    storageService
      .patch(root.id, formData)
      .then((updatedItem) => setRoot({ ...root, ...updatedItem }));
  };
  if (!root) {
    return <p>Loading!!!</p>;
  }
  return (
    <>
      <header>
        <h2>{root.title}</h2>
      </header>
      <section>
        <Card>
          <CardHeader title={`Metadata for ${root.title}`} />
          <CardBody>
            <form className="form" onSubmit={onMetadataChanged}>
              <label className="label">
                <span className="label__text">Tags (comma-separated list)</span>
                <input
                  className="input"
                  type="text"
                  name="tags"
                  defaultValue={root.tags.join(", ")}
                />
              </label>
              <label className="label">
                <span className="label__text">Description</span>
                <textarea
                  className="input"
                  name="description"
                  defaultValue={root.description}
                />
              </label>
              <button className="button">Save</button>
            </form>
          </CardBody>
        </Card>
      </section>

      <section className="checklist__body">
        <Card>
          <CardHeader title={`Tree for ${root.title}`} />
          <CardBody>
            <ChecklistTree
              node={root}
              onChecked={(value) => {
                console.log("the whole thing's checked value", value);
              }}
              onDeleted={() => {
                console.log("whole thing deleted");
              }}
            />
          </CardBody>
        </Card>
      </section>
    </>
  );
}


