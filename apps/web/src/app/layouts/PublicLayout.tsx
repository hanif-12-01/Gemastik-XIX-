import React from 'react'
import { Outlet } from 'react-router-dom'
import { PublicHeader } from '../../components/navigation/PublicHeader'
import { PublicFooter } from '../../components/navigation/PublicFooter'

export const PublicLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicHeader />
      <main id="main-content" style={{ flex: 1 }}>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
