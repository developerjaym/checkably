import { NavLink, Outlet } from "react-router-dom";
import "./App.css";
import { Toast } from "./toast/Toast";
import HelpModal from "./reusable/modal/help/HelpModal";
import { useState } from "react";

function App() {
  const determineNavLinkClassName = ({ isActive, isPending }) =>
    isPending ? "link link--pending" : isActive ? "link link--active" : "link";

  return (
    <>
      <Outlet />
      <footer className="app__footer">
        <nav className="app__nav">
          <NavLink to={"/templates"} className={determineNavLinkClassName}>
            Templates
          </NavLink>
          <NavLink to={"/my-checklists"} className={determineNavLinkClassName}>
            My Checklists
          </NavLink>
        </nav>
      </footer>
      <Toast />
      {/* <HelpModal open={helpModalOpen} onCanceled={() => setHelpModalOpen(false)}/> */}
    </>
  );
}

export default App;
