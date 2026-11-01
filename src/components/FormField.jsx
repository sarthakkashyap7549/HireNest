import { useState } from "react";

/**
 * Reusable form control wired to Bootstrap validation classes.
 * Works with useForm().field(name) — spread the result onto it.
 * Types: text, email, tel, password (with show/hide), select (use `options`), textarea, checkbox.
 */
export default function FormField({
  label, name, type = "text", value, checked, onChange, onBlur,
  error, valid, help, options, rows = 3, placeholder, autoComplete, readOnly, className = "",
}) {
  const [showPw, setShowPw] = useState(false);
  const id = `field-${name}`;
  const stateClass = error ? " is-invalid" : valid ? " is-valid" : "";
  const describedBy = error ? `${id}-error` : help ? `${id}-help` : undefined;
  const common = {
    id, name, onChange, onBlur, readOnly, autoComplete,
    "aria-invalid": !!error, "aria-describedby": describedBy,
  };
  const feedback = error && <div id={`${id}-error`} className="invalid-feedback">{error}</div>;
  const helpText = !error && help && <div id={`${id}-help`} className="form-text">{help}</div>;

  if (type === "checkbox") {
    return (
      <div className={`form-check ${className}`}>
        <input {...common} type="checkbox" checked={checked} className={`form-check-input${stateClass}`} />
        <label className="form-check-label" htmlFor={id}>{label}</label>
        {feedback}
      </div>
    );
  }

  let control;
  if (type === "select") {
    control = (
      <select {...common} value={value} className={`form-select${stateClass}`}>
        <option value="">{placeholder || "Select an option"}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  } else if (type === "textarea") {
    control = <textarea {...common} value={value} rows={rows} placeholder={placeholder} className={`form-control${stateClass}`} />;
  } else if (type === "password") {
    control = (
      <div className="input-group has-validation">
        <input {...common} value={value} type={showPw ? "text" : "password"} placeholder={placeholder}
          className={`form-control${stateClass}`} />
        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPw((s) => !s)}
          aria-label={showPw ? "Hide password" : "Show password"}>
          <i className={`bi ${showPw ? "bi-eye-slash" : "bi-eye"}`} aria-hidden="true"></i>
        </button>
        {feedback}
      </div>
    );
  } else {
    control = <input {...common} value={value} type={type} placeholder={placeholder} className={`form-control${stateClass}`} />;
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="form-label fw-medium">{label}</label>
      {control}
      {type !== "password" && feedback}
      {helpText}
    </div>
  );
}
