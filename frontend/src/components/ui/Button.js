import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseClass = `btn btn-${variant} ${className}`;
  return (
    <button className={baseClass} {...props}>
      {children}
    </button>
  );
}
