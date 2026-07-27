import React from 'react'

interface CardProps {
  children: React.ReactNode
  hoverable?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  className = '',
  style,
  onClick
}) => {
  return (
    <div
      className={`card ${hoverable ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
      style={{ ...style, cursor: onClick ? 'pointer' : style?.cursor }}
    >
      {children}
    </div>
  )
}
