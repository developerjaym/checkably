import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import icons from "../../icons/Icons";
import Card from "../../reusable/card/Card";
import CardBody from "../../reusable/card/CardBody";
import CardHeader from "../../reusable/card/CardHeader";
import CardMenu from "../../reusable/card/CardMenu";
import Icon from "../../reusable/icon/Icon";
import Logo from "../../reusable/logo/Logo";
import HelpModal from "../../reusable/modal/help/HelpModal";
import { TOAST_MOODS, toastManager } from "../../toast/ToastService";
import importFromServer from "../../utility/importFromServer";
import storageService from "./../../services/storage/StorageService";
import "./Import.css";

export default function Import() {
  const { importId } = useParams();
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    importFromServer(importId).then((data) => setData(data)).catch(() => {
        toastManager.push("ERROR!", TOAST_MOODS.SAD)
        navigate("/my-checklists")
    });
  }, [importId, navigate]);

  const save = async () => {
    const newId = await storageService.import(data);
    navigate(`/my-checklists/${newId}`)
  }
  const discard = () => {
    toastManager.push("Import canceled", TOAST_MOODS.NEUTRAL)
    navigate("/my-checklists")
  }

  const root = data?.find((node) => node.isRoot);

  return (
    <>
      <header className="page__header">
        <Logo />
        <h2 className="page__title">Import Checklist</h2>
        <menu className="header__menu">
          <li>
            <button
              className="button button--toolbar"
              onClick={() => setHelpModalOpen(true)}
              title="See information about how to use this app"
            >
              <Icon icon={icons.help} className="button__icon" />
              <span className="big-screen-only">Help</span>
            </button>
          </li>
        </menu>
      </header>
      <main>
        <h3>Save or Discard Imported Checklists</h3>
        {!data ? (
          <p>Loading...</p>
        ) : (
          <div className="results__container">
            <Card key={root.id}>
              <CardHeader title={root.title} icon={icons.share} />
              <CardBody>
                <p>{root.description}</p>
              </CardBody>
              <CardMenu>
                <li>
                  <button className="button button--primary" onClick={save}>
                    <Icon icon={icons.ok} className="button__icon" />
                    <span className="big-screen-only">Save</span>
                  </button>
                </li>
                <li>
                  <button className="button" onClick={discard}>
                    <Icon icon={icons.cancel} className="button__icon" />
                    <span className="big-screen-only">Discard</span>
                  </button>
                </li>
              </CardMenu>
            </Card>
          </div>
        )}
      </main>
      <HelpModal
        open={helpModalOpen}
        onCanceled={() => setHelpModalOpen(false)}
      />
    </>
  );
}
