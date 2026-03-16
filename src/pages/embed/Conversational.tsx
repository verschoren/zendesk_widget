import { useState, useEffect, useRef } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'embed-conversational',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Conversational Embed',
  icon: '💬',
  path: '/embed/conversational',
  title: 'Conversational Embed Widget Demo',
  description: 'Widget embedded with command palette and new conversation API',
  parentId: 'embeddable_mode'
}

export default function Conversational() {
  const [showWidget, setShowWidget] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const widgetContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    window.zEMessenger = { autorender: false }

    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
    script.async = true

    script.onload = () => {
      if (window.zE) {
        window.zE('messenger:set', 'customization', {
          common: {
            hideHeader: false
          },
          conversationList: {
            hideNewConversationButton: true,
            hideHeader: false
          },
          messageLog: {
            hideHeader: true
          }
        })
      }
    }

    document.body.appendChild(script)

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showWidget && widgetContainerRef.current && !widgetContainerRef.current.contains(event.target as Node)) {
        // Close and hide the widget properly
        if (window.zE) {
          window.zE('messenger', 'close')
          window.zE('messenger', 'hide')
        }

        // Clear the widget container
        const widgetElement = document.getElementById('widget')
        if (widgetElement) {
          widgetElement.innerHTML = ''
        }

        setShowWidget(false)
        setQuery('')
      }
    }

    if (showWidget) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showWidget])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setShowWidget(true)

      // Wait for widget to be ready, then render and trigger new conversation
      setTimeout(() => {
        if (window.zE) {
          window.zE('messenger', 'show')
          window.zE('messenger', 'render', {
            mode: 'embedded',
            widget: {
              targetElement: '#widget',
            }
          })

          // Trigger new conversation with the user's query
          window.zE('messenger:ui', 'newConversation', {
            displayName: 'Support Chat',
            message: {
              content: {
                type: 'text',
                text: query
              }
            }
          })
        }
      }, 100)
    }
  }

  return (
    <>
      <div className="fixed top-0 w-full flex h-16 justify-between items-center gap-x-6 bg-matcha px-6 py-2.5 z-50">
        <a href="/embed" className="flex gap-4 items-center">
          <img className="h-8 w-auto" src="/img/zendesk.svg" alt="Zendesk" />
          <img className="h-8 w-auto" src="/img/logo.svg" alt="Internal Note" />
        </a>
        <p className="hidden sm:flex text-sm text-licorice dark:text-white">
          Type a question and press Enter to start a conversation
        </p>
        <a
          href="https://internalnote.com/embeddable-zendesk-widget?utm_source=demo_pages"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-none rounded-full bg-licorice px-3.5 py-1 text-sm font-semibold text-white shadow-xs"
        >
          View article <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div className="pt-16 min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/img/mountain.avif)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mx-auto max-w-3xl">
            {!showWidget ? (
              <div className="flex items-center justify-center min-h-[600px]">
                <div className="w-full max-w-xl">
                  <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      How can we help?
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Type your question and press Enter to start a conversation with our support team
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                    <div className="grid grid-cols-1 border-b border-gray-100 dark:border-gray-700">
                      <input
                        ref={inputRef}
                        type="text"
                        autoFocus
                        placeholder="Type your question here..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="col-start-1 row-start-1 h-14 w-full pr-4 pl-12 text-base text-gray-900 dark:text-white border-0 outline-none focus:outline-none focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-transparent"
                      />
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 ml-4 size-5 self-center text-gray-400 dark:text-gray-500"
                      >
                        <path
                          d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                          clipRule="evenodd"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span>Press Enter to submit</span>
                        <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs font-mono">
                          ↵
                        </kbd>
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            const searchQuery = "What's new for Agent Copilot"
                            setQuery(searchQuery)
                            setShowWidget(true)
                            setTimeout(() => {
                              if (window.zE) {
                                window.zE('messenger', 'show')
                                window.zE('messenger', 'render', {
                                  mode: 'embedded',
                                  widget: {
                                    targetElement: '#widget',
                                  }
                                })
                                window.zE('messenger:ui', 'newConversation', {
                                  displayName: 'Support Chat',
                                  message: {
                                    content: {
                                      type: 'text',
                                      text: searchQuery
                                    }
                                  }
                                })
                              }
                            }, 100)
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors"
                        >
                          What's new for Agent Copilot
                        </button>
                        <button
                          onClick={() => {
                            const searchQuery = "Tell me about embeddable web widgets"
                            setQuery(searchQuery)
                            setShowWidget(true)
                            setTimeout(() => {
                              if (window.zE) {
                                window.zE('messenger', 'show')
                                window.zE('messenger', 'render', {
                                  mode: 'embedded',
                                  widget: {
                                    targetElement: '#widget',
                                  }
                                })
                                window.zE('messenger:ui', 'newConversation', {
                                  displayName: 'Support Chat',
                                  message: {
                                    content: {
                                      type: 'text',
                                      text: searchQuery
                                    }
                                  }
                                })
                              }
                            }, 100)
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors"
                        >
                          Tell me about embeddable web widgets
                        </button>
                        <button
                          onClick={() => {
                            const searchQuery = "What's the resolution platform?"
                            setQuery(searchQuery)
                            setShowWidget(true)
                            setTimeout(() => {
                              if (window.zE) {
                                window.zE('messenger', 'show')
                                window.zE('messenger', 'render', {
                                  mode: 'embedded',
                                  widget: {
                                    targetElement: '#widget',
                                  }
                                })
                                window.zE('messenger:ui', 'newConversation', {
                                  displayName: 'Support Chat',
                                  message: {
                                    content: {
                                      type: 'text',
                                      text: searchQuery
                                    }
                                  }
                                })
                              }
                            }, 100)
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded transition-colors"
                        >
                          What's the resolution platform?
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                      onClick={() => {
                        setQuery('I need help with my order')
                        setTimeout(() => inputRef.current?.focus(), 0)
                      }}
                      className="text-left p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Order Support</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get help with your order</div>
                    </button>
                    <button
                      onClick={() => {
                        setQuery('How do I reset my password?')
                        setTimeout(() => inputRef.current?.focus(), 0)
                      }}
                      className="text-left p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Account Help</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Password and login issues</div>
                    </button>
                    <button
                      onClick={() => {
                        setQuery('I have a billing question')
                        setTimeout(() => inputRef.current?.focus(), 0)
                      }}
                      className="text-left p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Billing</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Questions about charges</div>
                    </button>
                    <button
                      onClick={() => {
                        setQuery('Tell me about your product features')
                        setTimeout(() => inputRef.current?.focus(), 0)
                      }}
                      className="text-left p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Product Info</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Learn about features</div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div ref={widgetContainerRef} className="bg-white dark:bg-licorice rounded-lg shadow-xl overflow-hidden">
                <div id="widget" className="h-[700px]"></div>
              </div>
            )}
          </div>
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

