import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import ConfirmDeletionModal from "../reusable/modal/confirmDeletion/ConfirmDeletionModal";
import UpdateChecklistModal from "../reusable/modal/updateChecklist/UpdateChecklistModal";
import storageService from "../services/storage/StorageService";
import { TOAST_MOODS, toastManager } from "../toast/ToastService";
import "./Checklist.css";
import ChecklistTree from "./ChecklistTree";
import Logo from "../reusable/logo/Logo";
import HelpModal from "../reusable/modal/help/HelpModal";
import csvify from "../utility/csvify";
import blobify from "../utility/blobify";
import unicodeSymbols from "../icons/UnicodeSymbols";

export default function Checklist() {
  const { checklistId } = useParams();
  const [root, setRoot] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const downloadButtonRef = useRef(null);

  const navigate = useNavigate();
  const correctBackRoute = root?.isTemplate ? "/templates" : "/my-checklists";
  useEffect(() => {
    storageService
      .readOne(checklistId)
      .then((response) => setRoot(response))
      .catch((err) => {
        toastManager.push("Unable to display checklist", TOAST_MOODS.SAD);
        navigate(-1);
      });
  }, [checklistId, navigate]);

  const onDeleted = () => {
    setOpenDeleteDialog(false);
    navigate(correctBackRoute);
  };

  const onMetadataChanged = (newChecklistData) => {
    setOpenUpdateDialog(false);
    storageService
      .patch(root.id, newChecklistData)
      .then(() => storageService.readOne(checklistId))
      .then((response) => setRoot(response))
      .then(() => toastManager.push("SAVED", TOAST_MOODS.HAPPY));
  };

  const downloadCSV = async () => {
    // get csv data
    // convert csv data to blob
    // get url for blob
    // set download button's href as that url
    // set the download button's download property as a nice name for the file
    const deepTree = await storageService.readOneDeep(checklistId);
    const csvData = csvify(deepTree);
    downloadButtonRef.current.href = blobify(csvData, 'text/csv');
    downloadButtonRef.current.download = `CHECKABLY_${root.title}.csv`;
  }

  const clone = async () => {
    const newId = await storageService.clone(root.id);
    navigate(`/my-checklists/${newId}`);
  };
  if (!root) {
    return <p>Loading!!!</p>;
  }
  return (
    <>
      <header className="page__header">
        <Logo />
        <h2 className="page__title">{root.title}</h2>
        <menu className="header__menu">
          <li>
            <NavLink
              to={correctBackRoute}
              className="button button--toolbar"
              aria-label="Go back to previous page."
            >
              <span className="button__icon">{unicodeSymbols.BACK}</span>
              <span className="big-screen-only">Back</span>
            </NavLink>
          </li>
          <li>
            <button
              className="button button--toolbar"
              onClick={clone}
              title="Clone this checklist"
            >
              <span className="button__icon">{unicodeSymbols.CLONE}</span>
              <span className="big-screen-only">Clone</span>
            </button>
          </li>
          {root.isTemplate ? null : (
            <>
              <li>
                <button
                  className="button button--toolbar"
                  onClick={() => setOpenDeleteDialog(true)}
                  title="Delete this checklist"
                >
                  <span className="button__icon">{unicodeSymbols.DELETE}</span>
                  <span className="big-screen-only">Delete</span>
                </button>
              </li>
              <li>
                <button
                  className="button button--toolbar"
                  disabled={root.isTemplate}
                  title="Edit name, description, and tags"
                  onClick={() => setOpenUpdateDialog(true)}
                >
                  <span className="button__icon button__icon--pencil">{unicodeSymbols.EDIT}</span>
                  <span className="big-screen-only">Edit</span>
                </button>
              </li>
            </>
          )}
          <li>
            <a
              ref={downloadButtonRef}
              className="button button--toolbar"
              onClick={() => downloadCSV()}
              title="Download this checklist as a CSV file"
            >
              <span className="button__icon">{unicodeSymbols.DOWNLOAD}</span>
              <span className="big-screen-only">Download</span>
            </a>
          </li>
          <li>
            <button
              className="button button--toolbar"
              onClick={() => setHelpModalOpen(true)}
              title="See information about how to use this app"
            >
              <span className="button__icon">{unicodeSymbols.HELP}</span>
              <span className="big-screen-only">Help</span>
            </button>
          </li>
        </menu>
      </header>
      <main>
        <ChecklistTree
          key={`${root.title}-${root.id}`}
          id={root.id}
          onChecked={(value) => {}}
          onDeleted={() => {}}
        />
      </main>
      <ConfirmDeletionModal
        key={`delete-${root.id}`}
        open={openDeleteDialog}
        onCanceled={() => setOpenDeleteDialog(false)}
        onDeleted={onDeleted}
        id={root.id}
      />
      <UpdateChecklistModal
        key={`update-${root.id}`}
        metadata={root}
        onCancel={() => setOpenUpdateDialog(false)}
        onSave={onMetadataChanged}
        open={openUpdateDialog}
      />
      <HelpModal
        open={helpModalOpen}
        onCanceled={() => setHelpModalOpen(false)}
      />
    </>
  );
}
