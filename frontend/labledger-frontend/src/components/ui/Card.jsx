import React from 'react';

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-gh-bg border border-gh-border rounded-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, children, className = '' }) => {
  return (
    <div className={`px-4 py-3 border-b border-gh-border bg-gh-bg-secondary flex gap-3 items-center justify-between ${className}`}>
      {title && <h3 className="text-sm font-semibold text-gh-text m-0">{title}</h3>}
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};

export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};
