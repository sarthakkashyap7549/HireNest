import { formatPosted, formatSalary } from "../utils/format";

export default function JobCard({ job, applied = false, applying = false, onApply }) {
  return (
    <article className="card job-card h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
          <h3 className="h5 mb-0">{job.title}</h3>
          <span className="badge text-bg-light border flex-shrink-0">{job.type}</span>
        </div>
        <p className="text-secondary mb-2">{job.company}</p>

        <ul className="list-inline small text-secondary mb-2">
          <li className="list-inline-item me-3"><i className="bi bi-geo-alt me-1" aria-hidden="true"></i>{job.location} ({job.mode})</li>
          <li className="list-inline-item me-3"><i className="bi bi-cash-stack me-1" aria-hidden="true"></i>{formatSalary(job.salary)}</li>
          <li className="list-inline-item"><i className="bi bi-mortarboard me-1" aria-hidden="true"></i>{job.experience}</li>
        </ul>

        <p className="small clamp-3">{job.description}</p>

        <div className="d-flex flex-wrap gap-1 mb-3">
          {job.skills.map((s) => <span key={s} className="badge skill-badge">{s}</span>)}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <small className="text-secondary">{formatPosted(job.postedDaysAgo)}</small>
          <button className={`btn btn-sm ${applied ? "btn-success" : "btn-primary"}`}
            disabled={applied || applying} onClick={() => onApply?.(job)}>
            {applied ? (<><i className="bi bi-check2 me-1"></i>Applied</>)
              : applying ? (<><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Applying</>)
              : "Apply now"}
          </button>
        </div>
      </div>
    </article>
  );
}
