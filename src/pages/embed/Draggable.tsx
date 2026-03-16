import { useState, useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'embed-draggable',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Draggable',
  icon: '🖱️',
  path: '/embed/draggable',
  title: 'Draggable Widget Demo',
  description: 'Draggable popup widget you can move around',
  parentId: 'embeddable_mode'
}

export default function Draggable() {
  const [showWidget, setShowWidget] = useState(false)
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

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

  const handleGetHelp = () => {
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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  return (
    <>
      <div className="fixed top-0 w-full flex h-16 justify-start items-center gap-x-6 bg-matcha px-6 py-2.5 z-50">
        <p className="text-sm text-licorice dark:text-white">
          Click get Help and drag the widget around
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

      <div className="pt-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Draggable Widget Demo</h1>

          <div className="bg-white dark:bg-licorice rounded-lg shadow p-8">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Click the button below to open a draggable support widget. You can move it anywhere on the page!
            </p>
            <button
              onClick={handleGetHelp}
              className="bg-matcha dark:bg-shamrock text-licorice dark:text-white px-6 py-3 rounded-md hover:bg-lime dark:hover:bg-cactus font-semibold"
            >
              Get Help
            </button>
          </div>
        </div>
      </div>

      {showWidget && (
        <div
          className="fixed z-40 w-96 bg-white dark:bg-licorice rounded-lg shadow-2xl"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <div
            className="bg-matcha px-4 py-3 rounded-t-lg flex justify-between items-center"
            onMouseDown={handleMouseDown}
          >
            <h3 className="font-semibold text-licorice dark:text-white">Support Chat</h3>
            <button
              onClick={() => setShowWidget(false)}
              className="text-licorice dark:text-white hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div id="widget" className="h-[500px]"></div>
        </div>
      )}
    </>
  )
}

declare global {
  interface Window {
    zE?: any
    zEMessenger?: any
  }
}
