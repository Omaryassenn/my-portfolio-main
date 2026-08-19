import React from 'react';
import { FiLoader } from 'react-icons/fi';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  icon: Icon,
  /* Owns both halves of the busy state: a button that says "Sending…" but is
     still clickable invites the second submit it is meant to prevent. */
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      // Spread first so the two below win over anything passed in — `loading`
      // has to be able to force `disabled` on.
      {...props}
      className={`button ${variant} ${className}`}
      onClick={onClick}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
    >
      <span>{children}</span>
      {loading ? (
        <FiLoader className="button-icon button-icon--spinning" aria-hidden="true" />
      ) : (
        Icon && <Icon className="button-icon" />
      )}
    </button>
  );
};

export default Button;
