import React from 'react';

const Input = ({ label, id, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-semibold text-gh-text">{label}</label>}
      <input
        id={id}
        className={`bg-gh-bg border text-gh-text text-sm rounded-md px-3 py-1.5 focus:outline-none focus:border-gh-blue focus:ring-1 focus:ring-gh-blue transition-colors ${
          error ? 'border-gh-danger focus:border-gh-danger focus:ring-gh-danger' : 'border-gh-border'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-gh-danger mt-1">{error}</p>}
    </div>
  );
};

export default Input;