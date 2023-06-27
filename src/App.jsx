import { NavLink, Outlet } from "react-router-dom";
import "./App.css";
import icons from "./icons/Icons";
import { Toast } from "./toast/Toast";

function App() {

  const determineNavLinkClassName = ({ isActive, isPending }) =>
    isPending ? "link link--pending" : isActive ? "link link--active" : "link";

  return (
    <>
      <header className="app__header">
        <img src={icons.logo.src} alt={icons.logo.alt} height={32} width={32} />
        <h1>Checkably</h1>
        <menu>
        <button
            className="button"
            onClick={() => console.log('help')}
          >
            <span className="button__icon">?</span>
            <span className="big-screen-only">Help</span>
          </button>
        </menu>
      </header>
      <main>
        <Outlet />
      </main>
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
    </>
  );
}

export default App;
