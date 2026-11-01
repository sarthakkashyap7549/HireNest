import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import useForm from "../hooks/useForm";
import { useAuth } from "../context/AuthContext";
import { validateLogin } from "../utils/validators";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname
    ? location.state.from.pathname + (location.state.from.search || "")
    : "/dashboard";

  const { field, handleSubmit, submitting, submitError } = useForm({ email: "", password: "" }, validateLogin);

  const onSubmit = async ({ email, password }) => {
    await login(email, password);
    navigate(redirectTo, { replace: true });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see your applications and new openings."
      footer={<>New here? <Link to="/register">Create an account</Link></>}
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {submitError && <div className="alert alert-danger" role="alert">{submitError}</div>}
        <FormField className="mb-3" label="Email" type="email" autoComplete="email" placeholder="name@example.com" {...field("email")} />
        <FormField className="mb-4" label="Password" type="password" autoComplete="current-password" {...field("password")} />
        <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
          {submitting ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Logging in</> : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}
