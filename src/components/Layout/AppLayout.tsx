import { ReactNode, useState } from 'react'
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

  return (
    <>
      {/* Mobile menu */}
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content */}
      <main id="content" className="md:pl-72 py-10 px-4 sm:px-6 md:px-8">
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
