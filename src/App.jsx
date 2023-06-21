import { NavLink, Outlet } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.jpeg";
import { Toast } from "./toast/Toast";
import { useState } from "react";
import AddChecklistModal from "./reusable/modal/addChecklist/AddChecklistModal";

function App() {
  const [openAddDialog, setOpenAddDialog] = useState(false);

  return (
    <>
      <header className="app__header">
        <img src={logo} alt="clipart of checklist" height={32} width={32} />
        <h1>Checkably</h1>
        <nav className="header__nav">
        <button className="button button--primary" onClick={() => setOpenAddDialog(true)}><span className="button__icon">+</span><span className="big-screen-only">Create</span></button>
          
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <Toast/>
      <AddChecklistModal open={openAddDialog} onClose={() => setOpenAddDialog(false)}/>

    </>
  );
}

export default App;
