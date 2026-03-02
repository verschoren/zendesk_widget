import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { pages } from '@/lib/pageRegistry'
import { buildNavigation } from '@/lib/navigation'

export default function HomePage() {
  const navigation = buildNavigation(pages)

  useEffect(() => {
    // Set page title
    document.title = 'Internal Note Demo Page'

    // Load Zendesk widget for homepage
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
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div>
              <h1 className="text-3xl text-licorice">Internal Note Demo Page</h1>
              <h2 className="mt-2 text-xl text-licorice">
                These demo pages showcase Zendesk features as explained in the articles.
              </h2>
            </div>
            <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <a
                href="https://internalnote.com?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-matcha px-4 py-2 text-sm text-licorice shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                View Internal Note
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 mb-24">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          {navigation.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-licorice">
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

      <footer className="md:w-[calc(100%_-_288px)] w-full fixed bottom-0 bg-white" aria-labelledby="footer-heading">
        <div className="border-t border-gray-900/10 p-4 flex flex-col md:flex-row justify-between w-full items-start md:items-end gap-4 md:gap-0 md:pr-24">
          <div className="min-w-24 w-[calc(100%_-_32px)] md:w-96">
            <h1 className="text-sm font-medium pb-2">Subscribe to Internal Note</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: `<script src="https://cdn.jsdelivr.net/ghost/signup-form@~0.1/umd/signup-form.min.js" data-button-color="#D1F470" data-button-text-color="#11110D" data-site="https://internalnote.com/" async></script>`
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            <p className="text-xs leading-5 text-licorice">
              &copy; 2022–2025{' '}
              <a
                className="text-blue-400 hover:underline hover:text-blue-700"
                href="https://internalnote.com?utm_source=storagecalculator"
                target="_blank"
                rel="noopener noreferrer"
              >
                Internal Note
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
