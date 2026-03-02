import { Link } from 'react-router-dom'
import NavigationMenu from '../Navigation/NavigationMenu'

export default function Sidebar() {
  return (
    <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-72 md:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Link to="/" className="flex gap-4 items-center dark:text-white dark:fill-white">
            <img className="dark:hidden block h-8 w-auto" src="https://demo.internalnote.com/img/zendesk.svg" alt="Zendesk" />
            <img className="hidden dark:block h-8 w-auto" src="https://demo.internalnote.com/img/zendesk_dark.svg" alt="Zendesk" />
            <img className="dark:hidden block h-8 w-auto" src="https://demo.internalnote.com/img/logo.svg" alt="Internal Note" />
            <img className="hidden dark:block h-8 w-auto" src="https://demo.internalnote.com/img/logo_dark.svg" alt="Internal Note" />
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <NavigationMenu />
        </nav>
      </div>
    </div>
  )
}
