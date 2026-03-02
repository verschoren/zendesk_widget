import { useEffect, useState } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'proactive-contact',
  category: 'proactive',
  categoryName: 'Proactive Messaging',
  name: 'Contact-based',
  icon: '👤',
  path: '/proactive/contact',
  title: 'Proactive Messages Demo',
  description: 'Direct to Agent - VIP vs Regular users'
}

interface User {
  name: string
  email: string
  external_id: string
}

export default function ProactiveContact() {
  const [isVip, setIsVip] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Add Zendesk widget script
    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
    script.async = true
    document.body.appendChild(script)

    // Check hash on load
    const checkHash = () => {
      const hash = window.location.hash
      const vipMode = hash === '#vip'
      setIsVip(vipMode)
      runAuthFlow(vipMode)
    }

    script.onload = checkHash

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash)

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
      window.removeEventListener('hashchange', checkHash)
    }
  }, [])

  const generateRandomString = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  const runAuthFlow = async (vipMode: boolean) => {
    // Logout first
    if (window.zE) {
      window.zE('messenger', 'logoutUser')
    }

    const random = generateRandomString(16)
    let user: User

    if (vipMode) {
      user = {
        name: 'Vito Corleone',
        email: `vito+${random}@corleone.example`,
        external_id: random
      }
    } else {
      user = {
        name: 'Maximus Decimus Meridius',
        email: `maximus+${random}@example.com`,
        external_id: random
      }
    }

    // Login with JWT
    try {
      const response = await fetch('/api/messaging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          external_id: user.external_id,
          user_email: user.email,
          user_name: user.name
        })
      })

      const jwttoken = await response.text()

      if (window.zE) {
        window.zE('messenger', 'loginUser', function (callback: (token: string) => void) {
          callback(jwttoken)
        })

        // Set conversation tags
        window.zE('messenger:set', 'conversationTags', vipMode ? ['vip'] : [])
      }

      // Show notification
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <>
      {showNotification && (
        <div aria-live="assertive" className="logged_in pointer-events-none fixed inset-0 flex items-start px-4 py-4 z-50">
          <div className="flex w-full flex-col items-end space-y-4">
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-gray-300 ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <svg
                      className="h-6 w-6 text-cactus"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm text-licorice">Successfully logged in!</p>
                    <p className="mt-1 text-sm text-licorice">You are now logged in.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div>
              <h1 className="text-3xl text-licorice">{metadata.title}</h1>
              <h2 className="mt-2 text-xl text-licorice">{metadata.description}</h2>
            </div>
            <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <a
                href="https://internalnote.com/proactive-ticketing-for-messaging/?utm_source=widget_demo&campaign=demo"
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

      <div className="text-center mb-32">
        <h1 className="mt-4 text-3xl font-bold text-licorice sm:text-5xl">Direct to Agent</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Logged in VIP Customers go directly to an Agent.
        </p>
        <ul className="max-w-lg mx-auto">
          <li
            className={`mt-6 col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center border border-gray-300 ${
              !isVip ? '' : 'hidden'
            }`}
          >
            <div className="flex flex-1 flex-col p-8">
              <img className="mx-auto h-32 w-32 shrink-0 rounded-full" src="/img/gladiator.png" alt="Maximus" />
              <h3 className="mt-6 text-sm text-licorice">Maximus</h3>
              <dl className="mt-1 flex grow flex-col justify-between">
                <dd className="text-sm text-licorice">Spaniard</dd>
                <dd className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                    Not a VIP
                  </span>
                </dd>
              </dl>
            </div>
          </li>
          <li
            className={`mt-6 col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center border border-gray-300 ${
              isVip ? '' : 'hidden'
            }`}
          >
            <div className="flex flex-1 flex-col p-8">
              <img className="mx-auto h-32 w-32 shrink-0 rounded-full" src="/img/godfather.png" alt="Vito Corleone" />
              <h3 className="mt-6 text-sm text-licorice">Vito Corleone</h3>
              <dl className="mt-1 flex grow flex-col justify-between">
                <dd className="text-sm text-licorice">Godfather</dd>
                <dd className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    VIP
                  </span>
                </dd>
              </dl>
            </div>
          </li>
        </ul>
        <div className="mt-8 flex items-center justify-center gap-x-6">
          <a
            href="/proactive/contact"
            className="rounded-md bg-matcha px-3.5 py-2.5 text-sm font-semibold text-licorice shadow-xs hover:bg-lime"
          >
            Regular User
          </a>
          <a
            href="/proactive/contact#vip"
            className="rounded-md bg-matcha px-3.5 py-2.5 text-sm font-semibold text-licorice shadow-xs hover:bg-lime"
          >
            VIP User <span aria-hidden="true">→</span>
          </a>
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
