import React from 'react';
import * as ReactDOM from "react-dom/client";
import {
  createHashRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Checklist from './checklist/Checklist';
import './index.css';
import ChecklistResults from './routes/home/ChecklistResults';

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ChecklistResults />
      },
      {
        path: "/checklists/:checklistId",
        element: <Checklist />
      },
    ],
  },
  {
    path:"*",
    element: <Navigate to="/" replace/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>,
)
