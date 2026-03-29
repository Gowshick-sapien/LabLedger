import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-gh-bg-secondary border-b border-gh-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-gh-text font-bold text-lg hover:text-white transition-colors">
          LabLedger
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user?.role === "admin" && (
          <Link to="/admin" className="text-sm text-gh-link hover:underline font-medium px-2">
            Admin Dashboard
          </Link>
        )}
        <button 
          onClick={handleLogout}
          className="text-sm text-gh-text-muted hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}