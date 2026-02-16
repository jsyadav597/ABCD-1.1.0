import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import './MainLayout.css'

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  const handleToggle = () => setCollapsed(prev => !prev)

  return (
    <div className="main-layout">
      <Header onToggleSidebar={handleToggle} />
      <div className={`layout-body ${collapsed ? 'collapsed' : ''}`}>
        <Sidebar collapsed={collapsed} />
        <main className="main-content">
          <div className="main-container">
            {children}
          </div>
        </main>
      </div>
      <footer className="main-footer">
        <p>&copy; 2026 ABCD. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default MainLayout
