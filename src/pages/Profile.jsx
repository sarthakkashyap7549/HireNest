import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import FormField from "../components/FormField";
import useForm from "../hooks/useForm";
import { validateProfile } from "../utils/validators";
import { profileCompleteness } from "../utils/format";
import { ROLES } from "./Register";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);

  const { values, field, handleSubmit, submitting, submitError } = useForm(
    {
      fullName: user.fullName, phone: user.phone, role: user.role, location: user.location || "",
      headline: user.headline || "", skills: (user.skills || []).join(", "), about: user.about || "",
    },
    validateProfile
  );

  const onSubmit = async (v) => {
    await updateProfile({
      ...v,
      fullName: v.fullName.trim(),
      skills: v.skills.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setSaved(true);
  };

  const completeness = profileCompleteness(user);
  const initials = user.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      <h1 className="h3 mb-3">Your profile</h1>
      <div className="row g-3">
        <div className="col-lg-4">
          <div className="card text-center">
            <div className="card-body">
              <div className="avatar mx-auto mb-3" aria-hidden="true">{initials}</div>
              <h2 className="h5 mb-0">{user.fullName}</h2>
              <p className="text-secondary mb-1">{user.headline || user.role}</p>
              <p className="small text-secondary">{user.email}</p>
              <div className="progress" style={{ height: 6 }} role="progressbar" aria-valuenow={completeness} aria-valuemin="0" aria-valuemax="100">
                <div className="progress-bar" style={{ width: `${completeness}%` }}></div>
              </div>
              <div className="small text-secondary mt-1">Profile {completeness}% complete</div>
              {user.skills?.length > 0 && (
                <div className="d-flex flex-wrap justify-content-center gap-1 mt-3">
                  {user.skills.map((s) => <span key={s} className="badge skill-badge">{s}</span>)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <form noValidate onSubmit={(e) => { setSaved(false); handleSubmit(onSubmit)(e); }}>
                {saved && <div className="alert alert-success" role="status">Profile saved.</div>}
                {submitError && <div className="alert alert-danger" role="alert">{submitError}</div>}
                <div className="row g-3">
                  <FormField className="col-md-6" label="Full name" {...field("fullName")} />
                  <FormField className="col-md-6" label="Email" type="email" readOnly value={user.email} name="email"
                    help="Email can't be changed here." />
                  <FormField className="col-md-6" label="Mobile number" type="tel" {...field("phone")} />
                  <FormField className="col-md-6" label="Preferred role" type="select" options={ROLES} placeholder="Choose a role" {...field("role")} />
                  <FormField className="col-md-6" label="Current city" placeholder="e.g. Chandigarh" {...field("location")} />
                  <FormField className="col-md-6" label="Headline" placeholder="e.g. MCA student focused on ML" {...field("headline")} />
                  <FormField className="col-12" label="Skills" placeholder="React, Python, SQL"
                    help="Separate skills with commas." {...field("skills")} />
                  <FormField className="col-12" label="About you" type="textarea" rows={4}
                    help={`${values.about.length}/400 characters`} {...field("about")} />
                  <div className="col-12">
                    <button className="btn btn-primary" type="submit" disabled={submitting}>
                      {submitting ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Saving</> : "Save changes"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
