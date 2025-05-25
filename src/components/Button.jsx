import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  icon: Icon,
  onClick,
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`button ${variant} ${className}`}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
      {Icon && <Icon className="button-icon" />}
    </button>
  );
};

export default Button; 