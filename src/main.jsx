import React from "react";
import ReactDOM from "react-dom/client";
import { Suspense } from 'react'
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router.jsx";
import AuthProvider from "./components/AuthProvider/AuthProvider";
import { loadEvents } from "./utils/events";

// Fired before React mounts so the archive is in flight while the bundle
// executes and auth resolves, instead of after both.
loadEvents().catch(() => {}); // callers surface the error; this just warms it

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={null}>

      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </Suspense>

  </React.StrictMode>
);
