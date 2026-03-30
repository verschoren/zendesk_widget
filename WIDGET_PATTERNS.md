# Common Widget Loading Patterns - Before & After

## Pattern 1: Multi-Column Embed (MultiColumn.tsx)

### ❌ Before (Manual - Prone to Issues)
```tsx
const widgetRendered = useRef(false)
const renderTimeout = useRef<number | null>(null)

useEffect(() => {
  // Complex logic checking for existing scripts
  if (widgetRendered.current) return

  const existingScript = document.getElementById('ze-snippet')
  if (existingScript) {
    // Handle already loaded case...
  }

  window.zEMessenger = { autorender: false }
  const script = document.createElement('script')
  script.id = 'ze-snippet'
  script.src = 'https://static.zdassets.com/ekr/snippet.js?key=...'
  document.body.appendChild(script)

  script.onload = () => {
    renderTimeout.current = window.setTimeout(() => {
      const conversationContainer = document.getElementById('widget_conversations')
      const messageContainer = document.getElementById('widget_messages')
      if (conversationContainer && messageContainer &&
          conversationContainer.children.length === 0 &&
          messageContainer.children.length === 0 &&
          !widgetRendered.current) {
        window.zE('messenger', 'render', {
          mode: 'embedded',
          conversationList: { targetElement: '#widget_conversations' },
          messageLog: { targetElement: '#widget_messages' }
        })
        widgetRendered.current = true
      }
    }, 100)
  }

  return () => {
    if (renderTimeout.current) clearTimeout(renderTimeout.current)
    const existing = document.getElementById('ze-snippet')
    if (existing) existing.remove()
  }
}, [])
```

### ✅ After (Clean Hook)
```tsx
useZendeskWidget({
  key: 'e125418a-9466-44d8-9b3f-2ac10e911ea4',
  type: 'messaging',
  render: {
    mode: 'embedded',
    conversationList: { targetElement: '#widget_conversations' },
    messageLog: { targetElement: '#widget_messages' }
  },
  onLoad: () => {
    if (window.zE) {
      window.zE('messenger:set', 'customization', {
        common: { hideHeader: false },
        conversationList: { hideHeader: true },
        messageLog: { hideHeader: true }
      })
    }
  }
})
```

**Benefits:** 90% less code, automatic cleanup, no refs needed, prevents double-loading

---

## Pattern 2: Single Embedded Widget (Contact.tsx)

### ❌ Before
```tsx
useEffect(() => {
  window.zEMessenger = { autorender: false }

  const script = document.createElement('script')
  script.id = 'ze-snippet'
  script.src = 'https://static.zdassets.com/ekr/snippet.js?key=...'
  script.async = true
  document.body.appendChild(script)

  return () => {
    const existing = document.getElementById('ze-snippet')
    if (existing) existing.remove()
  }
}, [])

const handleChat = () => {
  setShowWidget(true)
  setTimeout(() => {
    if (window.zE) {
      window.zE('messenger', 'render', {
        mode: 'embedded',
        widget: { targetElement: '#widget' }
      })
      window.zE('messenger', 'open')
    }
  }, 100)
}
```

### ✅ After
```tsx
const [showWidget, setShowWidget] = useState(false)

useZendeskWidget({
  key: 'e125418a-9466-44d8-9b3f-2ac10e911ea4',
  type: 'messaging',
  render: showWidget ? {
    mode: 'embedded',
    widget: { targetElement: '#widget' }
  } : undefined,
  onLoad: () => {
    if (showWidget && window.zE) {
      window.zE('messenger', 'open')
    }
  }
})

const handleChat = () => setShowWidget(true)
```

---

## Pattern 3: Conditional/Toggle Widget (Intranet.tsx)

