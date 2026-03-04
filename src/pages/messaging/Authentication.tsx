import { useState, useEffect } from 'react'
import Button from '@/components/Button'
import { PageMetadata } from '@/types/page'
import { useZendeskWidget } from '@/hooks/useZendeskWidget'

export const metadata: PageMetadata = {
  id: 'authentication',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Authentication',
  icon: '🔐',
  path: '/messaging/authentication',
  title: 'Zendesk Messaging Authentication',
  description: 'Demo page to showcase JWT Authentication for Zendesk Messaging'
}

interface User {
  name: string
  email: string
  external_id: string
}

export default function MessagingAuthentication() {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    external_id: ''
  })
  const [autoGenerateExternalId, setAutoGenerateExternalId] = useState(true)
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [logoutSuccess, setLogoutSuccess] = useState(false)

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`
  }, [])

  // Use Zendesk widget with proper cleanup
  useZendeskWidget({
    key: 'e125418a-9466-44d8-9b3f-2ac10e911ea4',
    type: 'messaging',
    onLoad: () => {
      if (window.zE) {
        window.zE('messenger', 'render', {
          mode: 'embedded',
          widget: {
            targetElement: '#widget',
          }
        })
      }
    }
  })

  const selectProfile = (profile: 'user' | 'vip') => {
    if (profile === 'user') {
      setUser({
        name: 'Maximus Decimus Meridius',
        email: 'maximus@gladiator.example',
        external_id: autoGenerateExternalId ? btoa('maximus@gladiator.example') : ''
      })
    } else if (profile === 'vip') {
      setUser({
        name: 'Vito Corleone',
        email: 'vito@corleone.example',
        external_id: autoGenerateExternalId ? btoa('vito@corleone.example') : ''
      })
    }
  }

  const handleLogin = async () => {
    try {
      // Build request body - only include external_id if it has a value
      const requestBody: any = {
        email: user.email,
        name: user.name
      }

      if (user.external_id) {
        requestBody.external_id = user.external_id
      }

      const response = await fetch('/api/messaging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const jwttoken = await response.text()

      // Authenticate with Zendesk
      if (window.zE) {
        window.zE('messenger', 'loginUser', function (callback: (token: string) => void) {
          callback(jwttoken)
        })
      }

      setLoginSuccess(true)
      setLogoutSuccess(false)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleLogout = () => {
    if (window.zE) {
      window.zE('messenger', 'logoutUser')
    }
    setUser({ name: '', email: '', external_id: '' })
    setLogoutSuccess(true)
    setLoginSuccess(false)
  }

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:px-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div className="w-2/3">
              <h1 className="text-3xl text-licorice dark:text-white">{metadata.title}</h1>
              <h2 className="mt-2 text-xl text-licorice dark:text-white">{metadata.description}</h2>
            </div>
            <div className="w-1/3 mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <Button as="link" to="/messaging/guide-auth">
                Guide Embed
              </Button>
              <Button
                as="a"
                href="https://internalnote.com/jwt-messaging?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 mb-32">
        <div className="w-full mx-auto">
          <h2 className="text-xl font-medium text-licorice dark:text-white">User Info</h2>
          <p className="mt-1 text-sm text-blue-gray-500">
            Fill in this form to authenticate with one of the examples below or a random user.
          </p>

          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <form className="space-y-8 divide-y divide-y-blue-gray-200">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                  <div className="sm:col-span-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div
                        onClick={() => selectProfile('user')}
                        className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white dark:bg-licorice px-6 py-5 shadow-xs hover:border-cactus hover:bg-lime hover:text-licorice cursor-pointer"
                      >
                        <div className="shrink-0">
                          <img className="h-10 w-10 rounded-full" src="/img/regular.png" alt="" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-licorice dark:text-white">
                            Maximus
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 ml-2">
                              End User
                            </span>
                          </p>
                          <p className="truncate text-sm text-licorice dark:text-white">maximus@gladiator.example</p>
                        </div>
                      </div>

                      <div
                        onClick={() => selectProfile('vip')}
                        className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white dark:bg-licorice px-6 py-5 shadow-xs hover:border-cactus hover:bg-lime cursor-pointer"
                      >
                        <div className="shrink-0">
                          <img className="h-10 w-10 rounded-full" src="/img/godfather.png" alt="" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-licorice dark:text-white">
                            Vito Corleone
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 ml-2">
                              VIP
                            </span>
                          </p>
                          <p className="truncate text-sm text-licorice dark:text-white">vito@corleone.example</p>
                        </div>
                      </div>
                    </div>
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
                      className="mt-1 block w-full border-gray-300 border-1 p-2 rounded-md shadow-xs text-licorice dark:text-white sm:text-sm"
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
                      onChange={(e) => setUser({
                        ...user,
                        email: e.target.value,
                        external_id: autoGenerateExternalId ? btoa(e.target.value) : user.external_id
                      })}
                      className="mt-1 block w-full p-2 border-1 border-gray-300 rounded-md shadow-xs text-licorice dark:text-white sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="external_id" className="block text-sm font-medium text-licorice dark:text-white">
                      External ID
                    </label>
                    <div className="mt-2 flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id="auto-generate-external-id"
                        checked={autoGenerateExternalId}
                        onChange={(e) => {
                          const isChecked = e.target.checked
                          setAutoGenerateExternalId(isChecked)
                          if (isChecked && user.email) {
                            setUser({ ...user, external_id: btoa(user.email) })
                          }
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-cactus focus:ring-cactus"
                      />
                      <label htmlFor="auto-generate-external-id" className="text-sm text-licorice dark:text-white">
                        Auto-generate external ID from email
                      </label>
                    </div>
                    <input
                      type="text"
                      name="external_id"
                      id="external_id"
                      value={user.external_id}
                      readOnly={autoGenerateExternalId}
                      onChange={(e) => setUser({ ...user, external_id: e.target.value })}
                      placeholder={autoGenerateExternalId ? '' : 'Leave empty to test backend user lookup'}
                      className={`mt-1 block w-full border-gray-300 border-1 p-2 rounded-md text-licorice dark:text-white sm:text-sm ${
                        autoGenerateExternalId ? 'bg-gray-50' : 'bg-white dark:bg-licorice'
                      }`}
                    />
                    {!autoGenerateExternalId && (
                      <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                        💡 Leave empty to test backend user lookup. The backend will search for existing users by email and use their external_id if found.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-8">
                  <div className="col-span-6 rounded-md bg-blue-50 p-4 mb-8">
                    <div className="flex">
                      <div className="shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">
                          Zendesk messaging can identify and match existing end-users based on email or external id.
                        </p>
                        <p className="mt-3 text-sm md:ml-6 md:mt-0">
                          <a
                            href="https://internalnote.com/messaging-authentication-identify-and-merge-existing-users?utm_source=demo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap font-medium text-blue-700 dark:text-blue-400 hover:text-licorice dark:hover:text-white"
                          >
                            Details <span aria-hidden="true">&rarr;</span>
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleLogin}
                      className="relative inline-flex items-center gap-x-1.5 rounded-md bg-white dark:bg-licorice px-3 py-2 text-sm font-semibold text-licorice dark:text-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <svg className="-ml-0.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                        <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
                      </svg>
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="bg-red-100 py-2 px-4 border border-red-300 rounded-md shadow-xs text-sm font-medium text-red-900 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </form>

              {loginSuccess && (
                <div className="rounded-md bg-green-50 p-4 mt-8">
                  <div className="flex">
                    <div className="shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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

            <div id="widget" className="w-[400px] h-[500px] border border-gray-300 rounded-md overflow-hidden" />
          </div>
        </div>
      </div>
    </>
  )
}

// Extend window type for Zendesk
declare global {
  interface Window {
    zE?: any
    zEMessenger?: any
  }
}
