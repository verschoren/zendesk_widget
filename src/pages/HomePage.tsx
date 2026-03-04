import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { pages } from '@/lib/pageRegistry'
import { buildNavigation } from '@/lib/navigation'
import Button from '@/components/Button'

export default function HomePage() {
  const navigation = buildNavigation(pages)

  useEffect(() => {
    // Set page title
    document.title = 'Internal Note Demo Page'

    // Load Zendesk widget for homepage
    const zendeskScript = document.createElement('script')
    zendeskScript.id = 'ze-snippet'
    zendeskScript.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
    zendeskScript.async = true
    document.body.appendChild(zendeskScript)

    return () => {
      const existingZendesk = document.getElementById('ze-snippet')
      if (existingZendesk) existingZendesk.remove()
    }
  }, [])

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div>
              <h1 className="text-3xl text-licorice dark:text-white">Internal Note Demo Page</h1>
              <h2 className="mt-2 text-xl text-licorice dark:text-white">
                These demo pages showcase Zendesk features as explained in the articles.
              </h2>
            </div>
            <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <Button
                as="a"
                href="https://internalnote.com?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Internal Note
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Migration Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-4">
        <div className="bg-blue-50 dark:bg-blue-700 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-licorice dark:text-white">
            We recently migrated this website to React. Found a bug? Let me know via{' '}
            <a
              href="mailto:note@internalnote.com"
              className="text-blue-600 dark:text-white hover:text-blue-800 underline"
            >
              note@internalnote.com
            </a>
            . Thanks!
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 mb-24">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          {navigation.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-licorice dark:text-white">
                No demo pages available yet. Pages will appear here once they are migrated.
              </p>
            </div>
          ) : (
            navigation.map((section) => (
              <div key={section.type} className="mb-8">
                <div className="font-semibold leading-6 text-licorice dark:text-white flex justify-between items-center mb-4">
                  {section.name}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {section.links.map((link) => {
                    if (link.external) {
                      return (
                        <div
                          key={link.id}
                          className="border-matcha border-1 hover:bg-matcha rounded-md p-4 transition-colors"
                        >
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-licorice dark:text-white hover:text-licorice text-sm leading-6 block"
                          >
                            <div className="font-semibold truncate flex items-center gap-2">
                              <span>{link.icon}</span>
                              <span>{link.name}</span>
                            </div>
                            <div className="truncate opacity-80 mt-1">{link.description}</div>
                          </a>
                        </div>
                      )
                    }

                    return (
                      <div
                        key={link.id}
                        className="border-matcha border-1 hover:bg-matcha rounded-md p-4 transition-colors"
                      >
                        <Link
                          to={link.path!}
                          className="text-licorice dark:text-white hover:text-licorice text-sm leading-6 block"
                        >
                          <div className="font-semibold truncate flex items-center gap-2">
                            <span>{link.icon}</span>
                            <span>{link.name}</span>
                          </div>
                          <div className="truncate opacity-80 mt-1">{link.description}</div>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
