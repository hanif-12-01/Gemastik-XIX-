import React from 'react'

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Application context providers wrapper
 */
export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  )
}
