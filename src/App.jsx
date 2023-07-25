import { NavLink, Outlet } from "react-router-dom";
import "./App.css";
import { Toast } from "./toast/Toast";
import Icon from "./reusable/icon/Icon";
import icons from "./icons/Icons";
import Decoration from "./reusable/decoration/Decoration";

function App() {
  const determineNavLinkClassName = ({ isActive, isPending }) =>
    isPending ? "link link--pending" : isActive ? "link link--active" : "link";

  return (
    <>
      <Outlet />
      <footer className="app__footer">
        <nav className="app__nav">
          <NavLink to={"/templates"} className={determineNavLinkClassName}>
          <Icon icon={icons.template} className="button__icon"/>
            Templates
          </NavLink>
          <NavLink to={"/my-checklists"} className={determineNavLinkClassName}>
          <Icon icon={icons.checklist} className="button__icon"/>
            My Checklists
          </NavLink>
        </nav>
      </footer>
      <Toast />
      <Decoration/>
    </>
  );
}

export default App;
