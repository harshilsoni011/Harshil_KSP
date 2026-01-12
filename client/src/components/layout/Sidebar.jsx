import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutThunk } from "../../store/authSlice";
import { fetchSidebarData } from "../../store/commonSlice";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { trendingTags, topUsers } = useAppSelector((state) => state.common);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  useEffect(() => {
    // Initial fetch if needed, though Dashboard triggers it too
    dispatch(fetchSidebarData());
  }, [dispatch]);

  const linkClass = ({ isActive }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <aside className="sidebar-nav">
      <div className="sidebar-brand">
        <i className="fas fa-brain me-2" />
        <i className="bi bi-stack-overflow me-2" />

        <span>KSP</span>
      </div>
      <div className="sidebar-header">
        <i className="fas fa-bars me-2" />
        Menu
      </div>
      <nav className="sidebar-nav-links">
        <NavLink to="/" className={linkClass}>
          <i className="bi bi-house-door-fill me-2" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/ask" className={linkClass}>
          <i className="bi bi-question-circle-fill me-2" />
          <span>Ask Question</span>
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <i className="bi bi-person-circle me-2" />
          <span>My Profile</span>
        </NavLink>
        <button
          className="btn btn-link sidebar-link text-start w-100"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-2" />
          <span>Logout</span>
        </button>
      </nav>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <i className="bi bi-fire me-2" />
          <span>Trending Tags</span>
        </div>
        <div className="sidebar-tags">
          {trendingTags.length > 0 ? (
            trendingTags.slice(0, 5).map((tag, idx) => (
              <span key={idx} className="sidebar-tag">
                <i className="bi bi-tag-fill me-1" />
                {typeof tag === "string" ? tag : tag._id || tag.name || tag}
              </span>
            ))
          ) : (
            <small className="text-muted">No trending tags yet</small>
          )}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <i className="bi bi-trophy-fill me-2" />
          <span>Top Users</span>
        </div>
        <div className="sidebar-users">
          {topUsers.length > 0 ? (
            topUsers.slice(0, 5).map((u) => (
              <div key={u._id} className="sidebar-user-item">
                <i className="bi bi-person-circle me-2" />
                <span className="flex-grow-1">{u.name}</span>
                <span className="badge bg-success">{u.reputation || 0}</span>
              </div>
            ))
          ) : (
            <small className="text-muted">No users yet</small>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

