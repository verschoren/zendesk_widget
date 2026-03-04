import { useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'proactive-basic',
  category: 'proactive',
  categoryName: 'Proactive Messaging',
  name: 'Basic Example',
  icon: '📨',
  path: '/proactive/basic',
  title: 'Proactive Messages Demo',
  description: 'Basic Example'
}

export default function ProactiveBasic() {
  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Add Zendesk widget script
    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
    script.async = true
    document.body.appendChild(script)

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
    }
  }, [])

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div>
              <h1 className="text-3xl text-licorice dark:text-white">{metadata.title}</h1>
              <h2 className="mt-2 text-xl text-licorice dark:text-white">{metadata.description}</h2>
            </div>
            <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <a
                href="https://internalnote.com/proactive-ticketing-for-messaging/?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-matcha px-4 py-2 text-sm text-licorice dark:text-white shadow-xs"
              >
                Read more
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="text-center mt-8 mb-8">
        <p className="mt-6 text-base leading-7 text-gray-600">
          This will trigger a message after 5 seconds each page visit.
        </p>
      </div>
    </>
  )
}
