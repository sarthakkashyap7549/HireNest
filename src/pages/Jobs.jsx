import { useMemo, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import JobCard from "../components/JobCard";
import SearchFilterBar from "../components/SearchFilterBar";
import EmptyState from "../components/EmptyState";

const EMPTY = { q: "", location: "", type: "", mode: "", experience: "", sort: "newest" };

export default function Jobs() {
  const { jobs, appliedJobIds, applyingId, applyToJob } = useOutletContext();
  const [searchParams] = useSearchParams();
  // The home page search box passes ?q=... so the first render already shows results.
  const [filters, setFilters] = useState({ ...EMPTY, q: searchParams.get("q") || "" });

  const handleChange = (name, value) => setFilters((f) => ({ ...f, [name]: value }));

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return jobs
      .filter((j) => {
        if (q && ![j.title, j.company, j.location, ...j.skills].some((t) => t.toLowerCase().includes(q))) return false;
        if (filters.location && j.location !== filters.location) return false;
        if (filters.type && j.type !== filters.type) return false;
        if (filters.mode && j.mode !== filters.mode) return false;
        if (filters.experience && j.experience !== filters.experience) return false;
        return true;
      })
      .sort((a, b) => (filters.sort === "salary" ? b.salary - a.salary : a.postedDaysAgo - b.postedDaysAgo));
  }, [jobs, filters]);

  return (
    <>
      <h1 className="h3 mb-3">Job listings</h1>
      <SearchFilterBar filters={filters} onChange={handleChange} onReset={() => setFilters(EMPTY)} />
      <p className="text-secondary small" aria-live="polite">
        {results.length} {results.length === 1 ? "job" : "jobs"} found
      </p>

      {results.length === 0 ? (
        <EmptyState icon="bi-search" title="No jobs match your filters"
          text="Try a different keyword or clear some filters."
          action={<button className="btn btn-outline-primary btn-sm" onClick={() => setFilters(EMPTY)}>Clear filters</button>} />
      ) : (
        <div className="row g-3">
          {results.map((job) => (
            <div key={job.id} className="col-md-6 col-xxl-4">
              <JobCard job={job} applied={appliedJobIds.has(job.id)} applying={applyingId === job.id} onApply={applyToJob} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
