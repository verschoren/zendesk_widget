export default function Footer() {
  return (
    <footer className="md:w-[calc(100%_-_288px)] w-full fixed bottom-0 bg-white dark:bg-gray-900">
      <div className="border-t border-gray-900/10 p-4 flex flex-col md:flex-row justify-between w-full items-start md:items-end gap-4 md:gap-0 md:pr-24">
        <div className="min-w-24 w-[calc(100%_-_32px)] md:w-96">
          <h1 className="text-sm font-medium pb-2">Subscribe to Internal Note</h1>
          <script
            src="https://cdn.jsdelivr.net/ghost/signup-form@~0.1/umd/signup-form.min.js"
            data-button-color="#D1F470"
            data-button-text-color="#11110D"
            data-site="https://internalnote.com/"
            async
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
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
