# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zendesk Widget Demo - A React + TypeScript SPA showcasing Zendesk widget integrations with JWT authentication. Built with Vite, deployed to Cloudflare Workers. The project features an **auto-generated page registry system** where navigation is built dynamically from page metadata.

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Generate page registry (REQUIRED after adding/modifying pages)
npm run generate-registry

# Build for production
npm run build

# Build and deploy to Cloudflare Workers
npm run deploy
```

## Architecture

### Auto-Generated Page Registry System

The core architecture pattern is a **metadata-driven registry** that eliminates hardcoded navigation:

1. **Page Files** (`src/pages/**/*.tsx`): Each page exports a `metadata` object and default component
2. **Registry Generator** (`scripts/generate-registry.ts`): Scans pages, extracts metadata, generates `src/lib/pageRegistry.ts`
3. **Navigation Builder** (`src/lib/navigation.ts`): Builds navigation menu from registry
4. **Layout Components**: Sidebar and navigation consume the registry

**Critical workflow**: After adding, removing, or modifying ANY page metadata, you MUST run `npm run generate-registry`. The build process runs this automatically, but dev mode does not.

### Page Structure

Every page follows this pattern:

```typescript
// src/pages/[category]/[PageName].tsx
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'unique-id',              // Unique identifier
  category: 'messaging',         // Category slug (folder name)
  categoryName: 'Messaging Widget', // Display name
  name: 'Page Name',             // Page display name
  icon: '🔐',                    // Emoji icon
  path: '/category/page-name',   // Route path
  title: 'SEO Title',            // Page title
  description: 'Description'     // SEO description
}

export default function PageName() {
  return <div>...</div>
}
```

### Zendesk Widget Integration Pattern

Pages that integrate Zendesk widgets follow this pattern:

1. **Widget Configuration**: Set `window.zEMessenger` config before loading script
2. **Script Loading**: Add Zendesk snippet to DOM in `useEffect`
3. **Cleanup**: Remove script in cleanup function to prevent duplicates
4. **Global Types**: Extend `Window` interface for `zE` and `zEMessenger`

See `src/pages/messaging/Authentication.tsx` for reference implementation.

### JWT Authentication

The project uses JWT authentication for Zendesk widgets:

- **Current Setup**: External API at `https://jwtauth.internalnote.com/messaging`
- **Planned Migration**: Move to Hono backend routes (Phase 5)
- **Worker Code**: `messaging-worker/src/worker.js` and `classic-worker/index.js` contain JWT generation logic

Authentication flow:
1. User submits profile (name, email, external_id)
2. Frontend calls JWT endpoint with user data
3. Backend generates signed JWT with user claims
4. Frontend calls `window.zE('messenger', 'loginUser', callback)` with JWT

## Key Files and Patterns

### Registry Generation Flow

```
src/pages/**/*.tsx                    # Page files with metadata
       ↓
scripts/generate-registry.ts          # Scans and extracts metadata
       ↓
src/lib/pageRegistry.ts               # AUTO-GENERATED registry
       ↓
src/lib/navigation.ts                 # Builds navigation structure
       ↓
src/components/Navigation/            # Renders navigation UI
```

**Never manually edit** `src/lib/pageRegistry.ts` - it is auto-generated.

### TypeScript Path Alias

Vite is configured with `@` alias pointing to `src/`:

```typescript
import { PageMetadata } from '@/types/page'
import { buildNavigation } from '@/lib/navigation'
```

### Tailwind CSS Setup

- Tailwind v4 with custom plugins (`@tailwindcss/forms`, `@tailwindcss/typography`)
- Custom colors: `matcha`, `licorice`, `cactus`, `lime`
- Custom font: Vanilla Sans (in `public/fonts/`)
- Global styles: `src/styles/globals.css`

## Adding New Pages

1. Create page file in category folder: `src/pages/[category]/PageName.tsx`
2. Export `metadata` object with all required fields
3. Export default component
4. Run `npm run generate-registry`
5. Page appears in navigation automatically

**Do not** manually update routing or navigation - the registry system handles this.

## Migration Status

This project is mid-migration from static HTML + jQuery to React + TypeScript:

- ✅ Foundation, components, registry system complete
- ✅ Sample page migrated (Messaging Authentication)
- 🚧 29 pages remaining to migrate from `docs/` folder
- 🚧 Hono backend for JWT (replacing separate workers)
- 🚧 Deployment configuration

When migrating pages:
- Convert jQuery DOM manipulation to React hooks
- Convert `$.ajax()` to `fetch()` or custom hooks
- Use controlled inputs with `useState()` instead of direct DOM access
- Implement Zendesk widget loading pattern (see Authentication.tsx)

## Deployment

Currently configured for Cloudflare Workers via `npm run deploy`. Uses Wrangler for deployment. See `package.json` and worker directories for configuration.
