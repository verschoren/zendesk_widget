import { useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'embed-intranet',
  category: 'embed',
  categoryName: 'Embeddable Mode',
  name: 'Intranet',
  icon: '🏢',
  path: '/embed/intranet',
  title: 'Intranet Widget Demo',
  description: 'Inline single message thread embedded in page'
}

export default function Intranet() {
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
        window.zE('messenger', 'open')
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
        <p className="hidden sm:flex text-sm text-licorice">
          Discover an embedded chat right within this page
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

      <div className="pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Company Intranet</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Latest Announcements</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium">System Maintenance</h3>
                    <p className="text-sm text-gray-600">Scheduled for this weekend</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-medium">New Features Released</h3>
                    <p className="text-sm text-gray-600">Check out the latest updates</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Support Chat</h2>
                <div id="widget" className="h-[600px] border border-gray-200 rounded"></div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
                <ul className="space-y-2">
                  <li><a href="#" className="text-blue-600 hover:underline">Employee Directory</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">IT Support</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">HR Portal</a></li>
                  <li><a href="#" className="text-blue-600 hover:underline">Benefits</a></li>
                </ul>
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
