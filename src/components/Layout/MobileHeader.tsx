interface MobileHeaderProps {
  onMenuOpen: () => void
}

export default function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  return (
    <div className="md:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 px-4 sm:gap-x-6 sm:px-6 md:px-8">
      <div className="flex items-center gap-4">
        <img className="dark:hidden block h-8 w-auto" src="https://demo.internalnote.com/img/zendesk.svg" alt="Zendesk" />
        <img className="hidden dark:block h-8 w-auto" src="https://demo.internalnote.com/img/zendesk_dark.svg" alt="Zendesk" />
        <img className="dark:hidden block h-8 w-auto" src="https://demo.internalnote.com/img/logo.svg" alt="Internal Note" />
        <img className="hidden dark:block h-8 w-auto" src="https://demo.internalnote.com/img/logo_dark.svg" alt="Internal Note" />
      </div>
      <button
        type="button"
        onClick={onMenuOpen}
        className="-m-2.5 p-2.5 text-licorice hover:text-lime dark:text-white md:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </div>
  )
}
