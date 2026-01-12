import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutThunk } from "../../store/authSlice";

const Topbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
    <header className="topbar shadow-sm">
      <div className="d-flex align-items-center gap-3">
        <div className="topbar-brand">
          <i className="bi bi-stack-overflow me-2" />
          <span className="fw-bold">Harshil KSP</span>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <Link to="/profile" className="topbar-user-info">
          <div className="topbar-avatar">
            <i className="bi bi-person-circle" />
          </div>
          <div className="text-end small d-none d-md-block">
            <div className="fw-semibold">{user?.name || "User"}</div>
          </div>
        </Link>
        <button
          className="btn btn-outline-danger btn-sm topbar-logout-btn"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-1" />
          <span className="d-none d-md-inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;

