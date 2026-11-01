// Pure validation functions. Each returns an object: { fieldName: "message" }.
// Empty object = valid. Mirror these rules on the backend later.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/; // 10-digit Indian mobile number

export function validateLogin(v) {
  const e = {};
  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!EMAIL_RE.test(v.email)) e.email = "Enter a valid email, like name@example.com.";
  if (!v.password) e.password = "Enter your password.";
  return e;
}

export function validateRegister(v) {
  const e = {};
  if (!v.fullName.trim()) e.fullName = "Enter your full name.";
  else if (v.fullName.trim().length < 3) e.fullName = "Name must be at least 3 characters.";

  if (!v.email.trim()) e.email = "Enter your email address.";
  else if (!EMAIL_RE.test(v.email)) e.email = "Enter a valid email, like name@example.com.";

  if (!v.phone.trim()) e.phone = "Enter your mobile number.";
  else if (!PHONE_RE.test(v.phone)) e.phone = "Enter a 10-digit mobile number starting with 6-9.";

  if (!v.role) e.role = "Choose the role you are looking for.";

  if (!v.password) e.password = "Create a password.";
  else if (v.password.length < 8) e.password = "Use at least 8 characters.";
  else if (!/[A-Z]/.test(v.password) || !/[a-z]/.test(v.password) || !/\d/.test(v.password))
    e.password = "Include an uppercase letter, a lowercase letter and a number.";

  if (!v.confirmPassword) e.confirmPassword = "Re-enter your password.";
  else if (v.confirmPassword !== v.password) e.confirmPassword = "Passwords do not match.";

  if (!v.terms) e.terms = "Accept the terms to create your account.";
  return e;
}

export function validateProfile(v) {
  const e = {};
  if (!v.fullName.trim()) e.fullName = "Enter your full name.";
  else if (v.fullName.trim().length < 3) e.fullName = "Name must be at least 3 characters.";
  if (!v.phone.trim()) e.phone = "Enter your mobile number.";
  else if (!PHONE_RE.test(v.phone)) e.phone = "Enter a 10-digit mobile number starting with 6-9.";
  if (v.headline && v.headline.length > 80) e.headline = "Keep the headline under 80 characters.";
  if (v.about && v.about.length > 400) e.about = "Keep this under 400 characters.";
  return e;
}
