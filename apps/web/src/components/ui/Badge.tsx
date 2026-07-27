import React from 'react'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'info' | 'danger'
  children: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'info',
  children,
  className = ''
}) => {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  )
}
