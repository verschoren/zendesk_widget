import { useState, useEffect } from 'react'
import { PageMetadata } from '@/types/page'
import InfoBanner from '@/components/InfoBanner'

export const metadata: PageMetadata = {
  id: 'embed-homescreen',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Custom Launcher',
  icon: '🏠',
  path: '/embed/homescreen',
  title: 'Custom Launcher Widget Demo',
  description: 'Custom launcher experience with home screen',
  parentId: 'embeddable_mode'
}

const categories = [
  { name: 'New Arrivals', image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-category-01.jpg' },
  { name: 'Productivity', image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-category-02.jpg' },
  { name: 'Workspace', image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-category-04.jpg' },
  { name: 'Accessories', image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-category-05.jpg' },
  { name: 'Sale', image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-category-03.jpg' }
]

export default function HomeScreen() {
  const [showWidget, setShowWidget] = useState(false)
  const [view, setView] = useState<'home' | 'conversation'>('home')
  const [widgetRendered, setWidgetRendered] = useState(false)

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

  // Render the widget when showWidget becomes true
  useEffect(() => {
    if (showWidget && !widgetRendered) {
      setTimeout(() => {
        if (window.zE) {
          window.zE('messenger', 'render', {
            mode: 'embedded',
            conversationList: {
              targetElement: '#widget_conversations',
            },
            messageLog: {
              targetElement: '#widget_messages',
            },
          })
          window.zE('messenger:set', 'customization', {
            common: {
              hideHeader: true
            },
            conversationList: {
              hideNewConversationButton: true
            }
          })
          setWidgetRendered(true)
        }
      }, 100)
    }
  }, [showWidget, widgetRendered])

  const handleStartConversation = () => {
    setView('conversation')
    if (window.zE) {
      window.zE('messenger:ui', 'newConversation')
    }
  }

  return (
    <>
      <InfoBanner description="Open the widget to enjoy a custom launcher experience" />

      <div className="bg-white">
        {/* Hero section */}
        <div className="relative bg-gray-900">
          <div className="absolute inset-0 overflow-hidden">
            <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-hero-full-width.jpg" alt="" className="size-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>

          <header className="relative z-10">
            <nav>
              <div className="bg-white/10 backdrop-blur-md backdrop-filter">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 items-center justify-between">
                    <div className="hidden lg:flex lg:flex-1 lg:items-center">
                      <a href="#">
                        <span className="sr-only">Your Company</span>
                        <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white" alt="" className="h-8 w-auto" />
                      </a>
                    </div>

                    <div className="hidden h-full lg:flex">
                      <div className="flex h-full justify-center space-x-8 px-4">
                        <a href="#" className="flex items-center text-sm font-medium text-white">Company</a>
                        <a href="#" className="flex items-center text-sm font-medium text-white">Stores</a>
                      </div>
                    </div>

                    <a href="#" className="lg:hidden">
                      <span className="sr-only">Your Company</span>
                      <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white" alt="" className="h-8 w-auto" />
                    </a>

                    <div className="flex flex-1 items-center justify-end"></div>
                  </div>
                </div>
              </div>
            </nav>
          </header>

          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
            <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">New arrivals are here</h1>
            <p className="mt-4 text-xl text-white">The new arrivals have, well, newly arrived. Check out the latest options from our summer small-batch release while they're still in stock.</p>
            <a href="#" className="mt-8 inline-block rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100">Shop New Arrivals</a>
          </div>
        </div>

        <main>
          {/* Category section */}
          <section className="pt-24 sm:pt-32 xl:mx-auto xl:max-w-7xl xl:px-8">
            <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
              <a href="#" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
                Browse all categories
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>

            <div className="mt-4 flow-root">
              <div className="-my-2">
                <div className="relative box-content h-80 overflow-x-auto py-2 xl:overflow-visible">
                  <div className="absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0">
                    {categories.map((category) => (
                      <a key={category.name} href="#" className="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 hover:opacity-75 xl:w-auto">
                        <span className="absolute inset-0">
                          <img src={category.image} alt="" className="size-full object-cover" />
                        </span>
                        <span className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"></span>
                        <span className="relative mt-auto text-center text-xl font-bold text-white">{category.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 px-4 sm:hidden">
              <a href="#" className="block text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                Browse all categories
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
          </section>

          {/* Featured section */}
          <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-8">
            <div className="relative overflow-hidden rounded-lg">
              <div className="absolute inset-0">
                <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-feature-section-01.jpg" alt="" className="size-full object-cover" />
              </div>
              <div className="relative bg-gray-900/75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
                <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    <span className="block sm:inline">Level up</span>
                    <span className="block sm:inline"> your desk</span>
                  </h2>
                  <p className="mt-3 text-xl text-white">Make your desk beautiful and organized. Post a picture to social media and watch it get more likes than life-changing announcements. Reflect on the shallow nature of existence. At least you have a really nice desk setup.</p>
                  <a href="#" className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto">Shop Workspace</a>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Custom Launcher */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setShowWidget(!showWidget)}
          className="w-18 h-18 rounded-full bg-fuchsia-200 hover:bg-fuchsia-300 cursor-pointer p-4 shadow-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </button>
      </div>

      {/* Custom Widget */}
      {showWidget && (
        <div className="fixed bottom-28 right-8 z-50 w-[380px] h-[600px] rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col">
          <div className={`flex-1 overflow-y-auto flex flex-col gap-2 p-6 ${view !== 'home' ? 'hidden' : ''}`}>
            {/* Profile */}
            <section className="text-center">
              <div className="shrink-0">
                <img src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" className="mx-auto size-20 rounded-full" />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600">Welcome back,</p>
                <p className="text-xl font-bold text-gray-900">Chelsea Hagon</p>
              </div>
              <button
                onClick={handleStartConversation}
                className="mt-5 inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
              >
                Start a conversation
              </button>
            </section>

            {/* Help Center Articles */}
            <section className="mt-6">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <h3 className="px-4 pt-4 text-sm font-semibold text-purple-800 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  Recent Help Center Articles
                </h3>
                <div className="p-4">
                  <ul className="space-y-3 text-sm">
                    <li><a href="#" className="text-gray-700 hover:text-gray-900">Getting started guide</a></li>
                    <li><a href="#" className="text-gray-700 hover:text-gray-900">Account settings</a></li>
                    <li><a href="#" className="text-gray-700 hover:text-gray-900">Billing & subscriptions</a></li>
                  </ul>
                  <div className="mt-4">
                    <a href="#" className="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">View all</a>
                  </div>
                </div>
              </div>
            </section>

            {/* Conversations */}
            <section className="mt-6">
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <h3 className="px-4 pt-4 pb-3 text-sm font-semibold text-purple-800 flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                  Your conversations
                </h3>
                <div className="h-[200px] overflow-hidden border-t border-gray-200" id="widget_conversations"></div>
              </div>
            </section>
          </div>

          <div className={`flex-1 flex flex-col ${view !== 'conversation' ? 'hidden' : ''}`}>
            <button
              onClick={() => setView('home')}
              className="flex gap-1 items-center px-4 pt-4 text-xs font-semibold text-gray-500 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
              Back to list
            </button>
            <div className="flex-1" id="widget_messages"></div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute inset-x-0 -top-40 transform-gpu blur-3xl sm:-top-80">
              <div
                style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              />
            </div>
          </div>
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
