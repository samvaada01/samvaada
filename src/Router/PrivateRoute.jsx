import { AuthContext } from "../components/AuthProvider/AuthProvider";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import isAdminEmail from "../utils/isAdmin";

const PrivateRoute = ({ children, admin }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-1 text-center mt-52   h-[530px]">
        <span className="loading my-auto loading-spinner loading-lg"></span>
      </div>
    );
  }
  if (user) {
    // admin routes: rendering the form at all leaks the Firestore read
    if (admin && !isAdminEmail(user.email)) return <Navigate to="/" replace />;
    return children;
  }
  return (
    <Navigate
      state={location.pathname + location.search + location.hash}
      to="/login"
    />
  );
};

export default PrivateRoute;
