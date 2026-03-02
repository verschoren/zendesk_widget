import { useEffect, useRef } from 'react'

interface ZendeskWidgetOptions {
  key: string
  type: 'messaging' | 'classic'
  onLoad?: () => void
}

/**
 * Hook to manage Zendesk Widget lifecycle in a React SPA
 *
 * This hook ensures proper cleanup when navigating between pages with different widgets.
 * It completely removes the previous widget before loading a new one.
 *
 * @param options - Widget configuration
 * @param deps - Dependencies array (optional)
 */
export function useZendeskWidget(
  options: ZendeskWidgetOptions,
  deps: React.DependencyList = []
) {
  const { key, type, onLoad } = options
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Clean up any existing widget first
    cleanupZendeskWidget()

    // Small delay to ensure cleanup completes
    const setupTimer = setTimeout(() => {
      loadZendeskWidget(key, type, onLoad)

      // Store cleanup function for this widget instance
      cleanupRef.current = () => cleanupZendeskWidget()
    }, 100)

    return () => {
      clearTimeout(setupTimer)
      cleanupZendeskWidget()
      cleanupRef.current = null
    }
  }, [key, type, ...deps])
}

/**
 * Completely removes Zendesk Widget from the page
 * Removes scripts, iframes, global objects, and event listeners
 */
function cleanupZendeskWidget() {
  // 1. Hide the widget if possible
  try {
    if (window.zE) {
      // For Messaging SDK
      if (typeof window.zE === 'function') {
        window.zE('messenger', 'close')
        window.zE('messenger:on', 'close', () => {})
      }
      // For Classic Widget
      window.zE('webWidget', 'hide')
      window.zE('webWidget', 'close')
    }
  } catch (e) {
    // Ignore errors during cleanup
  }

  // 2. Remove all Zendesk-related scripts
  const scripts = document.querySelectorAll('script[src*="zdassets.com"], script[src*="zendesk.com"], script#ze-snippet')
  scripts.forEach(script => script.remove())

  // 3. Remove all Zendesk-related iframes
  const iframes = document.querySelectorAll(
    'iframe[id*="launcher"], iframe[id*="webWidget"], iframe[title*="Messaging"], iframe[title*="Button"], iframe[src*="zendesk"], iframe[src*="zdassets"]'
  )
  iframes.forEach(iframe => iframe.remove())

  // 4. Remove Zendesk containers
  const containers = document.querySelectorAll(
    '[id*="webWidget"], [id*="launcher"], [id*="Embed"], [class*="zEWidget"]'
  )
  containers.forEach(container => {
    // Only remove if it's a Zendesk-created element (not user content)
    if (container.id.includes('zendesk') || container.id.includes('webWidget') || container.id.includes('launcher')) {
      container.remove()
    }
  })

  // 5. Clear global Zendesk objects
  if (window.zE) {
    delete window.zE
  }
  if (window.zESettings) {
    delete window.zESettings
  }
  if (window.zEMessenger) {
    delete window.zEMessenger
  }

  // 6. Remove inline config scripts
  const configScripts = document.querySelectorAll('script:not([src])')
  configScripts.forEach(script => {
    const content = script.textContent || ''
    if (content.includes('zE') || content.includes('zESettings') || content.includes('zEMessenger')) {
      script.remove()
    }
  })

  // 7. Clear any remaining Zendesk artifacts from body
  const zendeskElements = document.body.querySelectorAll('[id^="ze-"], [class^="ze-"], [data-product="web_widget"]')
  zendeskElements.forEach(el => el.remove())
}

/**
 * Loads Zendesk Widget
 */
function loadZendeskWidget(key: string, type: 'messaging' | 'classic', onLoad?: () => void) {
  // Add widget configuration if needed
  if (type === 'messaging') {
    const configScript = document.createElement('script')
    configScript.innerHTML = `
      window.zEMessenger = window.zEMessenger || {};
      window.zEMessenger.autorender = false;
    `
    document.head.appendChild(configScript)
  }

  // Load Zendesk snippet
  const script = document.createElement('script')
  script.id = 'ze-snippet'
  script.src = `https://static.zdassets.com/ekr/snippet.js?key=${key}`
  script.async = true

  if (onLoad) {
    script.onload = () => {
      // Wait a bit for zE to be available
      const checkZE = setInterval(() => {
        if (window.zE) {
          clearInterval(checkZE)
          onLoad()
        }
      }, 50)

      // Timeout after 5 seconds
      setTimeout(() => clearInterval(checkZE), 5000)
    }
  }

  document.body.appendChild(script)
}

// Extend window type
declare global {
  interface Window {
    zE?: any
    zESettings?: any
    zEMessenger?: any
  }
}
