import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav className="text-sm text-gh-text-muted mb-4 flex items-center gap-2">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="text-gh-blue hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-gh-text font-semibold">{item.label}</span>
          )}
          {i < items.length - 1 && <span className="text-gh-border-active">/</span>}
        </span>
      ))}
    </nav>
  );
}
