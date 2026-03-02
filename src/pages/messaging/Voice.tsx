import { useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'voice',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Voice API',
  icon: '📞',
  path: '/messaging/voice',
  title: 'Voice API for Zendesk Messaging',
  description: 'Demo page to showcase the new Voice over Messaging feature'
}

export default function Voice() {
  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Add Zendesk widget script
    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
    script.async = true
    document.body.appendChild(script)

    // Check for URL parameter to auto-open voice
    script.onload = () => {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.has('voice') && window.zE) {
        window.zE('messenger:open', 'voice', '6c0e70e6ef77d7a711a073f249ab6304')
      }
    }

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
    }
  }, [])

  const handleCallUs = () => {
    if (window.zE) {
      window.zE('messenger:open', 'voice', '6c0e70e6ef77d7a711a073f249ab6304')
    }
  }

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div>
              <h1 className="text-3xl text-licorice">{metadata.title}</h1>
              <h2 className="mt-2 text-xl text-licorice">{metadata.description}</h2>
            </div>
            <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <a
                href="https://internalnote.com/voice-api-for-zendesk?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-matcha px-4 py-2 text-sm text-licorice shadow-xs"
              >
                Read more
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-32">
          <p className="text-lg leading-6 text-blue-gray-500">
            This page has 2 ways to start a call. You can either use the Zendesk Bot directly and ask to talk to an Agent, or click the call us button directly.
          </p>
          <div className="bg-white border border-gray-200 sm:rounded-lg mt-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 text-licorice">Need Help?</h3>
              <div className="mt-2 max-w-xl text-sm text-licorice">
                <p>Our Voice Channel is available 9 to 5 to assist you.</p>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleCallUs}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-xs font-medium rounded-md text-licorice bg-white hover:bg-gray-50 sm:text-sm"
                >
                  Call Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Extend window type for Zendesk
declare global {
  interface Window {
    zE?: any
  }
}
