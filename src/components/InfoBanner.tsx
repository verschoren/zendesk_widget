interface InfoBannerProps {
  description: string
  buttonLabel?: string
  buttonLink?: string
}

export default function InfoBanner({ description, buttonLabel = 'View article', buttonLink = 'https://internalnote.com/embeddable-zendesk-widget?utm_source=demo_pages' }: InfoBannerProps) {
  return (
    <div className="w-full flex h-16 justify-between items-center gap-x-2 md:gap-x-6 bg-matcha dark:bg-gray-900 px-3 md:px-6 py-2.5 overflow-hidden">
      <p className="text-xs md:text-sm text-licorice dark:text-white flex-1 min-w-0 truncate">
        {description}
      </p>
      <a
        href={buttonLink}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-licorice px-2.5 md:px-3.5 py-1 text-xs md:text-sm font-semibold text-white shadow-xs whitespace-nowrap flex-shrink-0"
      >
        <span className="hidden sm:inline">{buttonLabel} </span>
        <span className="sm:hidden">Article </span>
        <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  )
}
