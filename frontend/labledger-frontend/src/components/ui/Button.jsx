import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-1.5 text-sm font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gh-blue focus:ring-offset-2 focus:ring-offset-gh-bg border";
  
  const variants = {
    primary: "bg-gh-green hover:bg-gh-green-hover text-white border-[rgba(255,255,255,0.1)]",
    secondary: "bg-gh-bg-secondary hover:bg-gh-border text-gh-text border-gh-border",
    danger: "bg-gh-bg-secondary hover:bg-gh-danger hover:text-white text-gh-danger hover:border-gh-danger border-gh-border",
    outline: "bg-transparent border-gh-border text-gh-blue hover:bg-gh-bg-secondary hover:border-gh-border-active hover:text-gh-link",
  };

  return (
    <button className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;