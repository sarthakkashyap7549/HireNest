import { Link, useOutletContext } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { formatDate } from "../utils/format";

const STATUS_STYLE = {
  Applied: "text-bg-primary",
  "Under review": "text-bg-warning",
  Interview: "text-bg-success",
  Rejected: "text-bg-danger",
};

export default function Applications() {
  const { applications, jobs, withdraw } = useOutletContext();

  return (
    <>
      <h1 className="h3 mb-3">Your applications</h1>
      {applications.length === 0 ? (
        <div className="card">
          <EmptyState icon="bi-send" title="You haven't applied to any jobs yet"
            text="Applications you submit will show up here."
            action={<Link className="btn btn-primary" to="/dashboard/jobs">Browse jobs</Link>} />
        </div>
      ) : (
        <div className="card">
          <ul className="list-group list-group-flush">
            {[...applications].reverse().map((a) => {
              const job = jobs.find((j) => j.id === a.jobId) ?? a.job; // works with populated or plain API data
              return (
                <li key={a.id} className="list-group-item">
                  <div className="d-flex flex-column flex-sm-row justify-content-between gap-2">
                    <div>
                      <div className="fw-semibold">{job?.title}</div>
                      <div className="small text-secondary">{job?.company} · {job?.location}</div>
                      <div className="small text-secondary">Applied on {formatDate(a.appliedAt)}</div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span className={`badge ${STATUS_STYLE[a.status] || "text-bg-secondary"}`}>{a.status}</span>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => withdraw(a.id)}>Withdraw</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
