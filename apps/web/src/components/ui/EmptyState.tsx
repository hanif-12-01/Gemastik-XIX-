import React from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1.5rem', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
      <h3 style={{ fontSize: '1.125rem', color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>{title}</h3>
      {description && <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
