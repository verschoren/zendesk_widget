import { useEffect, useRef } from 'react'

/**
 * Hook to apply highlight.js syntax highlighting to code blocks
 * @param dependencies - Array of dependencies that trigger re-highlighting when changed
 */
export function useHighlight(dependencies: any[] = []) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const codeElement = codeRef.current
    if (codeElement && window.hljs) {
      // Remove previous highlighting
      delete codeElement.dataset.highlighted
      // Apply new highlighting
      window.hljs.highlightElement(codeElement)
    }
  }, dependencies)

  return codeRef
}

// Extend window type for highlight.js
declare global {
  interface Window {
    hljs?: {
      highlightElement: (element: HTMLElement) => void
      highlightAll: () => void
    }
  }
}
