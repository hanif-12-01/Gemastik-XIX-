import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AppProviders } from './providers'
import '../styles/globals.css'

export const App: React.FC = () => {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
