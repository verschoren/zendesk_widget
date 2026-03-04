import { useState, useEffect } from 'react'
import Button from '@/components/Button'
import { PageMetadata } from '@/types/page'
import { useHighlight } from '@/hooks/useHighlight'

export const metadata: PageMetadata = {
  id: 'answerbot',
  category: 'answerbot',
  categoryName: 'Answer Bot',
  name: 'Answer Bot API',
  icon: '🤖',
  path: '/utility/answerbot',
  title: 'Answer Bot API Demo',
  description: 'Demo page to showcase the Answer Bot API for Zendesk Guide'
}

interface Article {
  article_id: string
  title: string
  snippet: string
  html_url: string
}

interface AnswerBotResponse {
  articles: Article[]
  interaction_access_token: string
}

export default function AnswerBot() {
  const [searchQuery, setSearchQuery] = useState('How to clean LEGO')
  const [articles, setArticles] = useState<Article[]>([])
  const [interactionToken, setInteractionToken] = useState('')
  const [enquiryCode, setEnquiryCode] = useState('')
  const [returnCode, setReturnCode] = useState('')
  const [resolveCode, setResolveCode] = useState('')
  const [rejectCode, setRejectCode] = useState('')
  const [resolvedArticles, setResolvedArticles] = useState<Set<string>>(new Set())

  // Syntax highlighting for code blocks
  const enquiryCodeRef = useHighlight([enquiryCode])
  const returnCodeRef = useHighlight([returnCode])
  const [rejectedArticles, setRejectedArticles] = useState<Set<string>>(new Set())

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Load highlight.js for syntax highlighting
    const highlightScript = document.createElement('script')
    highlightScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js'
    highlightScript.async = true
    document.body.appendChild(highlightScript)

    highlightScript.onload = () => {
      if (window.hljs) {
        window.hljs.highlightAll()
      }
    }

    return () => {
      if (highlightScript.parentNode) {
        highlightScript.remove()
      }
    }
  }, [])

  const handleSearch = async () => {
    const payload = {
      enquiry: searchQuery,
      locale: 'en-us',
      reference: 'internal-note-demo'
    }

    setEnquiryCode(JSON.stringify(payload, null, 2))

    try {
      const response = await fetch('/api/answerbot/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data: AnswerBotResponse = await response.json()
      setArticles(data.articles)
      setInteractionToken(data.interaction_access_token)
      setReturnCode(JSON.stringify(data, null, 2))
      setResolvedArticles(new Set())
      setRejectedArticles(new Set())
      setResolveCode('')
      setRejectCode('')

      // Trigger highlight.js
      setTimeout(() => {
        if (window.hljs) {
          window.hljs.highlightAll()
        }
      }, 100)
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const handleResolve = async (articleId: string) => {
    const payload = {
      article_id: articleId,
      interaction_access_token: interactionToken
    }

    try {
      await fetch('/api/answerbot/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      setResolvedArticles(new Set([...resolvedArticles, articleId]))
      setResolveCode(`//POST to worker to resolve\n\n${JSON.stringify(payload, null, 2)}`)

      setTimeout(() => {
        if (window.hljs) {
          window.hljs.highlightAll()
        }
      }, 100)
    } catch (error) {
      console.error('Resolve error:', error)
    }
  }

  const handleReject = async (articleId: string) => {
    const payload = {
      article_id: articleId,
      interaction_access_token: interactionToken,
      reason_id: 2
    }

    try {
      await fetch('/api/answerbot/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      setRejectedArticles(new Set([...rejectedArticles, articleId]))
      setRejectCode(`//POST to worker to reject\n\n${JSON.stringify(payload, null, 2)}`)

      setTimeout(() => {
        if (window.hljs) {
          window.hljs.highlightAll()
        }
      }, 100)
    } catch (error) {
      console.error('Reject error:', error)
    }
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
              <Button
                as="a"
                href="https://internalnote.com/answer-bot-api/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more
              </Button>
              <Button
                as="a"
                href="https://support.internalnote.com/hc/en-us/sections/9913338409746-Demo-Section"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Articles
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="h-full mb-32">
        <div className="w-full flex p-4 gap-2">
          <div className="bg-white dark:bg-licorice border-gray-200 border rounded-lg w-1/2">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-licorice dark:text-white">Your search</h3>
              <form className="mt-5" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <div className="w-full sm:max-w-xs">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-licorice dark:text-white shadow-xs ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm"
                  />
                </div>
                <Button type="submit"
                 >
                Get Suggestions
              </Button>
              </form>
            </div>
          </div>
          <div className="w-1/2">
            {enquiryCode && (
              <pre className="rounded-md p-2 text-xs text-blue-400" style={{ backgroundColor: '#282c34' }}>
                <code ref={enquiryCodeRef} className="language-json">{enquiryCode}</code>
              </pre>
            )}
          </div>
        </div>

        <div className="p-4">
          <h2 className="truncate text-base font-medium leading-7 text-slate-900 mb-4">
            {articles.length > 0 ? `Results for: ${searchQuery}` : 'Results'}
          </h2>
          <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li
                key={article.article_id}
                className={`col-span-1 divide-y divide-gray-200 rounded-lg border border-gray-200 ${
                  resolvedArticles.has(article.article_id)
                    ? 'bg-green-100'
                    : rejectedArticles.has(article.article_id)
                    ? 'bg-red-100'
                    : 'bg-white'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 justify-between mb-4">
                    <h3 className="truncate text-sm text-licorice dark:text-white">{article.title}</h3>
                    <a href={article.html_url} target="_blank" rel="noopener noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-gray-600 dark:text-white"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                  <p className="mt-1 text-sm text-licorice dark:text-white h-32 overflow-hidden">{article.snippet}</p>
                </div>
                {!resolvedArticles.has(article.article_id) && !rejectedArticles.has(article.article_id) && (
                  <div>
                    <div className="-mt-px flex divide-x divide-gray-200">
                      <button
                        onClick={() => handleResolve(article.article_id)}
                        className="w-1/2 p-4 flex items-center gap-2 text-sm font-medium hover:bg-green-50 cursor-pointer"
                      >
                        <svg
                          className="h-5 w-5 text-green-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Mark as solved</span>
                      </button>
                      <button
                        onClick={() => handleReject(article.article_id)}
                        className="w-1/2 p-4 flex items-center gap-2 text-sm font-medium hover:bg-red-50 cursor-pointer"
                      >
                        <svg
                          className="h-5 w-5 text-red-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Doesn't help</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {returnCode && (
            <pre className="mt-8 rounded-md p-4 text-xs text-blue-400 w-full overflow-hidden" style={{ backgroundColor: '#282c34' }}>
              <code ref={returnCodeRef} className="language-json">{returnCode}</code>
            </pre>
          )}

          {resolveCode && (
            <pre className="mt-8 rounded-md p-4 text-xs text-blue-400 w-full overflow-hidden" style={{ backgroundColor: '#282c34' }}>
              <code className="language-json">{resolveCode}</code>
            </pre>
          )}

          {rejectCode && (
            <pre className="mt-8 rounded-md p-4 text-xs text-blue-400 w-full overflow-hidden" style={{ backgroundColor: '#282c34' }}>
              <code className="language-json">{rejectCode}</code>
            </pre>
          )}

          <div className="mb-32"></div>
        </div>
      </div>
    </>
  )
}

// Extend window type for highlight.js
declare global {
  interface Window {
    hljs?: any
  }
}
