import { EXPERIENCE_LEVELS, JOB_TYPES, LOCATIONS, WORK_MODES } from "../data/jobs";

const Select = ({ label, name, value, onChange, options }) => (
  <div className="col-6 col-md-4 col-lg">
    <label className="visually-hidden" htmlFor={`filter-${name}`}>{label}</label>
    <select id={`filter-${name}`} className="form-select" value={value} onChange={(e) => onChange(name, e.target.value)}>
      <option value="">{label}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default function SearchFilterBar({ filters, onChange, onReset }) {
  const hasFilters = Object.entries(filters).some(([k, v]) => k !== "sort" && v);
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-2">
          <div className="col-12 col-lg-4">
            <label className="visually-hidden" htmlFor="filter-q">Search jobs</label>
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search" aria-hidden="true"></i></span>
              <input id="filter-q" type="search" className="form-control" placeholder="Search title, company or skill"
                value={filters.q} onChange={(e) => onChange("q", e.target.value)} />
            </div>
          </div>
          <Select label="Location" name="location" value={filters.location} onChange={onChange} options={LOCATIONS} />
          <Select label="Job type" name="type" value={filters.type} onChange={onChange} options={JOB_TYPES} />
          <Select label="Work mode" name="mode" value={filters.mode} onChange={onChange} options={WORK_MODES} />
          <Select label="Experience" name="experience" value={filters.experience} onChange={onChange} options={EXPERIENCE_LEVELS} />
          <div className="col-6 col-md-4 col-lg">
            <label className="visually-hidden" htmlFor="filter-sort">Sort by</label>
            <select id="filter-sort" className="form-select" value={filters.sort} onChange={(e) => onChange("sort", e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="salary">Highest salary</option>
            </select>
          </div>
        </div>
        {hasFilters && (
          <button className="btn btn-link btn-sm px-0 mt-2" onClick={onReset}>
            <i className="bi bi-x-circle me-1" aria-hidden="true"></i>Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
