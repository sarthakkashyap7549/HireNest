import { Link, useOutletContext } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";
import { formatDate, profileCompleteness } from "../utils/format";

export default function Overview() {
  const { user } = useAuth();
  const { jobs, applications } = useOutletContext();
  const completeness = profileCompleteness(user);
  const recentJobs = [...jobs].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, 4);
  const recentApps = [...applications].reverse().slice(0, 4);

  return (
    <>
      <h1 className="h3 mb-1">Hello, {user.fullName.split(" ")[0]}</h1>
      <p className="text-secondary mb-4">Here is where things stand today.</p>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-4"><StatCard icon="bi-briefcase" label="Open jobs" value={jobs.length} /></div>
        <div className="col-sm-6 col-xl-4"><StatCard icon="bi-file-earmark-check" label="Your applications" value={applications.length} /></div>
        <div className="col-sm-12 col-xl-4">
          <StatCard icon="bi-person-check" label="Profile complete" value={`${completeness}%`}>
            <div className="progress mt-1" style={{ height: 6 }} role="progressbar" aria-valuenow={completeness} aria-valuemin="0" aria-valuemax="100">
              <div className="progress-bar" style={{ width: `${completeness}%` }}></div>
            </div>
          </StatCard>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <span className="fw-semibold">New openings</span>
              <Link to="/dashboard/jobs" className="small">See all</Link>
            </div>
            <ul className="list-group list-group-flush">
              {recentJobs.map((j) => (
                <li key={j.id} className="list-group-item">
                  <div className="fw-medium">{j.title}</div>
                  <div className="small text-secondary">{j.company} · {j.location}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Recent applications</span>
              <Link to="/dashboard/applications" className="small">See all</Link>
            </div>
            {recentApps.length === 0 ? (
              <EmptyState icon="bi-send" title="No applications yet" text="Find a role you like and apply in one click."
                action={<Link className="btn btn-primary btn-sm" to="/dashboard/jobs">Browse jobs</Link>} />
            ) : (
              <ul className="list-group list-group-flush">
                {recentApps.map((a) => {
                  const job = jobs.find((j) => j.id === a.jobId) ?? a.job;
                  return (
                    <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center gap-2">
                      <div>
                        <div className="fw-medium">{job?.title}</div>
                        <div className="small text-secondary">{job?.company} · {formatDate(a.appliedAt)}</div>
                      </div>
                      <span className="badge text-bg-primary">{a.status}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
