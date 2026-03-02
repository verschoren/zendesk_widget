import { useState, useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'no-bot',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'No Bot',
  icon: '🚫',
  path: '/messaging/no-bot',
  title: 'Zendesk Messaging Widget',
  description: 'Widget Flow without a Bot'
}

type Pill = 'red_pill' | 'blue_pill' | null

export default function NoBot() {
  const [selectedPill, setSelectedPill] = useState<Pill>(null)

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Add Zendesk widget script
    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=93b6a906-6e2a-47c8-92c6-6ce73b67df20'
    script.async = true
    document.body.appendChild(script)

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
    }
  }, [])

  const handlePillClick = (pill: 'red_pill' | 'blue_pill') => {
    setSelectedPill(pill)

    if (window.zE) {
      window.zE('messenger:set', 'conversationFields', [{ id: '13281147569042', value: pill }])
      window.zE('messenger', 'open')
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
                href="https://internalnote.com/widget-without-a-bot?utm_source=widget_demo&campaign=demo"
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

      <div className="mt-8 mb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <p className="mt-6 text-md leading-8 text-gray-600">
              Pick a pill and you will see its info prefilled in the Messaging Widget.<br />
              Note, just like in the Matrix, you can't change your choice once a made it.
            </p>
          </div>
          <ul role="list" className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            <li
              onClick={() => handlePillClick('red_pill')}
              className={`inline-flex items-center rounded-full bg-red-100 hover:bg-red-500 px-8 py-4 text-xl font-medium text-red-700 hover:text-red-100 cursor-pointer ${
                selectedPill === 'red_pill' ? 'border border-2 border-red-500' : ''
              }`}
            >
              <span className="mx-auto">Red Pill</span>
            </li>
            <li
              onClick={() => handlePillClick('blue_pill')}
              className={`inline-flex items-center rounded-full bg-blue-100 hover:bg-blue-500 px-8 py-4 text-xl font-medium text-blue-700 hover:text-blue-100 cursor-pointer ${
                selectedPill === 'blue_pill' ? 'border border-2 border-blue-500' : ''
              }`}
            >
              <span className="mx-auto">Blue Pill</span>
            </li>
          </ul>
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
