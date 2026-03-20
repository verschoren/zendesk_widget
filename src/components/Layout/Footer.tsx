import { useEffect } from 'react'

export default function Footer() {
  useEffect(() => {
    // Load Ghost signup form script - must be appended to the container where it should render
    const ghostContainer = document.getElementById('ghost-signup-form')
    if (ghostContainer) {
      const ghostScript = document.createElement('script')
      ghostScript.src = 'https://cdn.jsdelivr.net/ghost/signup-form@~0.1/umd/signup-form.min.js'
      ghostScript.setAttribute('data-button-color', '#D1F470')
      ghostScript.setAttribute('data-button-text-color', '#11110D')
      ghostScript.setAttribute('data-site', 'https://internalnote.com/')
      ghostScript.async = true
      ghostContainer.appendChild(ghostScript)
    }

    return () => {
      // Clean up Ghost script
      const ghostScripts = document.querySelectorAll('script[src*="ghost/signup-form"]')
      ghostScripts.forEach(script => script.remove())

      // Clean up Ghost form elements
      const ghostForms = document.querySelectorAll('[data-ghost-form]')
      ghostForms.forEach(form => form.remove())
    }
  }, [])

  return (
    <footer className="md:hidden w-full fixed bottom-0 bg-white dark:bg-licorice">
      <div className="border-t border-gray-900/10 p-4 flex flex-col justify-between w-full items-start gap-4">
        <div className="min-w-24 w-[calc(100%_-_32px)]" id="ghost-signup-form">
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs leading-5 text-licorice dark:text-white">
            &copy; 2022–2026{' '}
            <a
              className="text-blue-400 hover:text-underline hover:text-blue-700"
              href="https://internalnote.com?utm_source=demo_page"
            >
              Internal Note
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
