import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import useForm from "../hooks/useForm";
import { useAuth } from "../context/AuthContext";
import { validateRegister } from "../utils/validators";

export const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Python Developer",
  "Data Analyst", "ML / AI Engineer", "UI/UX Designer", "QA Engineer", "DevOps Engineer", "Other",
];

const initial = { fullName: "", email: "", phone: "", role: "", password: "", confirmPassword: "", terms: false };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const { field, handleSubmit, submitting, submitError } = useForm(initial, validateRegister);

  const onSubmit = async ({ confirmPassword, terms, ...data }) => {
    await register(data); // confirmPassword/terms are UI-only, never sent to the API
    navigate("/dashboard/profile", { replace: true });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes a minute. You can complete your profile afterwards."
      footer={<>Already registered? <Link to="/login">Log in</Link></>}
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {submitError && <div className="alert alert-danger" role="alert">{submitError}</div>}
        <div className="row g-3">
          <FormField className="col-12" label="Full name" autoComplete="name" {...field("fullName")} />
          <FormField className="col-md-6" label="Email" type="email" autoComplete="email" placeholder="name@example.com" {...field("email")} />
          <FormField className="col-md-6" label="Mobile number" type="tel" autoComplete="tel" placeholder="10-digit number" {...field("phone")} />
          <FormField className="col-12" label="Role you are looking for" type="select" options={ROLES} placeholder="Choose a role" {...field("role")} />
          <FormField className="col-md-6" label="Password" type="password" autoComplete="new-password"
            help="8+ characters with upper, lower case and a number." {...field("password")} />
          <FormField className="col-md-6" label="Confirm password" type="password" autoComplete="new-password" {...field("confirmPassword")} />
          <FormField className="col-12" type="checkbox" label="I agree to the terms and privacy policy" {...field("terms")} />
          <div className="col-12">
            <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
              {submitting ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Creating account</> : "Create account"}
            </button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
