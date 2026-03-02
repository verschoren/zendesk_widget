import { useState, useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'embed-overlay',
  category: 'embed',
  categoryName: 'Embeddable Mode',
  name: 'Overlay',
  icon: '📲',
  path: '/embed/overlay',
  title: 'Overlay Widget Demo',
  description: 'Slide-over overlay widget demonstration'
}

export default function Overlay() {
  const [showWidget, setShowWidget] = useState(false)

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Configure Zendesk messenger for embedded mode
    window.zEMessenger = {
      autorender: false,
    }

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

  const handleOpenWidget = () => {
    setShowWidget(true)
    if (window.zE) {
      window.zE('messenger', 'render', {
        mode: 'embedded',
        widget: {
          targetElement: '#widget-container',
        }
      })
      setTimeout(() => {
        window.zE('messenger', 'open')
      }, 300)
    }
  }

  const handleCloseWidget = () => {
    setShowWidget(false)
  }

  return (
    <>
      {/* Info Banner */}
      <div className="fixed top-0 w-full flex h-16 justify-between items-center gap-x-6 bg-matcha px-6 py-2.5 z-50">
        <a href="/embed" className="flex gap-4 items-center">
          <img className="h-8 w-auto" src="/img/zendesk.svg" alt="Zendesk" />
          <img className="h-8 w-auto" src="/img/logo.svg" alt="Internal Note" />
        </a>
        <p className="hidden sm:flex text-sm text-licorice gap-1 text-center">
          Click the{' '}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 inline">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>{' '}
          icon to view an overlayed widget
        </p>
        <a
          href="https://internalnote.com/embeddable-zendesk-widget?utm_source=demo_pages"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none rounded-full bg-licorice px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700"
        >
          View article <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        <header className="relative bg-white shadow-xs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Company" className="h-8 w-auto" />
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleOpenWidget}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Help</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6">
                    <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Overlay Widget Demo
              </h1>
              <p className="mt-4 text-lg text-gray-500">
                Click the help icon in the header to open the widget as a slide-over overlay
              </p>
            </div>

            <div className="mt-16">
              <div className="rounded-lg bg-gray-50 px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Features</h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Feature One</h3>
                    <p className="mt-2 text-gray-600">Description of the first amazing feature</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Feature Two</h3>
                    <p className="mt-2 text-gray-600">Description of the second amazing feature</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Feature Three</h3>
                    <p className="mt-2 text-gray-600">Description of the third amazing feature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Overlay Widget Container */}
      {showWidget && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseWidget}></div>
          <div className="relative w-full max-w-md bg-white shadow-xl">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={handleCloseWidget}
                className="rounded-md text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div id="widget-container" className="h-full w-full"></div>
          </div>
        </div>
      )}
    </>
  )
}

// Extend window type for Zendesk
declare global {
  interface Window {
    zE?: any
    zEMessenger?: any
  }
}
