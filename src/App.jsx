// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Outlet } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.jpeg";

function App() {
  return (
    <>
      <header>
        <img src={logo} alt="clipart of checklist" height={48} width={48}/>
        <h1>Checkably</h1>
        <nav>

        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
