import { NavLink, Outlet } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.jpeg";
import { Toast } from "./toast/Toast";

function App() {
  return (
    <>
      <header className="app__header">
        <img src={logo} alt="clipart of checklist" height={32} width={32} />
        <h1>Checkably</h1>
        <nav className="header__nav">
        <NavLink to={"/"}>🏠</NavLink>
          
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <Toast/>
    </>
  );
}

export default App;
