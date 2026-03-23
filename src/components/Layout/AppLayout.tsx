import { ReactNode, useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import MobileSidebar from './MobileSidebar'
import MobileHeader from './MobileHeader'
import Footer from './Footer'
import CachingBanner from '../CachingBanner'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem('sidebarCollapsed')
    return saved === 'true'
  })

  useEffect(() => {
    // Persist to localStorage
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed))
  }, [sidebarCollapsed])

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)

  return (
    <>
      {/* Mobile menu */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Desktop sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main content */}
      <main id="content" className={`py-10 px-4 sm:px-6 md:px-8 transition-all duration-300 ${sidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>
        {/* Mobile header */}
        <MobileHeader onMenuOpen={() => setMobileMenuOpen(true)} />

        {/* Page content */}
        {children}

        {/* Footer */}
        <Footer />
      </main>

      {/* Caching banner (bottom-left overlay) */}
      <CachingBanner />
    </>
  )
}
