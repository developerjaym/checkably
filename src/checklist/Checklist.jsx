import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import icons from "../icons/Icons";
import Icon from "../reusable/icon/Icon";
import Logo from "../reusable/logo/Logo";
import ConfirmDeletionModal from "../reusable/modal/confirmDeletion/ConfirmDeletionModal";
import HelpModal from "../reusable/modal/help/HelpModal";
import ShareModal from "../reusable/modal/share/ShareModal";
import UpdateChecklistModal from "../reusable/modal/updateChecklist/UpdateChecklistModal";
import storageService from "../services/storage/StorageService";
import { TOAST_MOODS, toastManager } from "../toast/ToastService";
import blobify from "../utility/blobify";
import csvify from "../utility/csvify";
import "./Checklist.css";
import ChecklistTree from "./ChecklistTree";
import flattenData from "../utility/flattenData";

export default function Checklist() {
  const { checklistId } = useParams();
  const [root, setRoot] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
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
              <Icon icon={icons.back} className="button__icon"/>
              <span className="big-screen-only">Back</span>
            </NavLink>
          </li>
          <li>
            <button
              className="button button--toolbar"
              onClick={clone}
              title="Clone this checklist"
            >
              <Icon icon={icons.clone} className="button__icon"/>
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
                  <Icon icon={icons.delete} className="button__icon"/>
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
                <Icon icon={icons.edit} className="button__icon"/>
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
              <Icon icon={icons.download} className="button__icon"/>
              <span className="big-screen-only">Download</span>
            </a>
          </li>
          <li>
            <button
              className="button button--toolbar"
              onClick={() => setShareModalOpen(true)}
              title="Share a copy of this checklist"
            >
              <Icon icon={icons.share} className="button__icon"/>
              <span className="big-screen-only">Share</span>
            </button>
          </li>
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
      <ShareModal id={root?.id} open={shareModalOpen} onCanceled={() => setShareModalOpen(false)}/>
    </>
  );
}
