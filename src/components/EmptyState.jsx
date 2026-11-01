export default function EmptyState({ icon = "bi-inbox", title, text, action }) {
  return (
    <div className="text-center py-5 px-3">
      <i className={`bi ${icon} display-5 text-secondary`} aria-hidden="true"></i>
      <h2 className="h5 mt-3">{title}</h2>
      {text && <p className="text-secondary mb-3">{text}</p>}
      {action}
    </div>
  );
}
