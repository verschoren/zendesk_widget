import { useState, useEffect, useRef } from 'react'
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

const categories = [
  { name: 'New Arrivals', image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-category-01.jpg' },
  { name: 'Productivity', image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-category-02.jpg' },
  { name: 'Workspace', image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-category-04.jpg' },
  { name: 'Accessories', image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-category-05.jpg' },
  { name: 'Sale', image: 'https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-category-03.jpg' }
]

export default function Draggable() {
  const [showWidget, setShowWidget] = useState(false)
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const widgetRef = useRef<HTMLDivElement>(null)

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
    setTimeout(() => {
      if (window.zE) {
        window.zE('messenger', 'render', {
          mode: 'embedded',
          widget: {
            targetElement: '#widget',
          }
        })
        window.zE('messenger', 'open')
      }
    }, 100)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.cursor-move')) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragStart])

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

      <div className="pt-16 w-full">
        {/* Hero section */}
        <div className="relative bg-gray-900">
          {/* Decorative image and overlay */}
          <div className="absolute inset-0 overflow-hidden">
            <img src="https://tailwindcss.com/plus-assets/img/ecommerce-images/home-page-01-hero-full-width.jpg" alt="" className="size-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>

          {/* Navigation */}
          <header className="relative z-10">
            <nav>
              <div className="bg-white/10 backdrop-blur-md backdrop-filter">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 items-center justify-between">
                    {/* Logo (lg+) */}
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

                    {/* Logo (lg-) */}
                    <a href="#" className="lg:hidden">
                      <span className="sr-only">Your Company</span>
                      <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white" alt="" className="h-8 w-auto" />
                    </a>

                    <div className="flex flex-1 items-center justify-end">
                      <div className="flex items-center lg:ml-8">
                        <button
                          onClick={handleGetHelp}
                          className="text-sm font-medium text-white lg:block"
                        >
                          Get Help
                        </button>
                      </div>
                    </div>
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
        </main>

        <footer className="bg-gray-900 mt-24">
          <h2 className="sr-only">Footer</h2>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-800 py-10">
              <p className="text-sm text-gray-400">Copyright &copy; 2021 Your Company, Inc.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Draggable Widget */}
      {showWidget && (
        <div
          ref={widgetRef}
          className="fixed z-50 pointer-events-auto"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '320px',
            height: '500px'
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="rounded-lg bg-white shadow-xl overflow-hidden h-full flex flex-col">
            <div className="cursor-move h-9 px-2 py-2 bg-[#026adb] text-white flex justify-between items-center rounded-t-lg">
              <div className="text-sm">Drag me</div>
              <button
                onClick={() => setShowWidget(false)}
                className="hover:text-blue-400 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div id="widget" className="flex-1 overflow-hidden rounded-b-lg"></div>
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
