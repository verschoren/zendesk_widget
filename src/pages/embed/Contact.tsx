import { useState, useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'embed-contact',
  category: 'embed',
  categoryName: 'Embeddable Mode',
  name: 'Contact Page',
  icon: '📧',
  path: '/embed/contact',
  title: 'Contact Page Widget Demo',
  description: 'Widget embedded within a contact form page'
}

export default function Contact() {
  const [showWidget, setShowWidget] = useState(false)

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    window.zEMessenger = { autorender: false }

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

  const handleGetSupport = () => {
    setShowWidget(true)
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

  return (
    <>
      <div className="fixed top-0 w-full flex h-16 justify-between items-center gap-x-6 bg-matcha px-6 py-2.5 z-50">
        <a href="/embed" className="flex gap-4 items-center">
          <img className="h-8 w-auto" src="/img/zendesk.svg" alt="Zendesk" />
          <img className="h-8 w-auto" src="/img/logo.svg" alt="Internal Note" />
        </a>
        <p className="hidden sm:flex text-sm text-licorice">
          Click get support and discover the embedded chat
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

      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>

            {!showWidget ? (
              <div className="bg-white rounded-lg shadow p-8">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 border"></textarea>
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                      Send Message
                    </button>
                    <button
                      type="button"
                      onClick={handleGetSupport}
                      className="bg-matcha text-licorice px-6 py-2 rounded-md hover:bg-lime"
                    >
                      Get Live Support
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8">
                <h2 className="text-xl font-semibold mb-4">Live Support Chat</h2>
                <div id="widget" className="h-[600px] border border-gray-200 rounded"></div>
              </div>
            )}
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
