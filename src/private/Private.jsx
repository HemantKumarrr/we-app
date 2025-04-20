import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Private = ({ allowedRoles }) => {
  const isAuth = useSelector((state) => state.auth.user);

  if (!isAuth?.user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(isAuth?.user?.role)) return <Navigate to="/" />;

  return <Outlet />;
};

export default Private;
