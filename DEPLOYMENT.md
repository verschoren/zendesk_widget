# Cloudflare Pages Deployment Guide

## Current Setup

Your project is deployed on **Cloudflare Pages** (not Workers), which means:
- ✅ No `wrangler.toml` required for deployment
- ✅ Configuration is done in Cloudflare Dashboard
- ✅ Functions auto-deploy from `/functions` directory
- ✅ Multiple custom domains supported

## Your Custom Domains

### 1. demo.internalnote.com (Main Site)
- **Status:** Active, SSL enabled
- **Purpose:** Main demo website
- **Functions available at:**
  - `https://demo.internalnote.com/api/messaging`
  - `https://demo.internalnote.com/api/guide`
  - `https://demo.internalnote.com/api/chat`
  - `https://demo.internalnote.com/api/sdk`

### 2. jwt.internalnote.com (JWT API Alias)
- **Purpose:** Dedicated domain for JWT authentication
- **Same functions available at:**
  - `https://jwt.internalnote.com/messaging`
  - `https://jwt.internalnote.com/guide`
  - `https://jwt.internalnote.com/chat`
  - `https://jwt.internalnote.com/sdk`

**Note:** Both domains serve the exact same content. The difference is just the URL structure for the API endpoints.

## Cloudflare Dashboard Configuration

### 1. Build Configuration

Go to **Pages project → Settings → Builds & deployments**

```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: /
Node version: 20
```

### 2. Environment Variables

Go to **Pages project → Settings → Environment variables**

Add for **Production** and **Preview**:

```bash
# Messaging SDK
MESSAGING_APP_ID=your_messaging_app_id
MESSAGING_SECRET=your_messaging_secret

# Classic Widget / Guide
GUIDE_SECRET=your_guide_secret

# Chat (if used)
CHAT_SECRET=your_chat_secret

# SDK (if used)
SDK_SECRET=your_sdk_secret

# Answer Bot API
ANSWERBOT_DOMAIN=your_zendesk_subdomain
ANSWERBOT_ADMIN_EMAIL=admin@example.com
ANSWERBOT_API_TOKEN=your_api_token
```

**Where to find Answer Bot credentials:**
1. Go to Zendesk Admin Center
2. Navigate to: Apps and integrations → APIs → Zendesk API
3. Enable Token Access
4. Create an API token
5. Copy the token (this is your `ANSWERBOT_API_TOKEN`)
6. Your admin email is the email associated with your Zendesk account
7. Your domain is the subdomain from your Zendesk URL (e.g., `mycompany` from `mycompany.zendesk.com`)

### 3. Custom Domains

Go to **Pages project → Custom domains**

You should see:
- ✅ demo.internalnote.com (Active)
- ✅ jwt.internalnote.com

If jwt.internalnote.com is not added yet:
1. Click **Set up a custom domain**
2. Enter: `jwt.internalnote.com`
3. Cloudflare will auto-configure DNS (CNAME to your Pages project)

## How Functions Work with Multiple Domains

Both domains serve the same Pages project, so functions work on both:

```bash
# Main domain
curl https://demo.internalnote.com/api/messaging

# JWT domain
curl https://jwt.internalnote.com/messaging

# Both return the same function response
```

## URL Structure Options

You have two options for your JWT domain:

### Option 1: Keep `/api/` prefix (Current)
```
demo.internalnote.com/api/messaging
jwt.internalnote.com/api/messaging
```

### Option 2: Clean URLs for jwt domain (Recommended)
```
demo.internalnote.com/api/messaging
jwt.internalnote.com/messaging  ✨
```

To enable Option 2, update `functions/` directory structure:

```bash
# Current structure
functions/
  api/
    messaging.ts
    guide.ts
    chat.ts
    sdk.ts

# For clean URLs on jwt.internalnote.com, create:
functions/
  api/
    messaging.ts
    guide.ts
    chat.ts
    sdk.ts
  messaging.ts  # Symlink or copy
  guide.ts      # Symlink or copy
  chat.ts       # Symlink or copy
  sdk.ts        # Symlink or copy
```

Or use redirects in `public/_redirects`:
```
https://jwt.internalnote.com/messaging /api/messaging 200
https://jwt.internalnote.com/guide /api/guide 200
https://jwt.internalnote.com/chat /api/chat 200
https://jwt.internalnote.com/sdk /api/sdk 200
```

## Deployment Methods

### Method 1: GitHub Integration (Automatic)
1. Push to main branch
2. Cloudflare automatically builds and deploys
3. Check deployment status in Pages dashboard

### Method 2: Manual via CLI
```bash
# Build locally
npm run build

# Deploy with wrangler
npx wrangler pages deploy dist

# Or use npm script
npm run deploy
```

### Method 3: Direct Upload
1. Build: `npm run build`
2. Go to Pages dashboard → **Deployments** → **Create deployment**
3. Upload `dist` folder

## Testing Deployment

### Quick Test - Verify Endpoints Work

```bash
# Test Messaging
curl -X POST https://demo.internalnote.com/api/messaging \
  -H "Content-Type: application/json" \
  -d '{"external_id":"test","email":"test@example.com","name":"Test User"}'

# Test Guide
curl -X POST https://jwt.internalnote.com/guide \
  -H "Content-Type: application/json" \
  -d '{"external_id":"test","user_email":"test@example.com","user_name":"Test User"}'
```

### Verify JWT Structure (Development Only)

Use the test endpoint to verify JWT tokens are correctly formatted:

```bash
# Test Messaging JWT structure
curl -X POST http://localhost:8788/api/test-jwt \
  -H "Content-Type: application/json" \
  -d '{"type":"messaging"}'

# Test Guide JWT structure
curl -X POST http://localhost:8788/api/test-jwt \
  -H "Content-Type: application/json" \
  -d '{"type":"guide"}'
```

This will return the decoded JWT and verification results showing:
- ✅ All required fields are present
- ✅ No extra fields (for Classic Widget)
- ✅ Correct header structure
- ✅ Valid expiration time (for Messaging)

**See JWT_VERIFICATION.md for detailed JWT format requirements**

## Local Development

### With Functions
```bash
# Create .dev.vars with your credentials
cp .dev.vars.example .dev.vars

# Build and run with functions
npm run dev:functions
```

### Frontend Only
```bash
npm run dev
```

## Troubleshooting

### Functions not working
1. Check environment variables are set in Pages dashboard
2. Verify functions are in `/functions` directory
3. Check function logs in Pages dashboard

### Domain not working
1. Check DNS is properly configured (CNAME to Pages)
2. Wait for SSL certificate (can take a few minutes)
3. Clear browser cache

### Build failures
1. Check Node version is 18+ in Pages settings
2. Verify all dependencies in package.json
3. Check build logs in Pages dashboard

## Migration Notes

### Old Worker URLs (Deprecated)
These old worker URLs should redirect to new endpoints:
- `https://jwt-demo.verschoren.workers.dev/messaging` → `/api/messaging`
- `https://jwt-demo.verschoren.workers.dev/guide` → `/api/guide`
- `https://jwt.verschoren.workers.dev/guide` → `/api/guide`

Redirects are configured in `public/_redirects`

### Can Delete These Directories
After successful deployment:
- `/messaging-worker` - Migrated to `/functions/api/messaging.ts`
- `/classic-worker` - Migrated to `/functions/api/` (guide, chat, sdk)
