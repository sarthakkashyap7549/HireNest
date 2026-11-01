export function formatPosted(days) {
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function formatSalary(lpa) {
  return `₹${lpa} LPA`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function profileCompleteness(user) {
  const checks = [user.fullName, user.phone, user.role, user.location, user.headline, user.skills?.length, user.about];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}
