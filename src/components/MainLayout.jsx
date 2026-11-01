import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";

export default function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="border-top bg-white py-3 mt-4">
        <div className="container d-flex flex-column flex-sm-row justify-content-between gap-1 small text-secondary">
          <span>© {new Date().getFullYear()} HireNest</span>
          <span>Built with React, Vite and Bootstrap</span>
        </div>
      </footer>
    </div>
  );
}
