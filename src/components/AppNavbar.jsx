import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppNavbar() {
  const [open, setOpen] = useState(false); // controls the mobile menu (no Bootstrap JS needed)
  const { user, isAuthenticated, logout } = useAuth();
  const close = () => setOpen(false);
  const linkClass = ({ isActive }) => `nav-link${isActive ? " active fw-semibold" : ""}`;

  const handleLogout = () => {
    close();
    logout();
    window.location.assign("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand brand" to="/" onClick={close}>
          <i className="bi bi-briefcase-fill me-2 text-primary" aria-hidden="true"></i>HireNest
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="mainMenu"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse${open ? " show" : ""}`} id="mainMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className={linkClass} to="/" end onClick={close}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClass} to="/dashboard/jobs" onClick={close}>Browse jobs</NavLink>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <NavLink className={linkClass} to="/dashboard" end onClick={close}>Dashboard</NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex flex-column flex-lg-row gap-2 align-items-lg-center">
            {isAuthenticated ? (
              <>
                <span className="navbar-text me-lg-2 d-none d-lg-inline">{user.fullName.split(" ")[0]}</span>
                <button className="btn btn-outline-primary" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-primary" to="/login" onClick={close}>Log in</Link>
                <Link className="btn btn-primary" to="/register" onClick={close}>Create account</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
