import React from 'react'

interface LoadingSpinnerProps {
  message?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Memuat data...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', gap: '1rem' }}>
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{message}</span>
    </div>
  )
}
