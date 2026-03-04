import { Link } from 'react-router-dom'
import NavigationMenu from '../Navigation/NavigationMenu'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null

  return (
    <div className="relative z-50 md:hidden font-brand" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-gray-900/80 transition-opacity ease-linear duration-300"
        onClick={onClose}
      />

      <div className="bg-white dark:bg-licorice fixed inset-0 flex">
        <div className="relative mr-16 flex w-full max-w-xs flex-1">
          <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
            <button
              type="button"
              onClick={onClose}
              className="-m-2.5 p-2.5"
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-gray-600 dark:text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pl-4 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <Link to="/" className="flex gap-4 items-center dark:text-white dark:fill-white" onClick={onClose}>
                <img className="dark:hidden block h-8 w-auto" src="https://demo.internalnote.com/img/zendesk.svg" alt="Zendesk" />
                <img className="hidden dark:block h-8 w-auto" src="https://demo.internalnote.com/img/zendesk_dark.svg" alt="Zendesk" />
                <img className="dark:hidden block h-8 w-auto" src="https://demo.internalnote.com/img/logo.svg" alt="Internal Note" />
                <img className="hidden dark:block h-8 w-auto" src="https://demo.internalnote.com/img/logo_dark.svg" alt="Internal Note" />
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <NavigationMenu onLinkClick={onClose} />
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
