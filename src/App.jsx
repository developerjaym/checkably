import { useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import AddChecklistModal from "./reusable/modal/addChecklist/AddChecklistModal";
import { Toast } from "./toast/Toast";
import icons from "./icons/Icons";

function App() {
  const [openAddDialog, setOpenAddDialog] = useState(false);

  return (
    <>
      <header className="app__header">
        <img src={icons.logo.src} alt={icons.logo.alt} height={32} width={32} />
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
