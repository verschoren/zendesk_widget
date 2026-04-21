import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'api-floating',
  category: 'utility',
  categoryName: 'API Tests',
  name: 'Floating Test',
  icon: '🧪',
  path: '/api/floating',
  title: 'Floating Widget Test',
  description: 'Test page for floating widget mode'
}

export default function FloatingTest() {
  const hasRendered = useRef(false)

  useEffect(() => {
    // Prevent double rendering in React StrictMode
    if (hasRendered.current) {
      console.log('[Test] Skipping duplicate render (StrictMode)')
      return
    }
    hasRendered.current = true

    document.title = `Internal Note - ${metadata.title}`

    console.log('[Test] Loading floating widget...')

    // Check if script already exists
    const existingScript = document.getElementById('ze-snippet')

    if (existingScript && window.zE) {
      console.log('[Test] Script already loaded, re-rendering in floating mode')

      // Need to explicitly render in floating mode when switching from embedded
      window.zE('messenger', 'render', { mode: 'floating' }, (error: any) => {
        if (error) {
          console.error('[Test] ❌ Render error:', error)
        } else {
          console.log('[Test] ✅ Floating widget rendered successfully')
        }
      })

      return
    }

    // Set autorender to true for floating mode (let Zendesk handle it automatically)
    window.zEMessenger = { autorender: true }

    // Simple vanilla Zendesk code - floating mode with autorender
    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
    script.async = true

    script.onload = () => {
      console.log('[Test] Script loaded')

      // Wait for zE
      const check = setInterval(() => {
        if (window.zE) {
          clearInterval(check)
          console.log('[Test] zE available')
          console.log('[Test] With autorender: true, widget should appear automatically')
          console.log('[Test] ✅ Floating widget should now be visible')
        }
      }, 50)
    }

    document.body.appendChild(script)

    // No cleanup - let script persist for testing navigation
    return () => {
      console.log('[Test] Page unmounting (script persists for navigation test)')
    }
  }, [])

  return (
    <div className="py-10 px-4 sm:px-6 md:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <Link
              to="/api/floating"
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              Floating Mode
            </Link>
            <Link
              to="/api/embed"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Embedded Mode
            </Link>
          </nav>
        </div>

        <h1 className="text-3xl font-bold text-licorice dark:text-white mb-6">
          Floating Widget Test
        </h1>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-licorice dark:text-white mb-4">
            Expected Behavior
          </h2>
          <p className="text-licorice dark:text-white mb-2">
            Widget should appear in bottom-right corner as a floating launcher button.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check browser console for detailed logs.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-licorice dark:text-white mb-4">
            Embed Code Used
          </h2>
          <pre className="bg-white dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto">
{`<script>
  window.zEMessenger = { autorender: true }
</script>
<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4"></script>
<!-- Widget appears automatically with autorender: true -->`}
          </pre>
        </div>
      </div>
    </div>
  )
}

declare global {
  interface Window {
    zE?: any
    zEMessenger?: any
  }
}
