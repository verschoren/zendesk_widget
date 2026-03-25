import { useState, useEffect, useRef } from 'react'
import { PageMetadata } from '@/types/page'
import InfoBanner from '@/components/InfoBanner'

export const metadata: PageMetadata = {
  id: 'embed-overlay',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Overlay',
  icon: '📲',
  path: '/embed/overlay',
  title: 'Overlay Widget Demo',
  description: 'Slide-over overlay widget demonstration',
  parentId: 'embeddable_mode'
}

const productImages = [
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-01.jpg',
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-02.jpg',
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-03.jpg',
  'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-03-product-04.jpg',
]

export default function Overlay() {
  const [showWidget, setShowWidget] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('washed-black')
  const [expandedDetail, setExpandedDetail] = useState<string | null>(null)
  const widgetContainerRef = useRef<HTMLDivElement>(null)

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

  // Handle click outside to close overlay
  useEffect(() => {
    if (!showWidget) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check if click is inside the widget container
      if (widgetContainerRef.current && widgetContainerRef.current.contains(target)) {
        return
      }

      // Check if click is on the AppLayout sidebar (allow sidebar clicks)
      const sidebar = document.querySelector('aside, nav[class*="sidebar"], div[class*="md:fixed"][class*="md:w-72"]')
      if (sidebar && sidebar.contains(target)) {
        return
      }

      // Close the overlay if clicked outside
      handleCloseWidget()
    }

    // Add event listener with a small delay to prevent immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showWidget])

  const handleOpenWidget = () => {
    setShowWidget(true)
    setTimeout(() => {
      if (window.zE) {
        window.zE('messenger', 'render', {
          mode: 'embedded',
          widget: {
            targetElement: '#widget-container',
          }
        })
        window.zE('messenger', 'open')
      }
    }, 100)
  }

  const handleCloseWidget = () => {
    setShowWidget(false)
    if (window.zE) {
      window.zE('messenger', 'close')
    }
  }

  return (
    <>
      <InfoBanner description="Click the help icon to view an overlayed widget" />

      <div className="w-full">
        <header className="relative bg-white shadow-xs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Company" className="h-8 w-auto" />
              </div>
              <nav className="hidden lg:flex space-x-8">
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-800">Company</a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-800">Stores</a>
              </nav>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleOpenWidget}
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Help</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6">
                    <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              {/* Image gallery */}
              <div className="flex flex-col-reverse">
                {/* Image selector */}
                <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                  <div className="grid grid-cols-4 gap-6">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50 focus:ring-offset-4 ${
                          selectedImage === index ? 'ring-2 ring-indigo-500' : ''
                        }`}
                      >
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <img src={image} alt="" className="size-full object-cover" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="aspect-square w-full">
                  <img
                    src={productImages[selectedImage]}
                    alt="Product"
                    className="w-full h-full object-cover object-center sm:rounded-lg"
                  />
                </div>
              </div>

              {/* Product info */}
              <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Zip Tote Basket</h1>

                <div className="mt-3">
                  <h2 className="sr-only">Product information</h2>
                  <p className="text-3xl tracking-tight text-gray-900">$140</p>
                </div>

                {/* Reviews */}
                <div className="mt-3">
                  <h3 className="sr-only">Reviews</h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(4)].map((_, i) => (
                        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="size-5 shrink-0 text-indigo-500">
                          <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" />
                        </svg>
                      ))}
                      <svg viewBox="0 0 20 20" fill="currentColor" className="size-5 shrink-0 text-gray-300">
                        <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" />
                      </svg>
                    </div>
                    <p className="sr-only">4 out of 5 stars</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="sr-only">Description</h3>
                  <div className="space-y-6 text-base text-gray-700">
                    <p>The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, should sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.</p>
                  </div>
                </div>

                <form className="mt-6">
                  {/* Colors */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Color</h3>
                    <div className="mt-2 flex items-center gap-x-3">
                      {[
                        { name: 'washed-black', class: 'bg-gray-700' },
                        { name: 'white', class: 'bg-white' },
                        { name: 'washed-gray', class: 'bg-gray-500' }
                      ].map((color) => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color.name)}
                          className={`flex rounded-full outline -outline-offset-1 outline-black/10 ${
                            selectedColor === color.name ? 'ring-2 ring-offset-2 ring-gray-700' : ''
                          }`}
                        >
                          <span className={`size-8 rounded-full ${color.class}`}></span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-10 flex">
                    <button
                      type="submit"
                      className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Add to bag
                    </button>
                    <button
                      type="button"
                      className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6 shrink-0">
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="sr-only">Add to favorites</span>
                    </button>
                  </div>
                </form>

                {/* Product details */}
                <section className="mt-12">
                  <h2 className="sr-only">Additional details</h2>
                  <div className="divide-y divide-gray-200 border-t border-gray-200">
                    {[
                      { id: 'features', title: 'Features', items: ['Multiple strap configurations', 'Spacious interior with top zip', 'Leather handle and tabs', 'Interior dividers', 'Stainless strap loops', 'Double stitched construction', 'Water-resistant'] },
                      { id: 'care', title: 'Care', items: ['Spot clean as needed', 'Hand wash with mild soap', 'Machine wash interior dividers', 'Treat handle and tabs with leather conditioner'] }
                    ].map((detail) => (
                      <div key={detail.id}>
                        <h3>
                          <button
                            type="button"
                            onClick={() => setExpandedDetail(expandedDetail === detail.id ? null : detail.id)}
                            className="group relative flex w-full items-center justify-between py-6 text-left"
                          >
                            <span className={`text-sm font-medium ${expandedDetail === detail.id ? 'text-indigo-600' : 'text-gray-900'}`}>
                              {detail.title}
                            </span>
                            <span className="ml-6 flex items-center">
                              {expandedDetail === detail.id ? (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6 text-indigo-400">
                                  <path d="M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6 text-gray-400 group-hover:text-gray-500">
                                  <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                          </button>
                        </h3>
                        {expandedDetail === detail.id && (
                          <div className="pb-6">
                            <ul role="list" className="list-disc space-y-1 pl-5 text-sm text-gray-700 marker:text-gray-300">
                              {detail.items.map((item, index) => (
                                <li key={index} className="pl-2">{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Overlay Widget */}
      {showWidget && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-transparent">
          <div className="absolute inset-0 pl-10 sm:pl-16">
            <div className={`ml-auto h-full w-full max-w-md transform transition-transform duration-500 ease-in-out ${showWidget ? 'translate-x-0' : 'translate-x-full'}`}>
              <div ref={widgetContainerRef} className="relative flex h-full flex-col overflow-y-auto bg-white shadow-xl dark:bg-gray-800">
                <div className="fixed z-40 top-3 right-2 p-2 h-10 w-10 rounded-full">
                  <button
                    onClick={handleCloseWidget}
                    className="relative rounded-md text-white bg-[#026adb]"
                  >
                    <span className="sr-only">Close</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-6">
                      <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div id="widget-container" className="relative flex-1"></div>
              </div>
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
