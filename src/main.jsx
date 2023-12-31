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
import TemplateResults from './routes/templates/results/TemplateResults';
import Import from './routes/import/Import';

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/my-checklists",
        element: <ChecklistResults />
      },
      {
        path: "/my-checklists/:checklistId",
        element: <Checklist />
      },
      {
        path: "/templates",
        element: <TemplateResults/>
      },
      {
        path: "/templates/:checklistId",
        element: <Checklist/>
      },
      {
        path: "/import/:importId",
        element: <Import/>
      },
      {
        path:"/",
        element: <Navigate to="/my-checklists" replace/>
      }
    ],
  },
  {
    path:"*",
    element: <Navigate to="/my-checklists" replace/>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>,
)
