# Zendesk Widget Cleanup Fix

## Problem

When navigating between pages in the React SPA (Single Page Application), the Zendesk widget doesn't properly unload. This causes issues when:

1. **Messaging → Classic**: The Messaging widget stays loaded, Classic widget fails to load
2. **Classic → Messaging**: The Classic widget stays loaded, Messaging widget conflicts
3. **Different widget keys**: Each page may use different Zendesk accounts

### Why This Happens

React Router doesn't reload the page when navigating - it just swaps components. The old widget:
- Scripts remain in DOM
- Iframes persist
- Global `window.zE`, `window.zESettings`, `window.zEMessenger` stay in memory
- Event listeners continue running

The basic cleanup (`script.remove()`) is insufficient.

## Solution

Created `useZendeskWidget` hook that:
1. ✅ Completely removes old widget before loading new one
2. ✅ Removes all iframes, scripts, and containers
3. ✅ Clears global objects (`window.zE`, `window.zESettings`, etc.)
4. ✅ Adds delay to ensure cleanup completes
5. ✅ Handles both Messaging and Classic widgets

## Files Updated

### ✅ Core Hook
- **`src/hooks/useZendeskWidget.ts`** - New hook for widget lifecycle management

### ✅ Migrated Pages (Examples)
- **`src/pages/messaging/Authentication.tsx`** - Uses Messaging SDK
- **`src/pages/classic/Authentication.tsx`** - Uses Classic Widget

### 🔄 Needs Migration (22 pages)
See "How to Migrate" section below

## How the Hook Works

### Before (Old Pattern)
```typescript
useEffect(() => {
  document.title = `Internal Note - ${metadata.title}`

  // Add Zendesk widget script
  const script = document.createElement('script')
  script.id = 'ze-snippet'
  script.src = 'https://static.zdassets.com/ekr/snippet.js?key=YOUR_KEY'
  script.async = true
  document.body.appendChild(script)

  script.onload = () => {
    if (window.zE) {
      // Widget initialization
    }
  }

  return () => {
    const existing = document.getElementById('ze-snippet')
    if (existing) existing.remove()
  }
}, [])
```

**Problems:**
- ❌ Only removes script tag
- ❌ Doesn't remove iframes
- ❌ Doesn't clear global objects
- ❌ Widget persists across navigation

### After (New Pattern)
```typescript
import { useZendeskWidget } from '@/hooks/useZendeskWidget'

// Set document title separately
useEffect(() => {
  document.title = `Internal Note - ${metadata.title}`
}, [])

// Use widget with proper cleanup
useZendeskWidget({
  key: 'YOUR_KEY',
  type: 'messaging', // or 'classic'
  onLoad: () => {
    if (window.zE) {
      // Widget initialization
    }
  }
})
```

**Benefits:**
- ✅ Comprehensive cleanup
- ✅ Removes all widget artifacts
- ✅ Clears global state
- ✅ Widget properly switches between pages

## How to Migrate Remaining Pages

### Step 1: Add Import

At the top of the file:
```typescript
import { useZendeskWidget } from '@/hooks/useZendeskWidget'
```

### Step 2: Extract Widget Key

Find your current widget key in the `script.src`:
```typescript
// Old code
script.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
//                                                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

### Step 3: Determine Widget Type

- **Messaging**: Uses `zE('messenger')` or `zEMessenger` config
- **Classic**: Uses `zE('webWidget')` or `zESettings` config

### Step 4: Separate Title and Widget

Replace the entire widget-loading `useEffect` with two separate blocks:

```typescript
// Title (keep separate)
useEffect(() => {
  document.title = `Internal Note - ${metadata.title}`
}, [])

