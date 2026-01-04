import { Link } from "react-router-dom";

export default function Breadcrumb({ items }) {
  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index !== 0 && <span className="mx-2">{">"}</span>}
            {item.to ? (
              <Link
                to={item.to}
                className="hover:text-slate-900 font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-semibold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
