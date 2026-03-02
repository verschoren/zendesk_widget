import { useState, useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'metadata',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Metadata',
  icon: '🎬',
  path: '/messaging/metadata',
  title: 'Zendesk Messaging Metadata',
  description: 'Pre-fill Form Fields and Tags in Flow Builder'
}

type Movie = 'Blade Runner' | 'Star Wars' | 'Jaws' | 'Jurassic Park' | null
type Location = 'endor' | 'hoth' | 'tatooine' | null
type TabType = 'textfield' | 'dropdown'

export default function Metadata() {
  const [activeTab, setActiveTab] = useState<TabType>('textfield')
  const [selectedMovie, setSelectedMovie] = useState<Movie>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location>(null)

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

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)

    if (window.zE && movie) {
      window.zE('messenger:set', 'conversationFields', [{ id: '7662882404114', value: movie }])
      window.zE('messenger', 'open')
    }
  }

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location)

    if (window.zE && location) {
      window.zE('messenger:set', 'conversationFields', [{ id: '12367640319506', value: location }])
      window.zE('messenger', 'open')
    }
  }

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div>
              <h1 className="text-3xl text-licorice">{metadata.title}</h1>
              <h2 className="mt-2 text-xl text-licorice">{metadata.description}</h2>
            </div>
            <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <a
                href="https://internalnote.com/messaging-metadata?utm_source=widget_demo&campaign=demo"
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

      <div className="mt-8 mb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('textfield')}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'textfield'
                    ? 'border-blue-500 text-licorice'
                    : 'border-transparent text-licorice hover:border-gray-300 hover:text-licorice'
                }`}
              >
                Text Field
              </button>
              <button
                onClick={() => setActiveTab('dropdown')}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === 'dropdown'
                    ? 'border-blue-500 text-licorice'
                    : 'border-transparent text-licorice hover:border-gray-300 hover:text-licorice'
                }`}
              >
                Dropdown
              </button>
            </nav>
          </div>

          {activeTab === 'textfield' && (
            <>
              <div className="mx-auto max-w-2xl lg:mx-0">
                <p className="mt-6 text-md leading-8 text-gray-600">
                  Pick a movie and you will see its info prefilled in the Messaging Widget.<br />
                  Note, you can't change a movie via the posters once a conversation has started.
                </p>
              </div>
              <ul role="list" className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                <li>
                  <img
                    className={`movie aspect-2/3 cursor-pointer w-full rounded-2xl object-cover hover:scale-105 hover:rotate-3 transition-transform ${
                      selectedMovie === 'Blade Runner' ? 'border border-8 border-blue-500' : ''
                    }`}
                    src="/img/movies/bladerunner.jpeg"
                    alt="Blade Runner"
                    onClick={() => handleMovieClick('Blade Runner')}
                  />
                </li>
                <li>
                  <img
                    className={`movie aspect-2/3 cursor-pointer w-full rounded-2xl object-cover hover:scale-105 hover:-rotate-3 transition-transform ${
                      selectedMovie === 'Star Wars' ? 'border border-8 border-blue-500' : ''
                    }`}
                    src="/img/movies/starwars.jpeg"
                    alt="Star Wars"
                    onClick={() => handleMovieClick('Star Wars')}
                  />
                </li>
                <li>
                  <img
                    className={`movie aspect-2/3 cursor-pointer w-full rounded-2xl object-cover hover:scale-105 hover:-rotate-3 transition-transform ${
                      selectedMovie === 'Jaws' ? 'border border-8 border-blue-500' : ''
                    }`}
                    src="/img/movies/jaws.jpeg"
                    alt="Jaws"
                    onClick={() => handleMovieClick('Jaws')}
                  />
                </li>
                <li>
                  <img
                    className={`movie aspect-2/3 cursor-pointer w-full rounded-2xl object-cover hover:scale-105 hover:rotate-3 transition-transform ${
                      selectedMovie === 'Jurassic Park' ? 'border border-8 border-blue-500' : ''
                    }`}
                    src="/img/movies/jurassicpark.jpeg"
                    alt="Jurassic Park"
                    onClick={() => handleMovieClick('Jurassic Park')}
                  />
                </li>
              </ul>
            </>
          )}

          {activeTab === 'dropdown' && (
            <>
              <div className="mx-auto max-w-2xl lg:mx-0">
                <p className="mt-6 text-md leading-8 text-gray-600">
                  Pick a location and you will see its info prefilled in the Messaging Widget.<br />
                  Note, you can't change a location via the posters once a conversation has started.
                </p>
              </div>
              <ul role="list" className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                <li>
                  <img
                    className={`location aspect-2/3 cursor-pointer w-full rounded-2xl object-cover hover:scale-105 hover:rotate-3 transition-transform ${
                      selectedLocation === 'endor' ? 'border border-8 border-blue-500' : ''
                    }`}
                    src="/img/locations/endor.png"
                    alt="Endor"
                    onClick={() => handleLocationClick('endor')}
                  />
                </li>
                <li>
                  <img
                    className={`location aspect-2/3 cursor-pointer w-full rounded-2xl object-cover hover:scale-105 hover:-rotate-3 transition-transform ${
                      selectedLocation === 'hoth' ? 'border border-8 border-blue-500' : ''
                    }`}
                    src="/img/locations/planethoth.png"
                    alt="Hoth"
                    onClick={() => handleLocationClick('hoth')}
                  />
                </li>
                <li>
                  <img
                    className={`location aspect-2/3 cursor-pointer w-full rounded-2xl object-cover hover:scale-105 hover:-rotate-3 transition-transform ${
                      selectedLocation === 'tatooine' ? 'border border-8 border-blue-500' : ''
                    }`}
                    src="/img/locations/tatooine.png"
                    alt="Tatooine"
                    onClick={() => handleLocationClick('tatooine')}
                  />
                </li>
              </ul>
            </>
          )}
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
