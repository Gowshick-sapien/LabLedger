import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav className="text-sm text-slate-500 mb-4">
  {items.map((item, i) => (
    <span key={i}>
      {item.to ? (
        <Link to={item.to} className="hover:text-slate-700">
          {item.label}
        </Link>
      ) : (
        <span className="text-slate-700">{item.label}</span>
      )}
      {i < items.length - 1 && " > "}
    </span>
  ))}
</nav>
  );
}
