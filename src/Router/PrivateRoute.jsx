import { AuthContext } from "../components/AuthProvider/AuthProvider";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import isAdminEmail from "../utils/isAdmin";
import Loading from "../components/Loading/Loading";

const PrivateRoute = ({ children, admin }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // gated routes genuinely cannot render before auth resolves — unlike the
  // public homepage, which is why the global overlay is gone
  if (loading) return <Loading />;
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
