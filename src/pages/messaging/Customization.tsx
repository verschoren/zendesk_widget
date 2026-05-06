import { useState, useEffect } from 'react'
import Button from '@/components/Button'
import { PageMetadata } from '@/types/page'
import { useHighlight } from '@/hooks/useHighlight'

export const metadata: PageMetadata = {
  id: 'customization',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Customization',
  icon: '🎨',
  path: '/messaging/customization',
  title: 'Zendesk Widget Theme Customizer',
  description: 'Customize Widget theme and colors'
}

interface ThemeColors {
  primary?: string
  onPrimary?: string
  message?: string
  onMessage?: string
  businessMessage?: string
  onBusinessMessage?: string
  action?: string
  onAction?: string
  background?: string
  onBackground?: string
  error?: string
  onError?: string
  notify?: string
  onNotify?: string
  onSecondaryAction?: string
}

interface WidgetSettings {
  hideHeader?: boolean
  conversationList?: boolean
  messageLog?: boolean
  hideNewConversationButton?: boolean
}

export default function Customization() {
  const [theme, setTheme] = useState<ThemeColors>({})
  const [contentScale, setContentScale] = useState(100)
  const [settings, setSettings] = useState<WidgetSettings>({
    hideHeader: false,
    conversationList: false,
    messageLog: false,
    hideNewConversationButton: false
  })
  const [viewMode, setViewMode] = useState<'configure' | 'code'>('configure')

  // Syntax highlighting for code block
  const codeRef = useHighlight([theme, contentScale, settings, viewMode])

  const PRESETS = {
    red: {
      primary: '#B71C1C',
      onPrimary: '#FFFFFF',
      message: '#FFCDD2',
      onMessage: '#3E0000',
      action: '#D32F2F',
      onAction: '#FFFFFF',
      background: '#FFF3F3',
      onBackground: '#3E0000'
    },
    blue: {
      primary: '#2E7D32',
      onPrimary: '#FFFFFF',
      message: '#C8E6C9',
      onMessage: '#1B5E20',
      action: '#43A047',
      onAction: '#FFFFFF',
      background: '#F1F8F4',
      onBackground: '#1B5E20'
    },
    old: {
      primary: '#0D47A1',
      onPrimary: '#FFFFFF',
      message: '#BBDEFB',
      onMessage: '#002171',
      action: '#1976D2',
      onAction: '#FFFFFF',
      background: '#F3F8FF',
      onBackground: '#002171'
    },
    internalnote: {
      primary: '#006DFF',
      onPrimary: '#FFFFFF',
      message: '#BBDEFB',
      onMessage: '#002171',
      action: '#1976D2',
      onAction: '#FFFFFF',
      background: '#fefaf2',
      onBackground: '#002171'
    }
  }

  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Configure Zendesk messenger
    const zendeskConfig = document.createElement('script')
    zendeskConfig.innerHTML = `
      window.zEMessenger = {
        autorender: false,
      }
    `
    document.head.appendChild(zendeskConfig)

    // Add Zendesk widget script
    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
    script.async = true
    document.body.appendChild(script)

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

    // Wait for Zendesk to load then render embedded widget
    script.onload = () => {
      if (window.zE) {
        window.zE('messenger', 'render', {
          mode: 'embedded',
          widget: {
            targetElement: '#widget',
          }
        })

        // Open messenger widget after rendering
        setTimeout(() => {
          if (window.zE) {
            window.zE('messenger', 'open')
          }
        }, 500)
      }
    }

    // Set default theme on load
    setTheme(PRESETS.old)
    applyTheme(PRESETS.old)

    // Check for URL parameter to open voice channel
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('voice')) {
      setTimeout(() => {
        if (window.zE) {
          window.zE('messenger:open', 'voice', '6c0e70e6ef77d7a711a073f249ab6304')
        }
      }, 1000)
    }

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
      document.head.removeChild(zendeskConfig)
      if (highlightScript.parentNode) {
        highlightScript.remove()
      }
    }
  }, [])

  const applyTheme = (themeColors: ThemeColors) => {
    if (typeof window.zE === 'undefined') return

    const widget = getWidgetState()

    try {
      // HARD RESET — always send false first
      window.zE('messenger:set', 'customization', {
        conversationList: {
          hideHeader: false,
          hideNewConversationButton: false
        },
        messageLog: {
          hideHeader: false
        }
      })

      // APPLY ACTUAL STATE
      window.zE('messenger:set', 'customization', {
        theme: themeColors,
        ...widget
      })
    } catch (e) {
      console.error('Failed to apply messenger config:', e)
    }
  }

  const getWidgetState = () => {
    const widget: any = {}

    if (contentScale !== 100) {
      widget.common = { contentScale }
    }

    if (settings.hideHeader) {
      widget.common = widget.common || {}
      widget.common.hideHeader = true

      if (settings.hideNewConversationButton) {
        widget.conversationList = { hideNewConversationButton: true }
      }
    }

    if (!settings.hideHeader && (settings.conversationList || settings.hideNewConversationButton)) {
      widget.conversationList = {}

      if (settings.conversationList) {
        widget.conversationList.hideHeader = true
      }

      if (settings.hideNewConversationButton) {
        widget.conversationList.hideNewConversationButton = true
      }
    }

    if (!settings.hideHeader && settings.messageLog) {
      widget.messageLog = { hideHeader: true }
    }

    return widget
  }

  const generateCodeOutput = () => {
    const widget = getWidgetState()
    const customization = {
      theme,
      ...widget
    }
    return `zE('messenger:set', 'customization', ${JSON.stringify(customization, null, 2)});`
  }

  const handleThemeChange = (field: keyof ThemeColors, value: string) => {
    const newTheme = { ...theme, [field]: value }
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  const handleSettingChange = (field: keyof WidgetSettings) => {
    const newSettings = { ...settings, [field]: !settings[field] }
    setSettings(newSettings)

    // Sync checkbox state
    if (field === 'hideHeader' && !settings.hideHeader) {
      newSettings.conversationList = false
      newSettings.messageLog = false
    }

    setSettings(newSettings)
    setTimeout(() => applyTheme(theme), 100)
  }

  const handleScaleClick = (scale: number) => {
    setContentScale(scale)
    setTimeout(() => applyTheme(theme), 100)
  }

  const handlePreset = (presetName: keyof typeof PRESETS) => {
    const preset = PRESETS[presetName]
    setTheme(preset)
    applyTheme(preset)
  }

  const handleRandomTheme = () => {
    const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    const randomTheme = {
      primary: randomColor(),
      onPrimary: '#FFFFFF',
      message: randomColor(),
      onMessage: '#000000',
      businessMessage: '#FFFFFF',
      onBusinessMessage: '#000000',
      action: randomColor(),
      onAction: '#FFFFFF',
      background: randomColor(),
      onBackground: '#000000',
      error: '#FF1744',
      onError: '#FFFFFF',
      notify: randomColor(),
      onNotify: '#FFFFFF',
      onSecondaryAction: '#000000'
    }
    setTheme(randomTheme)
    applyTheme(randomTheme)
  }

  const handleReset = () => {
    setTheme(PRESETS.old)
    setSettings({
      hideHeader: false,
      conversationList: false,
      messageLog: false,
      hideNewConversationButton: false
    })
    setContentScale(100)
    applyTheme(PRESETS.old)
  }

  const handleCopyCode = async () => {
    const code = generateCodeOutput()
    try {
      await navigator.clipboard.writeText(code)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <header>
        <div className="py-6 px-4 sm:px-6 md:px-8 mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-licorice dark:text-white">{metadata.title}</h1>
            </div>
            <div className="flex gap-3">
              <Button
                as="a"
                href="https://internalnote.com/custom-widget-themes?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Show article
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="py-6 px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Left column: Form */}
          <div>
            {/* Toggle and Action Buttons */}
            <section className="mb-4">
              <div className="flex justify-between items-center">
                <nav className="isolate flex divide-x divide-gray-200 rounded-lg bg-white dark:bg-licorice border border-gray-200">
                  <button
                    onClick={() => setViewMode('configure')}
                    className={`px-6 py-2 text-sm font-medium rounded-l-lg ${
                      viewMode === 'configure'
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-800'
                    }`}
                  >
                    Configure
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
                      viewMode === 'code'
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-800'
                    }`}
                  >
                    Code
                  </button>
                </nav>
                <div className="flex gap-3">
                  <Button onClick={handleReset} type="button">
                    Reset
                  </Button>
                  <Button onClick={handleCopyCode} type="button">
                    Copy code
                  </Button>
                </div>
              </div>
            </section>

            {/* Configure View */}
            {viewMode === 'configure' && (
              <>
                {/* Theme presets */}
                <section className="mb-4">
                  <h3 className="text-lg font-semibold mb-3 text-licorice dark:text-white">Theme Presets</h3>
                  <div className="grid grid-cols-4 gap-2">
                    <Button onClick={() => handlePreset('red')} type="button">
                      Red theme
                    </Button>
                    <Button onClick={() => handlePreset('blue')} type="button">
                      Green theme
                    </Button>
                    <Button onClick={() => handlePreset('internalnote')} type="button">
                      Blue theme
                    </Button>
                    <button
                      onClick={handleRandomTheme}
                      className="inline-flex items-center justify-center rounded-md border border-purple-600 bg-white dark:bg-licorice px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50"
                      type="button"
                    >
                      Random Theme
                    </button>
                  </div>
                </section>

                {/* Color picker */}
                <section className="mb-4">
                  <h3 className="text-lg font-semibold mb-3 text-licorice dark:text-white">Theme Colors</h3>
                  <form id="theme-form" className="grid gap-3" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-4 gap-2">
                      {['primary', 'onPrimary', 'message', 'onMessage'].map((field) => (
                        <label key={field} className="text-sm text-licorice dark:text-white">
                          {field}
                          <br />
                          <input
                            type="text"
                            value={theme[field as keyof ThemeColors] || ''}
                            onChange={(e) => handleThemeChange(field as keyof ThemeColors, e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-md text-sm text-gray-600"
                            placeholder="#FFFFFF"
                          />
                        </label>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {['businessMessage', 'onBusinessMessage', 'action', 'onAction'].map((field) => (
                        <label key={field} className="text-sm text-licorice dark:text-white">
                          {field}
                          <br />
                          <input
                            type="text"
                            value={theme[field as keyof ThemeColors] || ''}
                            onChange={(e) => handleThemeChange(field as keyof ThemeColors, e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-md text-sm text-gray-600"
                            placeholder="#FFFFFF"
                          />
                        </label>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {['background', 'onBackground', 'error', 'onError'].map((field) => (
                        <label key={field} className="text-sm text-licorice dark:text-white">
                          {field}
                          <br />
                          <input
                            type="text"
                            value={theme[field as keyof ThemeColors] || ''}
                            onChange={(e) => handleThemeChange(field as keyof ThemeColors, e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-md text-sm text-gray-600"
                            placeholder="#FFFFFF"
                          />
                        </label>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {['notify', 'onNotify', 'onSecondaryAction'].map((field) => (
                        <label key={field} className="text-sm text-licorice dark:text-white">
                          {field}
                          <br />
                          <input
                            type="text"
                            value={theme[field as keyof ThemeColors] || ''}
                            onChange={(e) => handleThemeChange(field as keyof ThemeColors, e.target.value)}
                            className="w-full px-2 py-1.5 border rounded-md text-sm text-gray-600"
                            placeholder="#FFFFFF"
                          />
                        </label>
                      ))}
                    </div>
                  </form>
                </section>

                {/* Scale tabs */}
                <section className="mb-4">
                  <h3 className="text-lg font-semibold mb-3 text-licorice dark:text-white">Content Scale</h3>
                  <nav className="isolate flex divide-x divide-gray-200 rounded-lg bg-white dark:bg-licorice border-gray-200 border-1">
                    {[50, 75, 100, 125, 150, 175, 200].map((scale) => (
                      <div
                        key={scale}
                        onClick={() => handleScaleClick(scale)}
                        className={`group relative min-w-0 flex-1 overflow-hidden px-4 py-2 text-center text-sm font-medium cursor-pointer ${
                          contentScale === scale ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                        } ${scale === 50 ? 'rounded-l-lg' : ''} ${scale === 200 ? 'rounded-r-lg' : ''}`}
                      >
                        <span>{scale}%</span>
                        <span
                          className={`absolute inset-x-0 bottom-0 h-0.5 ${
                            contentScale === scale ? 'bg-indigo-500' : 'bg-transparent'
                          }`}
                        />
                      </div>
                    ))}
                  </nav>
                </section>

                {/* Checkboxes */}
                <section className="mb-4">
                  <h3 className="text-lg font-semibold mb-3 text-licorice dark:text-white">Widget Settings</h3>
                  <fieldset className="grid grid-cols-2 space-y-2">
                    <div className="flex gap-3">
                      <input
                        id="hideHeader"
                        type="checkbox"
                        checked={settings.hideHeader}
                        onChange={() => handleSettingChange('hideHeader')}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="hideHeader" className="text-sm font-medium text-licorice dark:text-white">
                        Hide headers everywhere
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <input
                        id="hideNewConversationButton"
                        type="checkbox"
                        checked={settings.hideNewConversationButton}
                        onChange={() => handleSettingChange('hideNewConversationButton')}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="hideNewConversationButton" className="text-sm font-medium text-licorice dark:text-white">
                        Hide new conversation button
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <input
                        id="conversationList"
                        type="checkbox"
                        checked={settings.conversationList}
                        disabled={settings.hideHeader}
                        onChange={() => handleSettingChange('conversationList')}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="conversationList" className="text-sm font-medium text-licorice dark:text-white">
                        Hide header for conversation list
                      </label>
                    </div>
                    <div className="flex gap-3">
                      <input
                        id="messageLog"
                        type="checkbox"
                        checked={settings.messageLog}
                        disabled={settings.hideHeader}
                        onChange={() => handleSettingChange('messageLog')}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="messageLog" className="text-sm font-medium text-licorice dark:text-white">
                        Hide headers for conversation view
                      </label>
                    </div>
                  </fieldset>
                </section>
              </>
            )}

            {/* Code View */}
            {viewMode === 'code' && (
              <section>
                <h2 className="text-xl font-semibold text-licorice dark:text-white mb-3">Generated Code</h2>
                <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm" style={{ backgroundColor: '#282c34', padding: '20px' }}>
                  <code ref={codeRef} className="language-javascript">{generateCodeOutput()}</code>
                </pre>
              </section>
            )}
          </div>

          {/* Right column: Preview */}
          <div>
            <section>
              <div id="widget" className="w-full h-[600px] rounded-xl border-gray-100 overflow-hidden shadow-lg" />
            </section>
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
