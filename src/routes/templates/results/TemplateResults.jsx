import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import icons from "../../../icons/Icons";
import Card from "../../../reusable/card/Card";
import CardBody from "../../../reusable/card/CardBody";
import CardHeader from "../../../reusable/card/CardHeader";
import CardMenu from "../../../reusable/card/CardMenu";
import SearchForm from "../../../reusable/form/search/SearchForm";
import Icon from "../../../reusable/icon/Icon";
import Logo from "../../../reusable/logo/Logo";
import HelpModal from "../../../reusable/modal/help/HelpModal";
import storageService from "../../../services/storage/StorageService";
import unflattenData from "../../../utility/unflattenData";
import "./TemplateResults.css";
import { templateLoader } from "./templateLoader";

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

  const onSearch = (searchQuery) => {
    storageService
      .search({ ...searchQuery, isTemplate: true })
      .then((results) => setList(results));
  };

  const checklistCards = data.map((checklistObject) => (
    <Card key={checklistObject.id}>
      <CardHeader title={checklistObject.title} icon={icons.template} />
      <CardBody>
        <p>{checklistObject.description}</p>
      </CardBody>
      <CardMenu>
        <li>
          <Link className="button" to={`/templates/${checklistObject.id}`}>
          <Icon icon={icons.forward} className="button__icon"/>
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
              title="See information about how to use this app"
            >
             <Icon icon={icons.help} className="button__icon"/>
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
