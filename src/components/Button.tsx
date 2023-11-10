import React from 'react'

interface ButtonProps {
    children: React.ReactNode; // Content inside the button
    onClick?: () => void; // Click event handler
    className?: string; // CSS classes
    disabled?: boolean; // Disabled state
  }

function Button({
    children,
    onClick,
    className = '',
    disabled = false,
  }: ButtonProps) {
  return (
    <button
      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button