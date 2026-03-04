import { useState, useEffect } from 'react'

const STORAGE_KEY = 'caching-banner-dismissed'
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds

export default function CachingBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissedData = localStorage.getItem(STORAGE_KEY)
    if (dismissedData) {
      const { timestamp } = JSON.parse(dismissedData)
      const now = Date.now()

      // If less than a week has passed, keep it hidden
      if (now - timestamp < ONE_WEEK) {
        return
      }
    }

    // Show the banner
    setIsVisible(true)
  }, [])

  const handleDismiss = () => {
    // Store dismissal timestamp
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ timestamp: Date.now() })
    )
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <div className="rounded-lg bg-lime shadow-lg border border-gray-200">
        <div className="p-4">
          <div className="flex items-start">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-licorice dark:text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-licorice dark:text-white">Caching</h3>
              <div className="mt-2 text-sm text-licorice dark:text-white">
                <p>
                  If you experience issues triggering the proactive alerts, clear your LocalStorage and try again.
                </p>
                <p>
                  If the widget does not appear, refresh the page. Since we load different widgets depending on the demo React routing sometimes gets confused.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="ml-3 inline-flex shrink-0 rounded-md text-licorice dark:text-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-licorice focus:ring-offset-2 focus:ring-offset-lime"
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
