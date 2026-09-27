import { Link } from "react-router-dom";

function QuickAction({ title, description, to }) {
  return (
    <Link to={to} className="quick-action">
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}

export default QuickAction;