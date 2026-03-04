import { useEffect } from 'react'
import Button from '@/components/Button'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'proactive-product',
  category: 'proactive',
  categoryName: 'Proactive Messaging',
  name: 'Product-based',
  icon: '🎫',
  path: '/proactive/product',
  title: 'Proactive Messages Demo',
  description: 'UTM Tags or URL parameters: Visitors with a campaign tag get an alert'
}

export default function ProactiveProduct() {
  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Add Zendesk widget script
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

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div className="w-2/3">
              <h1 className="text-3xl text-licorice dark:text-white">{metadata.title}</h1>
              <h2 className="mt-2 text-xl text-licorice dark:text-white">{metadata.description}</h2>
            </div>
            <div className="w-1/3 justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <Button
                as="a"
                href="https://internalnote.com/proactive-ticketing-for-messaging/?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mb-32">
        <div className="pb-16 pt-6 sm:pb-24">
          <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
              <div className="lg:col-span-5 lg:col-start-8">
                <div className="flex justify-between">
                  <h1 className="text-xl text-licorice dark:text-white">Jurassic Park Tickets</h1>
                  <p className="text-xl text-licorice dark:text-white">$1138</p>
                </div>
              </div>

              {/* Image gallery */}
              <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
                  <img src="/img/product.jpg" alt="Entry gate" className="lg:col-span-2 lg:row-span-2 rounded-lg" />
                </div>
              </div>

              <div className="lg:col-span-5">
                <form>
                  <div className="mt-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm text-licorice dark:text-white">Experience</h2>
                    </div>

                    <fieldset className="mt-2">
                      <legend className="sr-only">Choose a size</legend>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                        <label className="flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1 cursor-pointer">
                          <input type="radio" name="size-choice" value="VIP" className="sr-only" />
                          <span>🦖 VIP Experience</span>
                        </label>

                        <label className="flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium uppercase sm:flex-1 border-blue-600 text-licorice dark:text-white hover:bg-matcha hover:text-white cursor-pointer">
                          <input type="radio" name="size-choice" value="KIDS" className="sr-only" />
                          <span>🦕 KIDS Package</span>
                        </label>
                      </div>
                    </fieldset>
                  </div>

                  <button
                    type="submit"
                    className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-matcha px-8 py-3 text-base text-licorice dark:text-white"
                  >
                    Add to cart
                  </button>
                </form>

                <div className="mt-10">
                  <h2 className="text-sm text-licorice dark:text-white">Description</h2>
                  <div className="prose prose-sm mt-4 text-licorice dark:text-white">
                    <p>
                      Experience the wonder of Jurassic Park! Walk among the dinosaurs and witness the incredible
                      recreation of these prehistoric creatures. Choose from our VIP experience or family-friendly
                      KIDS package.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
