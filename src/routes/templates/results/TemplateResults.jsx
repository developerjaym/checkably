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
import Logo from "../../../reusable/logo/Logo";
import HelpModal from "../../../reusable/modal/help/HelpModal";

export default function TemplateResults() {
  const [list, setList] = useState([]);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

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
        <Logo />
        <h2 className="page__title">Checklist Templates</h2>
        <menu className="header__menu">
          <li>
            <button
              className="button button--toolbar"
              onClick={() => setHelpModalOpen(true)}
            >
              <span className="button__icon">?</span>
              <span className="big-screen-only">Help</span>
            </button>
          </li>
        </menu>
      </header>
      <main>
        <SearchForm
          onSearch={onSearch}
          ariaLabel={"Search through checklist templates"}
        />
        <div className="results__container">{checklistCards}</div>
      </main>
      <HelpModal
        open={helpModalOpen}
        onCanceled={() => setHelpModalOpen(false)}
      />
    </>
  );
}
