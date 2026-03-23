import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import NavigationMenu from '../Navigation/NavigationMenu'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  useEffect(() => {
    // Load Ghost signup form script
    const ghostContainer = document.getElementById('sidebar-ghost-signup-form')
    if (ghostContainer && !collapsed) {
      const ghostScript = document.createElement('script')
      ghostScript.src = 'https://cdn.jsdelivr.net/ghost/signup-form@~0.1/umd/signup-form.min.js'
      ghostScript.setAttribute('data-button-color', '#D1F470')
      ghostScript.setAttribute('data-button-text-color', '#11110D')
      ghostScript.setAttribute('data-site', 'https://internalnote.com/')
      ghostScript.async = true
      ghostContainer.appendChild(ghostScript)
    }

    return () => {
      // Clean up Ghost script
      const ghostScripts = document.querySelectorAll('script[src*="ghost/signup-form"]')
      ghostScripts.forEach(script => script.remove())

      // Clean up Ghost form elements
      const ghostForms = document.querySelectorAll('[data-ghost-form]')
      ghostForms.forEach(form => form.remove())
    }
  }, [collapsed])

  return (
    <div className={`hidden md:fixed md:inset-y-0 md:z-50 md:flex md:flex-col transition-all duration-300 ${collapsed ? 'md:w-20' : 'md:w-72'}`}>
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center justify-between">
          {!collapsed && (
            <Link to="/" className="flex gap-4 items-center dark:text-white dark:fill-white">
              <img className="dark:hidden block h-8 w-auto" src="https://demo.internalnote.com/img/zendesk.svg" alt="Zendesk" />
              <img className="hidden dark:block h-8 w-auto" src="https://demo.internalnote.com/img/zendesk_dark.svg" alt="Zendesk" />
              <img className="dark:hidden block h-8 w-auto" src="https://demo.internalnote.com/img/logo.svg" alt="Internal Note" />
              <img className="hidden dark:block h-8 w-auto" src="https://demo.internalnote.com/img/logo_dark.svg" alt="Internal Note" />
            </Link>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 ml-auto"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              // Expand icon (chevron right)
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            ) : (
              // Collapse icon (chevron left)
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            )}
          </button>
        </div>
        <nav className="flex flex-1 flex-col">
          <NavigationMenu collapsed={collapsed} />
        </nav>

        {/* Footer content in sidebar - hidden when collapsed */}
        {!collapsed && (
          <div className="border-t border-gray-900/10 pt-4 mt-auto flex flex-col gap-4">
            <div className="w-full" id="sidebar-ghost-signup-form"></div>
            <p className="text-xs leading-5 text-licorice dark:text-white">
              &copy; 2022–2026{' '}
              <a
                className="text-blue-400 hover:text-underline hover:text-blue-700"
                href="https://internalnote.com?utm_source=demo_page"
              >
                Internal Note
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
