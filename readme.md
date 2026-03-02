# Zendesk Widget Demo - React + TypeScript Migration

This project has been migrated from static HTML + jQuery to a modern React + TypeScript SPA with auto-generated navigation.

![Zendesk Widget Demo](https://github.com/verschoren/zendesk_widget/assets/894026/08346076-dce8-4e05-804a-fb3264474acd)

## 🚀 Migration Status

### ✅ Completed
- [x] **Phase 1: Foundation Setup** - Vite, React, TypeScript configured
- [x] **Phase 2: Core Components** - Layout, Sidebar, Navigation components
- [x] **Phase 3: Registry System** - Auto-generation script created
- [x] **Phase 4 (Partial)**: Sample page migrated (Messaging Authentication)

### 🚧 In Progress
- [ ] **Phase 4**: Migrate remaining 29 pages
  - [x] Messaging Authentication (sample)
  - [ ] 8 more Messaging pages
  - [ ] 4 Classic Widget pages
  - [ ] 7 Proactive Messaging pages
  - [ ] 2 Answer Bot & Storage pages
  - [ ] 8 Embed mode pages
- [ ] **Phase 5**: Hono backend setup
- [ ] **Phase 6**: Testing & deployment

## 🛠️ Setup Instructions

### Fix NPM Permissions (Required First)

You have an npm cache permission issue. Run this command to fix it:

```bash
sudo chown -R $(whoami) ~/.npm
```

### Install Dependencies

```bash
npm install
```

### Development

```bash
# Run dev server with hot reload
npm run dev

# Generate page registry (run after adding new pages)
npm run generate-registry

# Build for production
npm run build
```

## 📁 Project Structure

```
zendesk_widget/
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Root component with routing
│   │
│   ├── pages/                   # Page components
│   │   ├── HomePage.tsx         # Landing page
│   │   └── messaging/
│   │       └── Authentication.tsx  # Sample migrated page
│   │
│   ├── components/
│   │   ├── Layout/              # Layout components
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MobileSidebar.tsx
│   │   │   ├── MobileHeader.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   └── Navigation/
│   │       └── NavigationMenu.tsx  # Auto-generated nav
│   │
│   ├── lib/
│   │   ├── pageRegistry.ts      # AUTO-GENERATED page registry
│   │   └── navigation.ts        # Navigation builder
│   │
│   ├── types/
│   │   ├── page.ts              # PageMetadata interface
│   │   └── navigation.ts        # Navigation types
│   │
│   └── styles/
│       └── globals.css          # Tailwind + custom styles
│
├── scripts/
│   └── generate-registry.ts     # Registry generation script
│
├── public/                      # Static assets (copied from docs/)
│   ├── fonts/                   # VanillaSans fonts
│   └── img/                     # Images
│
├── index.html                   # HTML entry point
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
└── package.json
```

## 🎯 How Auto-Generated Navigation Works

### 1. Create a Page

Each page exports metadata for automatic navigation generation:

```typescript
// src/pages/messaging/Authentication.tsx
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'authentication',
  category: 'messaging',
  categoryName: 'Messaging Widget',
  name: 'Authentication',
  icon: '🔐',
  path: '/messaging/authentication',
  title: 'Zendesk Messaging Authentication',
  description: 'Demo page to showcase JWT Authentication'
}

export default function MessagingAuthentication() {
  // Component implementation
  return <div>...</div>
}
```

### 2. Generate Registry

Run the registry generator to scan all pages and create `src/lib/pageRegistry.ts`:

```bash
npm run generate-registry
```

This script:
- Scans all `.tsx` files in `src/pages/`
- Extracts `export const metadata` from each file
- Generates imports and a typed registry
- Creates helper functions for lookups

### 3. Navigation Auto-Updates

The navigation menu automatically builds from the registry:
- Groups pages by category
- Shows/hides based on available pages
- Highlights active page
- Handles external links

**No hardcoded navigation arrays needed!**

## 📝 Adding a New Page

1. Create your page file in the appropriate category folder:
   ```bash
   src/pages/[category]/[PageName].tsx
   ```

2. Export metadata and default component:
   ```typescript
   export const metadata: PageMetadata = { ... }
   export default function PageName() { ... }
   ```

3. Regenerate the registry:
   ```bash
   npm run generate-registry
   ```

4. Done! The page appears in navigation automatically.

## 🔄 Migration Checklist Per Page

When migrating a page from HTML to React:

- [ ] Create `.tsx` file in appropriate category folder
- [ ] Export `metadata` object with all required fields
- [ ] Convert HTML structure to JSX
- [ ] Port jQuery logic to React hooks:
  - `$('#element').click()` → `onClick={handler}`
  - `$.ajax()` → `fetch()` or custom hooks
  - `$('#element').val()` → `useState()` + controlled inputs
- [ ] Implement Zendesk widget loading with `useEffect`
- [ ] Convert inline `<script>` tags to component logic
- [ ] Test authentication flows if applicable
- [ ] Verify responsive layout
- [ ] Test all interactive features

## 🎨 Styling

- **Tailwind CSS v4** with custom theme
- Custom colors: `matcha`, `licorice`, `cactus`, `lime`
- Custom font: Vanilla Sans
- All existing Tailwind config preserved

To rebuild Tailwind (if needed for docs/):
```bash
npx tailwindcss -i ./tailwind/input.css -o ./docs/css/style.css --watch
```

## 🔐 JWT Authentication

**CHECK OUT THE FULL DEMO AND SETUP AT [INTERNALNOTE.COM](https://internalnote.com/jwt-messaging/)**

### Current Setup (Cloudflare Pages Functions)
The project uses Cloudflare Pages Functions (serverless) to generate JWTs for:
- **Zendesk Messaging SDK** → `/api/messaging`
- **Zendesk Guide/Classic Widget** → `/api/guide`
- **Zendesk Chat** → `/api/chat`
- **Zendesk SDK** → `/api/sdk`

Located in: `functions/api/`

### Environment Variables

Set these in Cloudflare Pages Dashboard (Settings → Environment Variables):

**Production & Preview:**
```
MESSAGING_APP_ID=your_messaging_app_id
MESSAGING_SECRET=your_messaging_secret_key
GUIDE_SECRET=your_guide_secret_key
CHAT_SECRET=your_chat_secret_key
SDK_SECRET=your_sdk_secret_key
ANSWERBOT_DOMAIN=your_zendesk_subdomain
ANSWERBOT_ADMIN_EMAIL=admin@example.com
ANSWERBOT_API_TOKEN=your_api_token
```

**Local Development:**
1. Copy `.dev.vars.example` to `.dev.vars`
2. Fill in your credentials
3. Run `npm run dev` (Vite will proxy `/api/*` requests)

### API Endpoints

#### Messaging JWT Endpoint

**URL:** `/api/messaging` or `https://jwtauth.internalnote.com/messaging`

**For:** Zendesk Messaging SDK authentication

**Request:**
```bash
curl -X POST https://demo.internalnote.com/api/messaging \
  -H "Content-Type: application/json" \
  -d '{
    "external_id": "123456",
    "email": "john@example.com",
    "name": "John Appleseed"
  }'
```

**Response:** JWT token (plain text)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Guide JWT Endpoint

**URL:** `/api/guide` or `https://jwtauth.internalnote.com/guide`

**For:** Zendesk Classic Widget / Guide authentication

**Request:**
```bash
curl -X POST https://demo.internalnote.com/api/guide \
  -H "Content-Type: application/json" \
  -d '{
    "external_id": "123456",
    "user_email": "john@example.com",
    "user_name": "John Appleseed"
  }'
```

**Response:** JWT token (plain text)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Chat JWT Endpoint

**URL:** `/api/chat`

**For:** Zendesk Chat authentication

**Request:**
```bash
curl -X POST https://demo.internalnote.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Appleseed",
    "email": "john@example.com",
    "external_id": "123456"
  }'
```

**Response:** JSON with JWT
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### SDK JWT Endpoint

**URL:** `/api/sdk`

**For:** Zendesk SDK authentication

**Request:**
```bash
curl -X POST https://demo.internalnote.com/api/sdk \
  -H "Content-Type: application/json" \
  -d '{
    "user_token": "john@example.com"
  }'
```

**Response:** JSON with JWT
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Answer Bot API Endpoints

**Base URL:** `/api/answerbot/*`

**For:** Zendesk Answer Bot article recommendations, resolutions, and rejections

##### Get Recommendations

**URL:** `/api/answerbot/recommendations`

**Request:**
```bash
curl -X POST https://demo.internalnote.com/api/answerbot/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "enquiry": "How to reset my password?",
    "locale": "en-us",
    "reference": "demo"
  }'
```

**Response:** JSON with articles and interaction token
```json
{
  "articles": [
    {
      "article_id": "123456",
      "title": "How to reset your password",
      "snippet": "To reset your password...",
      "html_url": "https://support.example.com/..."
    }
  ],
  "interaction_access_token": "abc123..."
}
```

##### Mark Article as Resolved

**URL:** `/api/answerbot/resolve`

**Request:**
```bash
curl -X POST https://demo.internalnote.com/api/answerbot/resolve \
  -H "Content-Type: application/json" \
  -d '{
    "article_id": "123456",
    "interaction_access_token": "abc123..."
  }'
```

**Response:** JSON with status code

##### Mark Article as Rejected

**URL:** `/api/answerbot/reject`

**Request:**
```bash
curl -X POST https://demo.internalnote.com/api/answerbot/reject \
  -H "Content-Type: application/json" \
  -d '{
    "article_id": "123456",
    "interaction_access_token": "abc123...",
    "reason_id": 2
  }'
```

**Response:** JSON with status code

### JWT Structure

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT",
  "kid": "your_app_id"
}
```

**Payload:**
```json
{
  "scope": "user",
  "name": "John Appleseed",
  "email": "john@example.com",
  "external_id": "123456",
  "exp": 1234567890,
  "email_verified": true
}
```

### Custom Domain Setup (jwtauth.internalnote.com)

To set up the custom domain in Cloudflare Pages:

1. Go to your Pages project → **Custom domains**
2. Add `jwtauth.internalnote.com` as a custom domain
3. Update your DNS to point to Cloudflare Pages:
   - CNAME `jwtauth` → `your-project.pages.dev`
4. The functions will be available at:
   - `https://jwtauth.internalnote.com/messaging`
   - `https://jwtauth.internalnote.com/guide`

## 🚀 Deployment (Coming Soon)

Will deploy via Hono on Cloudflare Workers:
```bash
npm run deploy
```

Deployment uses [GitHub Action for Wrangler](https://github.com/marketplace/actions/deploy-to-cloudflare-workers-with-wrangler)

## 📚 Key Benefits

### Zero Hardcoded Navigation
- Add page: Create file with metadata → automatic nav entry
- Remove page: Delete file → automatic nav removal
- Update page: Edit metadata → automatic nav update

### Type Safety
- TypeScript enforces metadata structure
- Compile-time errors for missing fields
- IDE autocomplete for page properties

### Developer Experience
- Single-file page definition (component + metadata)
- Hot module replacement in development
- Clear folder organization by category

## 🐛 Troubleshooting

### npm permission errors
```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
npm install
```

### TypeScript errors
```bash
npm run generate-registry
```

### Widget not loading
- Check browser console for errors
- Verify Zendesk snippet key
- Ensure `useEffect` cleanup is working

## 📖 Reference Files

- Original navigation: `docs/js/view.js` (lines 119-264)
- Original homepage: `docs/index.html`
- Sample migrated page: `docs/messaging.html`
- JWT Workers: `messaging-worker/src/worker.js`, `classic-worker/index.js`

## 🎯 Next Steps

1. **Fix npm permissions** (see above) ⚠️
2. Run `npm install`
3. Test dev server: `npm run dev`
4. Continue migrating pages (see migration checklist)
5. Set up Hono backend (Phase 5)
6. Deploy to Cloudflare Workers (Phase 6)

## 📚 References

- [Zendesk Messaging Authentication](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/sdk_api_reference/#authentication)
- [Internal Note Blog](https://internalnote.com)

---

Built with ❤️ by [Internal Note](https://internalnote.com)
