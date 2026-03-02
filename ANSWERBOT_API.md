# Answer Bot API Migration

This document covers the migration of the Answer Bot worker to Cloudflare Pages Functions.

## Overview

The Answer Bot API provides three endpoints for interacting with Zendesk Answer Bot:
1. **Recommendations** - Get article suggestions based on user enquiry
2. **Resolve** - Mark an article as helpful/resolved
3. **Reject** - Mark an article as not helpful

## Migration Summary

### Before (Standalone Worker)
**Location:** `workers/answerbot.js`
**Endpoints:**
- `https://answer-bot-demo.verschoren.workers.dev/recommendations`
- `https://answer-bot-demo.verschoren.workers.dev/resolve`
- `https://answer-bot-demo.verschoren.workers.dev/reject`

**Issues:**
- Hardcoded subdomain
- Hardcoded Basic auth token
- Separate deployment needed

### After (Pages Functions)
**Location:** `functions/api/answerbot/`
**Endpoints:**
- `https://demo.internalnote.com/api/answerbot/recommendations`
- `https://demo.internalnote.com/api/answerbot/resolve`
- `https://demo.internalnote.com/api/answerbot/reject`

**Benefits:**
- ✅ Environment variables for credentials
- ✅ Integrated with main deployment
- ✅ Better error handling
- ✅ TypeScript types
- ✅ Proper CORS headers

## Environment Variables

Set these in **Cloudflare Pages Dashboard → Settings → Environment variables**:

### Production & Preview

```bash
ANSWERBOT_DOMAIN=your_zendesk_subdomain
ANSWERBOT_ADMIN_EMAIL=admin@example.com
ANSWERBOT_API_TOKEN=your_api_token_here
```

### How to Get Credentials

#### 1. Find Your Zendesk Domain
Your domain is the subdomain from your Zendesk URL:
- URL: `mycompany.zendesk.com`
- Domain: `mycompany` ← Use this for `ANSWERBOT_DOMAIN`

#### 2. Get API Token
1. Go to Zendesk Admin Center
2. Navigate to: **Apps and integrations → APIs → Zendesk API**
3. Click **Settings** tab
4. Enable **Token Access**
5. Click **Add API token**
6. Give it a name (e.g., "Answer Bot API")
7. Copy the token ← This is your `ANSWERBOT_API_TOKEN`

#### 3. Admin Email
Use the email address of the admin account that owns the API token.
- This is typically your Zendesk admin email
- Format: `admin@example.com` ← Use this for `ANSWERBOT_ADMIN_EMAIL`

## API Endpoints

### 1. Get Recommendations

**Endpoint:** `POST /api/answerbot/recommendations`

Gets article suggestions from Zendesk Answer Bot based on user's enquiry.

**Request:**
```json
{
  "enquiry": "How to reset my password?",
  "locale": "en-us",
  "reference": "demo"
}
```

**Response:**
```json
{
  "articles": [
    {
      "article_id": "360001234567",
      "title": "How to reset your password",
      "snippet": "To reset your password, follow these steps...",
      "html_url": "https://support.mycompany.com/hc/en-us/articles/360001234567"
    }
  ],
  "interaction_access_token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Note:** The `interaction_access_token` is required for resolve/reject endpoints.

### 2. Resolve Article

**Endpoint:** `POST /api/answerbot/resolve`

Marks an article as helpful/resolved.

**Request:**
```json
{
  "article_id": "360001234567",
  "interaction_access_token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "status": 200
}
```

### 3. Reject Article

**Endpoint:** `POST /api/answerbot/reject`

Marks an article as not helpful.

**Request:**
```json
{
  "article_id": "360001234567",
  "interaction_access_token": "eyJhbGciOiJIUzI1NiJ9...",
  "reason_id": 2
}
```

**Reason IDs:**
- `0` - Article doesn't help
- `1` - Article is unclear
- `2` - Article doesn't apply to me

**Response:**
```json
{
  "status": 200
}
```

## Authentication

### Recommendations Endpoint
Uses **Basic Authentication** with Zendesk API:
```
Authorization: Basic base64(email/token:api_token)
```

The function automatically constructs this header from environment variables.

### Resolve/Reject Endpoints
Use the **interaction_access_token** from the recommendations response.
No additional authentication required.

## Implementation Details

### Proxy Pattern
The Answer Bot API functions act as a proxy to Zendesk's API:
1. Receive request from frontend
2. Validate input
3. Add authentication headers
4. Forward to Zendesk API
5. Return response

This pattern:
- ✅ Hides API credentials from frontend
- ✅ Allows CORS for any origin
- ✅ Centralizes error handling
- ✅ Enables monitoring and logging

### Error Handling

All endpoints return proper error responses:

**400 Bad Request:**
```json
{
  "error": "Missing required field: enquiry"
}
```

**500 Server Error:**
```json
{
  "error": "Server configuration error",
  "details": "Missing Answer Bot environment variables"
}
```

**Zendesk API Errors:**
Pass through the status code from Zendesk with the error details.

## Testing

### Local Development

1. Create `.dev.vars` file:
```bash
cp .dev.vars.example .dev.vars
```

2. Add your credentials:
```bash
ANSWERBOT_DOMAIN=mycompany
ANSWERBOT_ADMIN_EMAIL=admin@mycompany.com
ANSWERBOT_API_TOKEN=your_token_here
```

3. Run dev server with functions:
```bash
npm run dev:functions
```

4. Test recommendations:
```bash
curl -X POST http://localhost:8788/api/answerbot/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "enquiry": "How to reset password?",
    "locale": "en-us",
    "reference": "demo"
  }'
