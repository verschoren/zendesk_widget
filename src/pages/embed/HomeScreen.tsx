import { useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'embed-homescreen',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Custom Launcher',
  icon: '🏠',
  path: '/embed/homescreen',
  title: 'Custom Launcher Demo',
  description: 'Custom launcher experience with home screen',
  parentId: 'embeddable_mode'
}

export default function HomeScreen() {
  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    window.zEMessenger = { autorender: false }

    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      if (window.zE) {
        window.zE('messenger', 'render', {
          mode: 'embedded',
          widget: {
            targetElement: '#widget',
          }
        })
      }
    }

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
    }
  }, [])

  return (
    <>
      <div className="fixed top-0 w-full flex h-16 justify-between items-center gap-x-6 bg-matcha px-6 py-2.5 z-50">
        <a href="/embed" className="flex gap-4 items-center">
          <img className="h-8 w-auto" src="/img/zendesk.svg" alt="Zendesk" />
          <img className="h-8 w-auto" src="/img/logo.svg" alt="Internal Note" />
        </a>
        <p className="hidden sm:flex text-sm text-licorice dark:text-white">
          Open the widget to enjoy a custom launcher experience
        </p>
        <a
          href="https://internalnote.com/embeddable-zendesk-widget?utm_source=demo_pages"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none rounded-full bg-licorice px-3.5 py-1 text-sm font-semibold text-white shadow-xs"
        >
          View article <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Custom Home Screen Experience
              </h1>
              <div className="bg-white dark:bg-licorice rounded-lg shadow p-8 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-licorice dark:text-white">Welcome to Support</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Experience a custom home screen with curated conversation starters and quick actions.
                </p>
                <p className="text-gray-600 dark:text-white">
                  The widget on the right shows a customized launcher interface designed to guide users to the right conversation topics quickly.
                </p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-licorice rounded-lg shadow sticky top-24">
                <div id="widget" className="h-[700px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

declare global {
  interface Window {
    zE?: any
    zEMessenger?: any
  }
}
