import { useEffect, useState } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'classic-customization',
  category: 'classic',
  categoryName: 'Classic Widget',
  name: 'Customization',
  icon: '🎨',
  path: '/classic/customization',
  title: 'Classic Zendesk Widget Customization',
  description: 'Demo page to showcase rebranding your Zendesk Classic Widget'
}

export default function ClassicCustomization() {
  const [settings] = useState({
    webWidget: {
      contactOptions: {
        enabled: true
      },
      color: {
        theme: '#007aff',
        launcher: '#FFCC00',
        launcherText: '#142b39',
        button: '#007AFF',
        resultLists: '#007AFF',
        header: '#FF443A',
        articleLinks: '#007AFF'
      },
      answerBot: {
        avatar: {
          url: 'internalnote_social@2x.png',
          name: { '*': 'Internal Note Bot' }
        },
        title: {
          '*': 'Customer Care'
        }
      },
      chat: {
        concierge: {
          avatarPath: 'internalnote_social@2x.png',
          name: 'Customer Care Team',
          title: { '*': 'We take care of you' }
        },
        title: {
          '*': 'Chat to Us'
        }
      },
      launcher: {
        label: {
          '*': 'Customer Care'
        },
        talkLabel: {
          '*': 'Call Us'
        },
        chatLabel: {
          '*': 'Live Chat'
        }
      }
    }
  })

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Set Zendesk settings
    window.zESettings = settings

    // Add Zendesk widget script
    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=0a2feffd-e8f6-4772-96bf-2e1ae82842a9'
    script.async = true
    document.body.appendChild(script)

    // Load highlight.js for syntax highlighting
    const highlightScript = document.createElement('script')
    highlightScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js'
    highlightScript.async = true
    document.body.appendChild(highlightScript)

    highlightScript.onload = () => {
      if (window.hljs) {
        window.hljs.highlightAll()
      }
    }

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
      if (highlightScript.parentNode) {
        highlightScript.remove()
      }
    }
  }, [settings])

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
                href="https://internalnote.com/customize-and-your-zendesk-widget?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-matcha px-4 py-2 text-sm text-licorice shadow-xs"
              >
                Read more
              </a>
              <a
                href="https://widget.internalnote.com?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-matcha px-4 py-2 text-sm text-licorice shadow-xs"
              >
                Open Configurator
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-32">
          <pre className="text-sm whitespace-pre-wrap rounded-lg" style={{ backgroundColor: '#282c34', padding: '20px' }}>
            <code id="codeblock" className="language-json">
              {`zESettings = ${JSON.stringify(settings, null, '\t')}`}
            </code>
          </pre>
        </div>
      </div>
    </>
  )
}

// Extend window type for Zendesk and highlight.js
declare global {
  interface Window {
    zESettings?: any
    hljs?: any
  }
}