```

### Production Testing

After deployment:

```bash
curl -X POST https://demo.internalnote.com/api/answerbot/recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "enquiry": "How to reset password?",
    "locale": "en-us",
    "reference": "demo"
  }'
```

## Files Modified

### Created
- `functions/api/answerbot/recommendations.ts` - Recommendations endpoint
- `functions/api/answerbot/resolve.ts` - Resolve endpoint
- `functions/api/answerbot/reject.ts` - Reject endpoint

### Updated
- `src/pages/utility/AnswerBot.tsx` - Updated to use local API endpoints
- `.dev.vars.example` - Added Answer Bot environment variables
- `readme.md` - Added Answer Bot API documentation
- `DEPLOYMENT.md` - Added Answer Bot environment variable setup
- `ENDPOINT_MIGRATION.md` - Added Answer Bot migration status

## Integration with AnswerBot.tsx

The page flow:
1. User types a question
2. Click "Get Suggestions"
3. → POST to `/api/answerbot/recommendations`
4. Display article cards
5. User clicks "Mark as solved" or "Doesn't help"
6. → POST to `/api/answerbot/resolve` or `/api/answerbot/reject`
7. Update UI to show resolved/rejected state

## Security Notes

### Why Proxy is Necessary
- ✅ **Protects API Token** - Never exposed to frontend
- ✅ **Prevents Token Rotation Issues** - Update once in env vars
- ✅ **Centralized Auth** - One place to manage credentials
- ✅ **Rate Limiting** - Can add rate limiting at proxy level

### Basic Auth Format
Zendesk requires Basic Authentication with format:
```
email/token:api_token
```

Example:
- Email: `admin@mycompany.com`
- Token: `abc123xyz789`
- Auth string: `admin@mycompany.com/token:abc123xyz789`
- Base64: `YWRtaW5AbXljb21wYW55LmNvbS90b2tlbjphYmMxMjN4eXo3ODk=`
- Header: `Authorization: Basic YWRtaW5AbXljb21wYW55LmNvbS90b2tlbjphYmMxMjN4eXo3ODk=`

The function handles this automatically using `btoa()`.

## Troubleshooting

### "Server configuration error"
**Cause:** Environment variables not set
**Solution:** Set `ANSWERBOT_DOMAIN`, `ANSWERBOT_ADMIN_EMAIL`, and `ANSWERBOT_API_TOKEN` in Cloudflare Pages Dashboard

### "401 Unauthorized" from Zendesk
**Cause:** Invalid API token or email
**Solution:**
1. Verify API token in Zendesk Admin Center
2. Ensure email format is correct
3. Check token has necessary permissions

### "404 Not Found" from Zendesk
**Cause:** Invalid subdomain
**Solution:** Verify `ANSWERBOT_DOMAIN` matches your Zendesk subdomain (without `.zendesk.com`)

### No articles returned
**Cause:** Answer Bot not configured or no matching articles
**Solution:**
1. Ensure Answer Bot is enabled in Zendesk
2. Check that articles exist in your knowledge base
3. Verify articles are published and not in draft

### CORS errors
**Cause:** Browser blocking cross-origin requests
**Solution:** The API includes proper CORS headers (`Access-Control-Allow-Origin: *`), should not occur

## Next Steps

1. ✅ Set environment variables in Cloudflare Pages
2. ✅ Deploy to production
3. ✅ Test all three endpoints
4. ✅ Verify in Answer Bot page on demo.internalnote.com
5. 🗑️ Delete old worker: `workers/answerbot.js` (after verifying migration)

## References

- [Zendesk Answer Bot API Documentation](https://developer.zendesk.com/api-reference/answer-bot/answers/)
- [Zendesk API Authentication](https://developer.zendesk.com/api-reference/introduction/security-and-auth/)
- [Internal Note Answer Bot Guide](https://internalnote.com/answer-bot-api/)

---

**Status:** ✅ Migration complete
**Last Updated:** 2026-03-02
