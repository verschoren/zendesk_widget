import { useState, useEffect } from 'react'
import { PageMetadata } from '@/types/page'
import { useZendeskWidget } from '@/hooks/useZendeskWidget'

export const metadata: PageMetadata = {
  id: 'classic-authentication',
  category: 'classic',
  categoryName: 'Classic Widget',
  name: 'Authentication',
  icon: '🔐',
  path: '/classic/authentication',
  title: 'Classic Zendesk Widget Authentication',
  description: 'Demo page to showcase the JWT Authentication for the Classic Web Widget'
}

interface User {
  name: string
  email: string
  external_id: string
}

export default function ClassicAuthentication() {
  const [user, setUser] = useState<User>({
    name: 'John Smith',
    email: 'john@example.com',
    external_id: ''
  })
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [logoutSuccess, setLogoutSuccess] = useState(false)

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`
  }, [])

  // Use Zendesk widget with proper cleanup
  useZendeskWidget({
    key: '0a2feffd-e8f6-4772-96bf-2e1ae82842a9',
    type: 'classic'
  })

  const generateUUID = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }

  const handleLogin = async () => {
    const externalId = generateUUID()
    const updatedUser = { ...user, external_id: externalId }
    setUser(updatedUser)

    setLogoutSuccess(false)

    try {
      const response = await fetch('/api/guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          external_id: externalId,
          user_email: updatedUser.email,
          user_name: updatedUser.name
        })
      })

      const jwttoken = await response.text()

      if (window.zE) {
        // Prefill Forms and Chat
        window.zE('webWidget', 'identify', {
          name: updatedUser.name,
          email: updatedUser.email,
        })

        window.zE('webWidget', 'prefill', {
          name: {
            value: updatedUser.name,
            readOnly: true
          },
          email: {
            value: updatedUser.email,
            readOnly: true
          }
        })

        // Authenticate
        window.zESettings = {
          webWidget: {
            authenticate: {
              jwtFn: function (callback: (token: string) => void) {
                callback(jwttoken)
              }
            }
          }
        }
      }

      setLoginSuccess(true)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleLogout = () => {
    if (window.zE) {
      window.zE(function () {
        window.zE.logout()
      })

      window.zE('webWidget', 'prefill', {
        name: {
          value: '',
          readOnly: false
        },
        email: {
          value: '',
          readOnly: false
        }
      })
    }

    setLogoutSuccess(true)
    setLoginSuccess(false)
  }

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div className="w-1/2">
              <h1 className="text-3xl text-licorice dark:text-white">{metadata.title}</h1>
              <h2 className="mt-2 text-xl text-licorice dark:text-white">{metadata.description}</h2>
            </div>
            <div className="w-1/2 justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <a
                href="/classic/guide-custom"
                className="inline-flex items-center justify-center rounded-md border bg-matcha px-4 py-2 text-sm text-licorice dark:text-white"
              >
                Guide Embed
              </a>
              <a
                href="https://internalnote.com/classic-web-widget-authentication?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-matcha px-4 py-2 text-sm text-licorice dark:text-white shadow-xs"
              >
                Read more
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-32">
          <form className="mt-6 space-y-8 divide-y divide-y-blue-gray-200">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
              <div className="sm:col-span-6">
                <h2 className="text-xl font-medium text-licorice dark:text-white">User Info</h2>
                <p className="mt-1 text-sm text-blue-gray-500">
                  Fill in this form to authenticate with a random user.
                </p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-licorice dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="px-3 py-1.5 border-gray-300 border block w-full rounded-md shadow-xs text-licorice dark:text-white sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-licorice dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="px-3 py-1.5 border-gray-300 border mt-1 block w-full rounded-md shadow-xs text-licorice dark:text-white sm:text-sm"
                />
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="external_id" className="block text-sm font-medium text-licorice dark:text-white">
                  External ID
                </label>
                <div className="mt-1 flex rounded-md">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-blue-gray-300 bg-blue-gray-50 text-blue-gray-500 sm:text-sm">
                    UUID
                  </span>
                  <input
                    type="text"
                    readOnly
                    name="external_id"
                    id="external_id"
                    value={user.external_id}
                    className="px-3 py-1.5 border-gray-300 border flex-1 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <button
                type="button"
                onClick={handleLogout}
                className="bg-white dark:bg-licorice py-2 px-4 border border-gray-300 rounded-md shadow-xs text-sm font-medium text-licorice dark:text-white hover:bg-blue-gray-50"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={handleLogin}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-xs text-sm font-medium rounded-md text-licorice dark:text-white bg-matcha"
              >
                Login
              </button>
            </div>
          </form>

          {loginSuccess && (
            <div className="rounded-md bg-green-50 p-4 mt-8">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">User logged in</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>We've successfully logged in and authenticated your user.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {logoutSuccess && (
            <div className="rounded-md bg-red-50 p-4 mt-8">
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">User logged out</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>We've successfully logged out.</p>
                  </div>
                </div>
              </div>
            </div>
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
    zESettings?: any
  }
}
