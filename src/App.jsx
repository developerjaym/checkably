import { Outlet } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.jpeg";

function App() {
  return (
    <>
      <header className="app__header">
        <img src={logo} alt="clipart of checklist" height={32} width={32} />
        <h1>Checkably</h1>
        <nav></nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
