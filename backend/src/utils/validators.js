const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/;

export class ValidationError extends Error {
  constructor(errors) {
    super(Object.values(errors)[0] || "Validation failed.");
    this.status = 400;
    this.errors = errors;
  }
}

function requiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function objectInput(input) {
  return input && typeof input === "object" && !Array.isArray(input) ? input : {};
}

export function validateRegistration(input = {}) {
  input = objectInput(input);
  const errors = {};
  if (!requiredString(input.fullName)) errors.fullName = "Enter your full name.";
  else if (input.fullName.trim().length < 3) errors.fullName = "Name must be at least 3 characters.";
  if (!requiredString(input.email)) errors.email = "Enter your email address.";
  else if (!EMAIL_RE.test(input.email.trim())) errors.email = "Enter a valid email address.";
  if (!requiredString(input.phone)) errors.phone = "Enter your mobile number.";
  else if (!PHONE_RE.test(input.phone.trim())) errors.phone = "Enter a 10-digit mobile number starting with 6-9.";
  if (!requiredString(input.role)) errors.role = "Choose the role you are looking for.";
  if (typeof input.password !== "string" || !input.password) errors.password = "Create a password.";
  else if (input.password.length < 8) errors.password = "Use at least 8 characters.";
  else if (!/[A-Z]/.test(input.password) || !/[a-z]/.test(input.password) || !/\d/.test(input.password)) {
    errors.password = "Include an uppercase letter, a lowercase letter and a number.";
  }
  if (Object.keys(errors).length) throw new ValidationError(errors);
}

export function validateLogin(input = {}) {
  input = objectInput(input);
  const errors = {};
  if (!requiredString(input.email) || !EMAIL_RE.test(input.email.trim())) errors.email = "Enter a valid email address.";
  if (typeof input.password !== "string" || !input.password) errors.password = "Enter your password.";
  if (Object.keys(errors).length) throw new ValidationError(errors);
}

export function validateProfile(input = {}) {
  input = objectInput(input);
  const errors = {};
  if (!requiredString(input.fullName)) errors.fullName = "Enter your full name.";
  else if (input.fullName.trim().length < 3) errors.fullName = "Name must be at least 3 characters.";
  if (!requiredString(input.phone) || !PHONE_RE.test(input.phone.trim())) errors.phone = "Enter a valid 10-digit mobile number.";
  if (!requiredString(input.role)) errors.role = "Choose the role you are looking for.";
  if (input.location !== undefined && (typeof input.location !== "string" || input.location.length > 120)) errors.location = "Location must be 120 characters or fewer.";
  if (input.headline !== undefined && (typeof input.headline !== "string" || input.headline.length > 80)) errors.headline = "Keep the headline under 80 characters.";
  if (input.about !== undefined && (typeof input.about !== "string" || input.about.length > 400)) errors.about = "Keep this under 400 characters.";
  if (input.skills !== undefined && (!Array.isArray(input.skills) || input.skills.some((skill) => typeof skill !== "string" || skill.length > 60))) errors.skills = "Skills must be an array of short text values.";
  if (Object.keys(errors).length) throw new ValidationError(errors);
}

export function requirePositiveInteger(value, fieldName) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1) {
    throw new ValidationError({ [fieldName]: `${fieldName} must be a positive integer.` });
  }
  return number;
}
