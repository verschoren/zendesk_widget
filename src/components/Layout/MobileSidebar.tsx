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

      <div className="bg-white fixed inset-0 flex">
        <div className="relative mr-16 flex w-full max-w-xs flex-1">
          <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
            <button
              type="button"
              onClick={onClose}
              className="-m-2.5 p-2.5"
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
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
            <div className="rounded-md bg-lime p-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-licorice" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-licorice">Caching</h3>
                  <div className="mt-2 text-sm text-licorice">
                    <p>If you experience issues triggering the proactive alerts, clear your LocalStorage and try again.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
