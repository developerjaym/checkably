import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import icons from "../../../icons/Icons";
import Card from "../../../reusable/card/Card";
import CardBody from "../../../reusable/card/CardBody";
import CardHeader from "../../../reusable/card/CardHeader";
import CardMenu from "../../../reusable/card/CardMenu";
import SearchForm from "../../../reusable/form/search/SearchForm";
import storageService from "../../../services/storage/StorageService";
import unflattenData from "../../../utility/unflattenData";
import "./TemplateResults.css";
import { templateLoader } from "./templateLoader";

export default function TemplateResults() {
  const [list, setList] = useState([]);

  useEffect(() => {
    const load = async () => {
      const roots = await templateLoader();
      setList(roots);
    };
    load();
  }, []);
  const data = unflattenData(list);

  const onSearch = (e) => {
    e.preventDefault();
    const searchQuery = Object.fromEntries(new FormData(e.target));
    storageService
      .search({ ...searchQuery, isTemplate: true })
      .then((results) => setList(results));
  };

  const checklistCards = data.map((checklistObject) => (
    <Card key={checklistObject.id}>
      <CardHeader title={checklistObject.title} icon={icons.logo} />
      <CardBody>
        <p>{checklistObject.description}</p>
      </CardBody>
      <CardMenu>
        <li>
          <Link className="button" to={`/templates/${checklistObject.id}`}>
            <span className="button__icon">&gt;</span>
            <span className="big-screen-only">View</span>
          </Link>
        </li>
      </CardMenu>
    </Card>
  ));

  return (
    <>
      <header className="page__header">
        <h2>Checklist Templates</h2>
      </header>
      <SearchForm
        onSearch={onSearch}
        ariaLabel={"Search through checklist templates"}
      />
      <div className="results__container">{checklistCards}</div>
    </>
  );
}
