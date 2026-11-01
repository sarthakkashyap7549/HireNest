import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jobService } from "../services/jobService";
import { formatSalary } from "../utils/format";

export default function Home() {
  const [query, setQuery] = useState("");
  const [latest, setLatest] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    jobService.getJobs().then((jobs) => setLatest([...jobs].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo).slice(0, 4)));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/dashboard/jobs?q=${encodeURIComponent(q)}` : "/dashboard/jobs");
  };

  return (
    <>
      <section className="hero py-5">
        <div className="container py-lg-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1 className="display-5 mb-3">Find the job that fits. Apply in a click.</h1>
              <p className="lead text-secondary mb-4">
                Search openings by skill, city or experience, keep one profile, and track every application in one place.
              </p>
              <form className="hero-search" onSubmit={handleSearch} role="search">
                <label className="visually-hidden" htmlFor="hero-q">Search jobs</label>
                <div className="input-group input-group-lg">
                  <input id="hero-q" className="form-control" type="search" placeholder="Try “React” or “Python”"
                    value={query} onChange={(e) => setQuery(e.target.value)} />
                  <button className="btn btn-primary px-4" type="submit">Search jobs</button>
                </div>
              </form>
              <p className="small text-secondary mt-3 mb-0">
                No account yet? <Link to="/register">Create one free</Link> to apply.
              </p>
            </div>

            <div className="col-lg-6">
              <div className="card shadow-sm">
                <div className="card-header bg-white fw-semibold">Latest openings</div>
                <ul className="list-group list-group-flush">
                  {latest.map((job) => (
                    <li key={job.id} className="list-group-item d-flex justify-content-between align-items-center gap-3">
                      <div className="min-w-0">
                        <div className="fw-medium text-truncate">{job.title}</div>
                        <div className="small text-secondary text-truncate">{job.company} · {job.location}</div>
                      </div>
                      <span className="badge text-bg-light border flex-shrink-0">{formatSalary(job.salary)}</span>
                    </li>
                  ))}
                  {latest.length === 0 && <li className="list-group-item text-secondary">Loading openings…</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <h2 className="h3 mb-4">How it works</h2>
        <ol className="row g-4 list-unstyled steps">
          {[
            ["Create your profile", "Add your role, skills and a short introduction so employers know who you are."],
            ["Search and filter", "Narrow openings by location, job type, work mode and experience level."],
            ["Apply and track", "Apply from any listing, then follow every application from your dashboard."],
          ].map(([title, text], i) => (
            <li key={title} className="col-md-4">
              <div className="d-flex gap-3">
                <span className="step-num" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className="h5">{title}</h3>
                  <p className="text-secondary mb-0">{text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