### ❌ Before
```tsx
useEffect(() => {
  const script = document.createElement('script')
  script.id = 'ze-snippet'
  script.src = 'https://static.zdassets.com/ekr/snippet.js?key=...'
  document.body.appendChild(script)

  script.onload = () => {
    setTimeout(() => {
      if (window.zE) {
        window.zE('messenger', 'render', {
          mode: 'embedded',
          widget: { targetElement: '#widget_messages' }
        })
      }
    }, 100)
  }

  return () => {
    const existing = document.getElementById('ze-snippet')
    if (existing) existing.remove()
  }
}, [])
```

### ✅ After
```tsx
useZendeskWidget({
  key: 'e125418a-9466-44d8-9b3f-2ac10e911ea4',
  type: 'messaging',
  render: {
    mode: 'embedded',
    widget: { targetElement: '#widget_messages' }
  }
})
```

---

## Pattern 4: Conversational with Two Modes

### Problem
Need to render either messageLog alone OR both conversationList + messageLog

### ✅ Solution
```tsx
const [viewMode, setViewMode] = useState<'search' | 'conversations'>('search')

useZendeskWidget({
  key: 'e125418a-9466-44d8-9b3f-2ac10e911ea4',
  type: 'messaging',
  render: viewMode === 'search' ? {
    mode: 'embedded',
    messageLog: { targetElement: '#widget-messages' }
  } : {
    mode: 'embedded',
    conversationList: { targetElement: '#widget-conversations' },
    messageLog: { targetElement: '#widget-messages' }
  }
})
```

---

## Pattern 5: Overlay/Modal Widget

### ❌ Before
```tsx
const [showOverlay, setShowOverlay] = useState(false)

useEffect(() => {
  const script = document.createElement('script')
  script.id = 'ze-snippet'
  script.src = 'https://static.zdassets.com/ekr/snippet.js?key=...'
  document.body.appendChild(script)

  return () => {
    const existing = document.getElementById('ze-snippet')
    if (existing) existing.remove()
  }
}, [])

const handleOpenWidget = () => {
  setShowOverlay(true)
  setTimeout(() => {
    if (window.zE) {
      window.zE('messenger', 'render', {
        mode: 'embedded',
        widget: { targetElement: '#widget-container' }
      })
    }
  }, 100)
}
```

### ✅ After
```tsx
const [showOverlay, setShowOverlay] = useState(false)

useZendeskWidget({
  key: 'e125418a-9466-44d8-9b3f-2ac10e911ea4',
  type: 'messaging',
  render: showOverlay ? {
    mode: 'embedded',
    widget: { targetElement: '#widget-container' }
  } : undefined
})

const handleOpenWidget = () => setShowOverlay(true)
```

---

## Key Improvements Summary

| Issue | Before | After |
|-------|--------|-------|
| **Code Complexity** | 50-100+ lines | 5-15 lines |
| **Double Loading** | Manual ref tracking | Automatic prevention |
| **Cleanup** | Manual script removal | Automatic complete cleanup |
| **Navigation** | Often breaks | Always works |
| **Render Timing** | Manual setTimeout | Handled automatically |
| **Container Checks** | Manual existence checks | Handled automatically |
| **StrictMode** | Double render issues | Fully compatible |
| **Configuration** | Scattered logic | Single declarative call |

---

## Migration Steps

1. Import the hook: `import { useZendeskWidget } from '@/hooks/useZendeskWidget'`
2. Remove all manual script creation code
3. Remove refs like `widgetRendered`, `renderTimeout`
4. Remove manual cleanup in useEffect return
5. Replace with single `useZendeskWidget` call
6. Test navigation to/from the page

---

## Pages Still Needing Migration

Priority pages with current issues:

1. **Intranet.tsx** - Widget loads twice
2. **Conversational.tsx** - Complex dual-mode logic
3. **HomeScreen.tsx** - Target element not found error
4. **Overlay.tsx** - Manual cleanup issues
5. **Draggable.tsx** - Script management issues

All other pages using manual script loading should also be migrated for consistency.
