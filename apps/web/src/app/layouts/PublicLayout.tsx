import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../../components/navigation/Navbar'
import { Footer } from '../../components/navigation/Footer'

export const PublicLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
