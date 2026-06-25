import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import Home from "../components/pages/Home/Home";
import Login from "../components/pages/Login/Login";
import PrivateRoute from "./PrivateRoute";
import ErrorPage from "../components/pages/ErrorPage";
import AddEvent from "../components/pages/Admin/AddEvent";
import UpdateEvent from "../components/pages/Admin/UpdateEvent";
import Events from "../components/pages/events/events";
import Gallery from "../components/pages/Gallery/Gallery";
import Community from "../components/pages/Community/Community";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        loader: () => fetch("/events-data.json"),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/community",
        element: <Community />,
      },
      {
        path: "/events",
        element: (
          <PrivateRoute>
            <Events />
          </PrivateRoute>
        ), // ✅ Protected Events Page
      },
      {
        path: "/events/:id/gallery",
        element: (
          <PrivateRoute>
            <Gallery />
          </PrivateRoute>
        ), // ✅ In-site photo gallery (Drive-backed)
      },
      {
        path: "/admin/add-event",
        element: (
          <PrivateRoute>
            <AddEvent />
          </PrivateRoute>
        ),
      },
      {
        path: "/admin/update-event/:id",
        element: (
          <PrivateRoute>
            <UpdateEvent />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
