import React from 'react'
import * as ReactDOM from "react-dom/client";
import {
  createHashRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App"
import './index.css'
import { homeLoader } from './routes/home/homeLoader';
import Checklist from './checklist/Checklist';
import { checklistLoader } from './checklist/checklistLoader';
import ChecklistResults from './routes/home/ChecklistResults';

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ChecklistResults />,
        loader: homeLoader
      },
      {
        path: "/checklists/:checklistId",
        element: <Checklist />,
        loader: checklistLoader
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
