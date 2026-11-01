import { useMemo, useState } from "react";

/**
 * Small form hook that pairs with Bootstrap's validation classes.
 * - `validate(values)` returns { field: "message" }
 * - errors show only after a field is touched (blurred) or the form is submitted
 */
export default function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const errors = useMemo(() => validate(values), [values, validate]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
    setSubmitError("");
  };

  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  // Props you can spread straight onto <FormField />
  const field = (name) => ({
    name,
    value: values[name],
    checked: !!values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : undefined,
    valid: touched[name] && !errors[name],
  });

  const handleSubmit = (onSubmit) => async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit(values);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return { values, setValues, field, handleSubmit, submitting, submitError, isValid: Object.keys(errors).length === 0 };
}
