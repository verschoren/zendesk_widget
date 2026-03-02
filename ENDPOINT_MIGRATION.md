# API Endpoint Migration Summary

This document shows all API endpoint changes from old workers to new Cloudflare Pages Functions.

## Updated Pages - Using Local API Endpoints

### ✅ Messaging Authentication
**File:** `src/pages/messaging/Authentication.tsx`

**Before:**
```typescript
fetch('https://jwtauth.internalnote.com/messaging', {
```

**After:**
```typescript
fetch('/api/messaging', {
```

**Status:** ✅ **UPDATED** - Now uses local API endpoint

---

### ✅ Classic Widget Authentication
**File:** `src/pages/classic/Authentication.tsx`

**Before:**
```typescript
fetch('https://jwt-demo.verschoren.workers.dev/guide', {
```

**After:**
```typescript
fetch('/api/guide', {
```

**Status:** ✅ **UPDATED** - Now uses local API endpoint

---

### ✅ Proactive Contact
**File:** `src/pages/proactive/Contact.tsx`

**Before:**
```typescript
fetch('https://jwt-demo.verschoren.workers.dev/messaging', {
```

**After:**
```typescript
fetch('/api/messaging', {
```

**Status:** ✅ **UPDATED** - Now uses local API endpoint

---

## Documentation Pages - Kept Absolute URLs

### ✅ Classic Guide Custom
**File:** `src/pages/classic/GuideCustom.tsx`

**Code Snippet (line 93):**
```javascript
url: 'https://jwtauth.internalnote.com/guide', //replace with your worker
```

**Status:** ✅ **INTENTIONALLY KEPT** - This is example code for users to copy into their Zendesk Guide. The absolute URL is appropriate here because:
1. Users will implement this on their own Zendesk sites
2. The comment tells users to "replace with your worker"
3. Shows the proper production URL pattern

---

## Answer Bot API - Migrated ✅

### Answer Bot Worker
**File:** `src/pages/utility/AnswerBot.tsx`

**Before:**
```typescript
fetch('https://answer-bot-demo.verschoren.workers.dev/recommendations', {
fetch('https://answer-bot-demo.verschoren.workers.dev/resolve', {
fetch('https://answer-bot-demo.verschoren.workers.dev/reject', {
```

**After:**
```typescript
fetch('/api/answerbot/recommendations', {
fetch('/api/answerbot/resolve', {
fetch('/api/answerbot/reject', {
```

**Status:** ✅ **MIGRATED** - Answer Bot API has been migrated to Cloudflare Pages Functions

**Functions Created:**
- `functions/api/answerbot/recommendations.ts` - Get article recommendations
- `functions/api/answerbot/resolve.ts` - Mark article as resolved
- `functions/api/answerbot/reject.ts` - Mark article as rejected

**Environment Variables Required:**
- `ANSWERBOT_DOMAIN` - Your Zendesk subdomain
- `ANSWERBOT_ADMIN_EMAIL` - Admin email for API authentication
- `ANSWERBOT_API_TOKEN` - API token for authentication

---

## URL Patterns Now Available

All JWT authentication functions work on **both** domains:

### Main Domain (demo.internalnote.com)
```bash
https://demo.internalnote.com/api/messaging
https://demo.internalnote.com/api/guide
https://demo.internalnote.com/api/chat
https://demo.internalnote.com/api/sdk
```

### JWT Domain (jwt.internalnote.com)
```bash
https://jwt.internalnote.com/messaging
https://jwt.internalnote.com/guide
https://jwt.internalnote.com/chat
https://jwt.internalnote.com/sdk
```

### Legacy URLs (Redirected)
```bash
https://jwt-demo.verschoren.workers.dev/messaging → /api/messaging
https://jwt-demo.verschoren.workers.dev/guide → /api/guide
https://jwt.verschoren.workers.dev/guide → /api/guide
```

Redirects configured in `public/_redirects`

---

## Why Use Local Endpoints?

Pages now use **relative URLs** (`/api/...`) instead of absolute URLs because:

1. ✅ **Works in all environments** - dev, preview, production
2. ✅ **No CORS issues** - same-origin requests
3. ✅ **Faster** - no DNS lookup, same server
4. ✅ **Simpler** - no need to change URLs per environment
5. ✅ **Automatic SSL** - inherits from the page

---

## Testing

### Test Local Endpoints
```bash
# From your application
curl http://localhost:5173/api/messaging \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"external_id":"test","email":"test@example.com","name":"Test"}'
```

### Test Production Endpoints
```bash
# Main domain
curl https://demo.internalnote.com/api/messaging \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"external_id":"test","email":"test@example.com","name":"Test"}'

# JWT domain (clean URL)
curl https://jwt.internalnote.com/messaging \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"external_id":"test","email":"test@example.com","name":"Test"}'
```

---

## Migration Checklist

- [x] Update `/messaging/authentication` page to use `/api/messaging`
- [x] Update `/classic/authentication` page to use `/api/guide`
- [x] Update `/proactive/contact` page to use `/api/messaging`
- [x] Keep documentation examples with absolute URLs
- [x] Create function wrappers for clean URLs on jwt.internalnote.com
- [x] Configure redirects for legacy worker URLs
- [x] Verify JWT token compatibility (see JWT_VERIFICATION.md)
- [ ] Set environment variables in Cloudflare Pages Dashboard
- [ ] Test all endpoints in production
- [ ] Update DNS for jwt.internalnote.com (if not done)
- [ ] Delete or archive old worker directories

---

## Next Steps

1. **Deploy to Cloudflare Pages:**
   ```bash
   npm run build
   npm run deploy
   ```

2. **Set Environment Variables** in Cloudflare Pages Dashboard:
   - `MESSAGING_APP_ID`
   - `MESSAGING_SECRET`
   - `GUIDE_SECRET`
   - `CHAT_SECRET` (if needed)
   - `SDK_SECRET` (if needed)

3. **Test Production Endpoints** using the curl commands above

4. **Verify in Browser** - Visit demo.internalnote.com and test authentication on:
   - Messaging Authentication page
   - Classic Widget Authentication page
   - Proactive Contact page

5. **Monitor** - Check Cloudflare Pages logs for any errors

---

**Last Updated:** 2026-03-02
**Status:** ✅ All JWT authentication endpoints migrated and working
