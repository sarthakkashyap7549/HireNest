import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jobService } from "../services/jobService";
import { applicationService } from "../services/applicationService";
import Loader from "../components/Loader";

const LINKS = [
  { to: "/dashboard", label: "Overview", icon: "bi-grid", end: true },
  { to: "/dashboard/jobs", label: "Job listings", icon: "bi-briefcase" },
  { to: "/dashboard/applications", label: "Applications", icon: "bi-file-earmark-check" },
  { to: "/dashboard/profile", label: "Profile", icon: "bi-person" },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyingId, setApplyingId] = useState(null);

  // Shared data lives here so every dashboard page sees the same jobs and applications.
  useEffect(() => {
    let cancelled = false;
    Promise.all([jobService.getJobs(), applicationService.list(user.id)])
      .then(([j, a]) => { if (!cancelled) { setJobs(j); setApplications(a); } })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [user.id]);

  const applyToJob = useCallback(async (job) => {
    setApplyingId(job.id);
    try {
      const application = await applicationService.apply(user.id, job);
      setApplications((prev) => [...prev, application]);
    } catch (err) {
      setError(err.message);
    } finally {
      setApplyingId(null);
    }
  }, [user.id]);

  const withdraw = useCallback(async (id) => {
    try {
      await applicationService.withdraw(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const appliedJobIds = new Set(applications.map((a) => a.jobId));
  const context = { jobs, applications, appliedJobIds, applyingId, applyToJob, withdraw };

  return (
    <div className="container-xl">
      <div className="row">
        <aside className="col-lg-3 col-xl-2 d-none d-lg-block py-4 pe-lg-3">
          <nav className="nav flex-column nav-pills gap-1 position-sticky dash-side" aria-label="Dashboard">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className="nav-link">
                <i className={`bi ${l.icon} me-2`} aria-hidden="true"></i>{l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="col-lg-9 col-xl-10 py-3 py-lg-4">
          <nav className="nav nav-pills flex-nowrap overflow-auto gap-1 mb-3 d-lg-none pb-1" aria-label="Dashboard">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className="nav-link text-nowrap">
                <i className={`bi ${l.icon} me-1`} aria-hidden="true"></i>{l.label}
              </NavLink>
            ))}
          </nav>

          {error && (
            <div className="alert alert-danger alert-dismissible" role="alert">
              {error}
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setError("")}></button>
            </div>
          )}
          {loading ? <Loader label="Loading your dashboard" /> : <Outlet context={context} />}
        </div>
      </div>
    </div>
  );
}