// Widget (use hook)
useZendeskWidget({
  key: 'YOUR_KEY_HERE',
  type: 'messaging', // or 'classic'
  onLoad: () => {
    // Move any script.onload code here
    if (window.zE) {
      window.zE('messenger', 'render', {
        // ... your config
      })
    }
  }
})
```

### Step 5: Test

Navigate between pages to ensure widgets switch correctly.

## Migration Checklist

### ✅ Done (2/24)
- [x] `/messaging/authentication`
- [x] `/classic/authentication`

### 🔄 To Do (22 pages)

**Messaging Pages:**
- [ ] `/messaging/agent-availability`
- [ ] `/messaging/custom-launcher`
- [ ] `/messaging/customization`
- [ ] `/messaging/guide-auth`
- [ ] `/messaging/metadata`
- [ ] `/messaging/no-bot`
- [ ] `/messaging/voice`

**Classic Pages:**
- [ ] `/classic/customization`
- [ ] `/classic/guide-custom`

**Proactive Pages:**
- [ ] `/proactive/basic`
- [ ] `/proactive/contact`
- [ ] `/proactive/french`
- [ ] `/proactive/product`
- [ ] `/proactive/spanish`

**Embed Pages:**
- [ ] `/embed/contact`
- [ ] `/embed/draggable`
- [ ] `/embed/homescreen`
- [ ] `/embed/intranet`
- [ ] `/embed/multicolumn`
- [ ] `/embed/overlay`

**Utility Pages:**
- [ ] `/utility/storage-limits`

**Other:**
- [ ] `HomePage.tsx` (if needed)

## Example Migration

### Before: messaging/Voice.tsx
```typescript
useEffect(() => {
  document.title = `Internal Note - ${metadata.title}`

  const script = document.createElement('script')
  script.id = 'ze-snippet'
  script.src = 'https://static.zdassets.com/ekr/snippet.js?key=e125418a-9466-44d8-9b3f-2ac10e911ea4'
  script.async = true
  document.body.appendChild(script)

  return () => {
    const existing = document.getElementById('ze-snippet')
    if (existing) existing.remove()
  }
}, [])
```

### After: messaging/Voice.tsx
```typescript
import { useZendeskWidget } from '@/hooks/useZendeskWidget'

// ... in component

useEffect(() => {
  document.title = `Internal Note - ${metadata.title}`
}, [])

useZendeskWidget({
  key: 'e125418a-9466-44d8-9b3f-2ac10e911ea4',
  type: 'messaging'
})
```

## Testing the Fix

### Manual Test
1. Visit `/messaging/authentication`
2. Observe the Messaging widget loads
3. Navigate to `/classic/authentication`
4. ✅ **Expected**: Classic widget loads, Messaging widget is completely removed
5. Navigate back to `/messaging/authentication`
6. ✅ **Expected**: Messaging widget loads fresh, Classic widget is completely removed

### What to Look For
- ✅ No duplicate widgets
- ✅ No console errors
- ✅ Widget switches instantly
- ✅ No visual artifacts (leftover iframes)
- ✅ Each page shows correct widget type

### Browser DevTools Check
Open Chrome DevTools → Elements and check:
- No multiple `<script src="*zdassets*">` tags
- No orphaned iframes with `id*="launcher"` or `id*="webWidget"`
- `window.zE` exists and is the correct version

## Advanced: Pages with Special Config

Some pages have special widget configuration. Example:

### Embedded Widgets
```typescript
useZendeskWidget({
  key: 'YOUR_KEY',
  type: 'messaging',
  onLoad: () => {
    if (window.zE) {
      window.zE('messenger', 'render', {
        mode: 'embedded',
        widget: {
          targetElement: '#widget'
        }
      })
    }
  }
})
```

### Config Scripts
If the page has a config script (like `window.zEMessenger = {...}`), the hook handles it automatically for Messaging widgets. For custom configs, keep them in the component and let the hook clean them up.

## Troubleshooting

### Widget still not switching?
- Check browser console for errors
- Verify the widget key is correct
- Ensure `type` matches the widget (messaging vs classic)
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### TypeScript errors?
```bash
npm run generate-registry
```

### Multiple widgets showing?
- The hook should prevent this
- Check if page is using old cleanup pattern
- Clear browser cache and test again

## Performance Impact

The 100ms delay in widget loading is intentional and negligible:
- Ensures complete cleanup
- Prevents race conditions
- Smooth transition between pages
- Better than widget conflicts!

## Future Improvements

- [ ] Add loading state to hook
- [ ] Add error handling callback
- [ ] Support dynamic widget key switching
- [ ] Add TypeScript types for zE methods
- [ ] Create widget manager context for global state

---

**Status:** ✅ Hook created, 2/24 pages migrated
**Priority:** High - Affects core user experience
**Effort:** Low - Simple find & replace pattern per page
