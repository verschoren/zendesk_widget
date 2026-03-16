import { useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'embed-multicolumn',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Multi Column',
  icon: '📊',
  path: '/embed/multicolumn',
  title: 'Multi-Column Widget Demo',
  description: 'Conversation and message list as separate embedded elements',
  parentId: 'embeddable_mode'
}

export default function MultiColumn() {
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
        // Render conversation list
        window.zE('messenger', 'render', {
          mode: 'embedded',
          widget: {
            targetElement: '#conversation-list',
          },
          conversationList: { visible: true }
        })

        // Render message log
        window.zE('messenger', 'render', {
          mode: 'embedded',
          widget: {
            targetElement: '#message-log',
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
      <div className="fixed top-0 w-full flex h-16 justify-start items-center gap-x-6 bg-matcha px-6 py-2.5 z-50">
        <p className="text-sm text-licorice dark:text-white">
          Change the column sizes at the bottom of the conversation column
        </p>
        <a
          href="https://internalnote.com/embeddable-zendesk-widget?utm_source=demo_pages"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-licorice px-3.5 py-1 text-sm font-semibold text-white shadow-xs"
        >
          View article <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="pt-16 h-screen flex">
        {/* Conversation List Column */}
        <div className="w-1/3 border-r border-gray-200">
          <div id="conversation-list" className="h-full"></div>
        </div>

        {/* Message Log Column */}
        <div className="w-2/3">
          <div id="message-log" className="h-full"></div>
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
