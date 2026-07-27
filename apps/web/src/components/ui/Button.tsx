import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClass = 'btn'
  const variantClass = `btn-${variant}`
  const sizeStyle = size === 'sm' ? { padding: '0.375rem 0.75rem', fontSize: '0.875rem' } : size === 'lg' ? { padding: '0.875rem 1.75rem', fontSize: '1.125rem' } : {}

  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      style={sizeStyle}
      {...props}
    >
      {children}
    </button>
  )
}
