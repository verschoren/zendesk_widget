import { useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'embed-intranet',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Intranet',
  icon: '🏢',
  path: '/embed/intranet',
  title: 'Intranet Widget Demo',
  description: 'Inline single message thread embedded in page',
  parentId: 'embeddable_mode'
}

const quickLinks = [
  { name: 'Request time off', icon: '🕐', color: 'bg-teal-50 text-teal-700', description: 'Submit your vacation or time off requests' },
  { name: 'Benefits', icon: '✓', color: 'bg-purple-50 text-purple-700', description: 'Review your health and wellness benefits' },
  { name: 'Schedule a one-on-one', icon: '👥', color: 'bg-sky-50 text-sky-700', description: 'Book time with your manager or colleagues' },
  { name: 'Payroll', icon: '💵', color: 'bg-yellow-50 text-yellow-700', description: 'Access your pay stubs and tax documents' },
  { name: 'Submit an expense', icon: '📋', color: 'bg-rose-50 text-rose-700', description: 'File expense reports for reimbursement' },
  { name: 'Training', icon: '🎓', color: 'bg-indigo-50 text-indigo-700', description: 'Browse available courses and certifications' }
]

export default function Intranet() {
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
        window.zE('messenger', 'render', {
          mode: 'embedded',
          messageLog: {
            targetElement: '#widget_messages',
          }
        })

        window.zE('messenger:set', 'customization', {
          common: {
            hideHeader: true
          },
          conversationList: {
            hideNewConversationButton: true
          }
        })
      }
    }

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
    }
  }, [])

  const handleNewConversation = () => {
    if (window.zE) {
      window.zE('messenger:ui', 'newConversation')
    }
  }

  return (
    <>
      <div className="fixed top-0 w-full flex h-16 justify-start items-center gap-x-6 bg-matcha px-6 py-2.5 z-50">
        <p className="text-sm text-licorice dark:text-white">
          Discover an embedded chat right within this page
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

      <div className="absolute top-16 w-full">
        {/* Intranet Header */}
        <header className="bg-gradient-to-r from-sky-800 to-cyan-600 pb-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="relative flex flex-wrap items-center justify-center lg:justify-between">
              {/* Logo */}
              <div className="absolute left-0 shrink-0 py-5 lg:static">
                <a href="#">
                  <span className="sr-only">Your Company</span>
                  <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=cyan&shade=200" alt="" className="h-8 w-auto" />
                </a>
              </div>

              <div className="w-full py-5 lg:border-t lg:border-white/20">
                <div className="lg:grid lg:grid-cols-3 lg:items-center lg:gap-8">
                  {/* Left nav */}
                  <div className="hidden lg:col-span-2 lg:block">
                    <nav className="flex space-x-4">
                      <a href="#" aria-current="page" className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-white/10">Home</a>
                      <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-white/10">Profile</a>
                      <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-white/10">Resources</a>
                      <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-white/10">Company Directory</a>
                      <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-cyan-100 hover:bg-white/10">Openings</a>
                    </nav>
                  </div>
                  <div className="px-12 lg:px-0">
                    {/* Search */}
                    <div className="mx-auto grid w-full max-w-xs grid-cols-1 lg:max-w-md">
                      <input type="search" name="search" placeholder="Search" className="peer col-start-1 row-start-1 block w-full rounded-md bg-white/20 py-1.5 pr-3 pl-10 text-base text-white outline-none placeholder:text-white focus:bg-white focus:placeholder:text-gray-400 sm:text-sm" />
                      <svg viewBox="0 0 20 20" fill="currentColor" className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-white peer-focus:text-gray-400">
                        <path d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" fillRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="-mt-24 pb-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                {/* Welcome panel */}
                <section>
                  <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <div className="bg-white p-6">
                      <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="sm:flex sm:space-x-5">
                          <div className="shrink-0">
                            <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="mx-auto size-20 rounded-full" />
                          </div>
                          <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                            <p className="text-sm font-medium text-gray-600">Welcome back,</p>
                            <p className="text-xl font-bold text-gray-900 sm:text-2xl">Chelsea Hagon</p>
                            <p className="text-sm font-medium text-gray-600">Human Resources Manager</p>
                          </div>
                        </div>
                        <div className="mt-5 flex justify-center sm:mt-0">
                          <a href="#" className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">View profile</a>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                      <div className="px-6 py-5 text-center text-sm font-medium">
                        <span className="text-gray-900">12</span> <span className="text-gray-600">Vacation days left</span>
                      </div>
                      <div className="px-6 py-5 text-center text-sm font-medium">
                        <span className="text-gray-900">4</span> <span className="text-gray-600">Sick days left</span>
                      </div>
                      <div className="px-6 py-5 text-center text-sm font-medium">
                        <span className="text-gray-900">2</span> <span className="text-gray-600">Personal days left</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Actions panel */}
                <section>
                  <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-gray-200 shadow-sm sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
                    {quickLinks.map((link, index) => (
                      <div
                        key={link.name}
                        className={`group relative bg-white p-6 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-inset ${
                          index === 0 ? 'rounded-tl-lg sm:rounded-tr-none rounded-tr-lg' : ''
                        } ${index === 1 ? 'sm:rounded-tr-lg' : ''} ${index === 4 ? 'sm:rounded-bl-lg' : ''} ${index === 5 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : ''}`}
                      >
                        <div>
                          <span className={`inline-flex rounded-lg p-3 ring-4 ring-white ${link.color}`}>
                            <span className="text-2xl">{link.icon}</span>
                          </span>
                        </div>
                        <div className="mt-8">
                          <h3 className="text-lg font-medium">
                            <a href="#" className="focus:outline-none">
                              <span className="absolute inset-0"></span>
                              {link.name}
                            </a>
                          </h3>
                          <p className="mt-2 text-sm text-gray-500">{link.description}</p>
                        </div>
                        <span className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                          </svg>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4">
                {/* Announcements */}
                <section>
                  <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                    <div className="p-6">
                      <h2 className="text-base font-medium text-gray-900">Announcements</h2>
                      <div className="mt-6 flow-root">
                        <ul role="list" className="-my-5 divide-y divide-gray-200">
                          <li className="py-5">
                            <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                              <h3 className="text-sm font-semibold text-gray-800">
                                <a href="#" className="hover:underline focus:outline-none">
                                  <span className="absolute inset-0"></span>
                                  Office closed on July 2nd
                                </a>
                              </h3>
                              <p className="mt-1 line-clamp-2 text-sm text-gray-600">Enjoy the long weekend with your family and friends.</p>
                            </div>
                          </li>
                          <li className="py-5">
                            <div className="relative focus-within:ring-2 focus-within:ring-cyan-500">
                              <h3 className="text-sm font-semibold text-gray-800">
                                <a href="#" className="hover:underline focus:outline-none">
                                  <span className="absolute inset-0"></span>
                                  New password policy
                                </a>
                              </h3>
                              <p className="mt-1 line-clamp-2 text-sm text-gray-600">Please update your password to meet the new security requirements.</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-6">
                        <a href="#" className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">View all</a>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Support */}
                <section>
                  <div className="rounded-lg bg-white shadow-sm">
                    <div className="px-6 pt-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-base font-medium text-gray-900">Support</h2>
                        <button
                          onClick={handleNewConversation}
                          className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                        >
                          New chat
                        </button>
                      </div>
                      <div className="flow-root h-[480px]" id="widget_messages"></div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
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
