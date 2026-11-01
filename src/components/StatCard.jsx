export default function StatCard({ icon, label, value, children }) {
  return (
    <div className="card h-100">
      <div className="card-body d-flex align-items-center gap-3">
        <span className="stat-icon"><i className={`bi ${icon}`} aria-hidden="true"></i></span>
        <div className="flex-grow-1">
          <div className="text-secondary small">{label}</div>
          <div className="h3 mb-0">{value}</div>
          {children}
        </div>
      </div>
    </div>
  );
}
