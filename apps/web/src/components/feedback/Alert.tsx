import React from 'react'

interface AlertProps {
  type?: 'info' | 'warning' | 'error' | 'danger' | 'success'
  title?: string
  children: React.ReactNode
  className?: string
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = ''
}) => {
  const normalizedType = type === 'danger' ? 'error' : type

  const colors = {
    info: { bg: 'rgba(59, 130, 246, 0.1)', border: '#3B82F6', text: '#60A5FA' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', border: '#F59E0B', text: '#FBBF24' },
    error: { bg: 'rgba(239, 68, 68, 0.1)', border: '#EF4444', text: '#FCA5A5' },
    success: { bg: 'rgba(16, 185, 129, 0.1)', border: '#10B981', text: '#34D399' }
  }

  const current = colors[normalizedType]

  return (
    <div
      className={className}
      style={{
        backgroundColor: current.bg,
        borderLeft: `4px solid ${current.border}`,
        padding: '1rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem'
      }}
    >
      {title && (
        <h4 style={{ color: current.text, fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.25rem' }}>
          {title}
        </h4>
      )}
      <div style={{ color: 'var(--color-text-main)', fontSize: '0.875rem' }}>
        {children}
      </div>
    </div>
  )
}
