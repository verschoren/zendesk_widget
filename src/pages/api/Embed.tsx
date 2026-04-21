import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'api-embed',
  category: 'utility',
  categoryName: 'API Tests',
  name: 'Embed Test',
  icon: '🧪',
  path: '/api/embed',
  title: 'Embedded Widget Test',
  description: 'Test page for embedded widget mode'
}

export default function EmbedTest() {
  const hasRendered = useRef(false)

  useEffect(() => {
    // Prevent double rendering in React StrictMode
    if (hasRendered.current) {
      console.log('[Test] Skipping duplicate render (StrictMode)')
      return
    }
    hasRendered.current = true

    document.title = `Internal Note - ${metadata.title}`

    console.log('[Test] Loading embedded widget...')

    // Check if script already exists
    const existingScript = document.getElementById('ze-snippet')

    if (existingScript && window.zE) {
      console.log('[Test] Script already loaded, rendering with existing zE')

      // Containers check
      const conversationEl = document.getElementById('conversation-list')
      const messageEl = document.getElementById('message-log')

      if (!conversationEl || !messageEl) {
        console.error('[Test] ❌ Containers not found!')
        return
      }

      console.log('[Test] Rendering embedded widget')
      window.zE('messenger', 'render', {
        mode: 'embedded',
        conversationList: { targetElement: '#conversation-list' },
        messageLog: { targetElement: '#message-log' }
      }, (error: any) => {
        if (error) {
          console.error('[Test] ❌ Render error:', error)
        } else {
          console.log('[Test] ✅ Embedded widget rendered successfully')
        }
      })

      return
    }

    // Vanilla Zendesk code - embedded mode with autorender false
    window.zEMessenger = { autorender: false }

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
          console.log('[Test] Rendering embedded widget with conversation list and message log')

          // Check if containers exist
          const conversationEl = document.getElementById('conversation-list')
          const messageEl = document.getElementById('message-log')

          if (!conversationEl || !messageEl) {
            console.error('[Test] ❌ Containers not found!', { conversationEl, messageEl })
            return
          }

          console.log('[Test] Containers found:', {
            conversationList: conversationEl,
            messageLog: messageEl
          })

          window.zE('messenger', 'render', {
            mode: 'embedded',
            conversationList: {
              targetElement: '#conversation-list'
            },
            messageLog: {
              targetElement: '#message-log'
            }
          }, (error: any) => {
            if (error) {
              console.error('[Test] ❌ Render error:', {
                message: error.message,
                reason: error.reason,
                type: error.type
              })
            } else {
              console.log('[Test] ✅ Embedded widget rendered successfully')
            }
          })
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
      <div className="mx-auto max-w-7xl">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <Link
              to="/api/floating"
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Floating Mode
            </Link>
            <Link
              to="/api/embed"
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600 dark:text-blue-400"
            >
              Embedded Mode
            </Link>
          </nav>
        </div>

        <h1 className="text-3xl font-bold text-licorice dark:text-white mb-6">
          Embedded Widget Test
        </h1>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-licorice dark:text-white mb-4">
            Expected Behavior
          </h2>
          <p className="text-licorice dark:text-white mb-2">
            Widget should render in two containers below: conversation list on the left, message log on the right.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check browser console for detailed logs.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-licorice dark:text-white mb-4">
            Embed Code Used
          </h2>
          <pre className="bg-white dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto">
{`<script>
  window.zEMessenger = { autorender: false }
</script>
<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4"></script>
<script>
  window.zE('messenger', 'render', {
    mode: 'embedded',
    conversationList: {
      targetElement: '#conversation-list'
    },
    messageLog: {
      targetElement: '#message-log'
    }
  }, (error) => {
    if (error) {
      console.error('Render error:', error)
    } else {
      console.log('Widget rendered successfully')
    }
  })
</script>`}
          </pre>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-licorice dark:text-white mb-2">
              Conversation List Container
            </h3>
            <div
              id="conversation-list"
              className="h-[600px] bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
            ></div>
          </div>

          <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-licorice dark:text-white mb-2">
              Message Log Container
            </h3>
            <div
              id="message-log"
              className="h-[600px] bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
            ></div>
          </div>
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
