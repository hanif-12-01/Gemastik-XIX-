import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        style={error ? { borderColor: 'var(--color-status-danger)' } : undefined}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-status-danger)' }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
          {helperText}
        </span>
      )}
    </div>
  )
})

Input.displayName = 'Input'
