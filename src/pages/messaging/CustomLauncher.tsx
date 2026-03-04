import { useState, useEffect } from 'react'
import Button from '@/components/Button'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'custom-launcher',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Custom Launcher',
  icon: '🎯',
  path: '/messaging/custom-launcher',
  title: 'Custom Launcher for the Zendesk Messaging Web Widget',
  description: 'Demo page to showcase replacement of the default Widget launcher with a custom design'
}

export default function CustomLauncher() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [showCounter, setShowCounter] = useState(false)

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Add Zendesk widget script
    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=a8969772-cc39-4eda-9f8c-b2adbe197a96'
    script.async = true
    document.body.appendChild(script)

    // Set up unread messages listener when Zendesk loads
    script.onload = () => {
      if (window.zE) {
        window.zE('messenger:on', 'unreadMessages', (count: number) => {
          setUnreadCount(count)

          // if there are unread messages, show badge
          if (count > 0) {
            setShowCounter(true)
          }
          // if there are more than 4 unread messages, show the widget
          else if (count >= 4) {
            window.zE('messenger', 'open')
          }
          // else hide the counter
          else {
            setShowCounter(false)
          }
        })
      }
    }

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
    }
  }, [])

  const openWidget = () => {
    if (window.zE) {
      window.zE('messenger', 'open')
    }
  }

  const demoCounter = () => {
    setUnreadCount(9)
    setShowCounter(true)
  }

  return (
    <>
      {/* Custom Launcher */}
      <div aria-live="assertive" id="showWidget" className="fixed bottom-6 right-6 z-40">
        <div className="w-full flex flex-col items-center sm:items-end">
          <div className="bg-cyan-600 hover:bg-blue-800 shadow-lg p-3 rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
            <div className="shrink-0 flex">
              <button
                type="button"
                onClick={openWidget}
                className="rounded-md inline-flex text-white hover:text-blue-50 focus:outline-hidden"
              >
                <span className="sr-only">Help</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unread Counter Badge */}
      {showCounter && (
        <div className="absolute bottom-16 right-4 z-40" id="counter_blob">
          <div className="bg-red-700 shadow-lg p-1 rounded-full pointer-events-auto overflow-hidden">
            <div className="shrink-0 flex">
              <button
                type="button"
                onClick={openWidget}
                className="h-4 w-4 flex justify-center rounded-md text-white focus:outline-hidden"
              >
                <span className="font-medium text-xs">{unreadCount}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main id="content" className="md:pl-72 py-10 px-4 sm:px-6 md:px-8">
        <header>
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between md:space-x-5">
              <div className="w-2/3">
                <h1 className="text-3xl text-licorice dark:text-white">{metadata.title}</h1>
                <h2 className="mt-2 text-xl text-licorice dark:text-white">{metadata.description}</h2>
              </div>
              <div className="w-1/3 justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
                <Button
                as="a"
                href="https://internalnote.com/custom-launcher-for-zendesk-messaging-and-unread-counts?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
              </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 mb-32">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg leading-6 text-blue-gray-500">
              This page has 2 ways to open the Zendesk Widget. You can either use the <em>Contact Us</em> button below, or the Custom Launcher at the bottom.
            </p>
            <div className="bg-white dark:bg-licorice border border-gray-200 sm:rounded-lg mt-8">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 text-licorice dark:text-white">Need Help?</h3>
                <div className="mt-2 max-w-xl text-sm text-licorice dark:text-white">
                  <p>Our Answer Bot is available 24/7 to assist you. Or you can talk to one of our agents directly.</p>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={openWidget}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-xs font-medium rounded-md text-licorice dark:text-white bg-white dark:bg-licorice hover:bg-gray-50 sm:text-sm"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-blue-50 p-4 mt-4">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    This Custom Launcher also implements the new{' '}
                    <a
                      className="font-medium underline"
                      href="https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/sdk_api_reference/#unread-messages"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unread Messages
                    </a>{' '}
                    callback
                  </p>
                  <p className="mt-3 text-sm md:mt-0 md:ml-6">
                    <button
                      onClick={demoCounter}
                      className="whitespace-nowrap font-medium text-blue-700 dark:text-blue-400 hover:text-licorice dark:hover:text-white"
                    >
                      Demo <span aria-hidden="true">&rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// Extend window type for Zendesk
declare global {
  interface Window {
    zE?: any
  }
}
