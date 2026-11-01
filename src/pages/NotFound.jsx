import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";

export default function NotFound() {
  return (
    <div className="container py-5">
      <EmptyState icon="bi-compass" title="We couldn't find that page"
        text="The link may be broken or the page may have moved."
        action={<Link className="btn btn-primary" to="/">Go to home</Link>} />
    </div>
  );
}
