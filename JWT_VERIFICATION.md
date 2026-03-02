# JWT Token Format Verification

This document verifies that our JWT implementations are compatible with Zendesk requirements.

## 1. Zendesk Messaging SDK (/api/messaging)

### Zendesk Requirements
According to [Zendesk Messaging Authentication Documentation](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/sdk_api_reference/#authentication):

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT",
  "kid": "YOUR_INTEGRATION_KEY_ID"
}
```

**Payload:**
```json
{
  "scope": "user",
  "external_id": "unique_user_identifier",
  "name": "User Name",
  "email": "user@example.com",
  "email_verified": true,
  "exp": 1234567890
}
```

### Our Implementation ✅

**Header:**
```typescript
{
  alg: 'HS256',
  typ: 'JWT',
  kid: env.MESSAGING_APP_ID  // ✅ Integration Key ID
}
```

**Payload:**
```typescript
{
  scope: 'user',              // ✅ Required
  name: userData.name,        // ✅ Required
  email: userData.email,      // ✅ Required
  exp: Math.floor(Date.now() / 1000) + 86400,  // ✅ 24hr expiration
  external_id: userData.external_id,            // ✅ Required
  email_verified: true        // ✅ Required
}
```

**Signing:**
- Algorithm: HMAC-SHA256 ✅
- Secret: `env.MESSAGING_SECRET`
- Format: `{header}.{payload}.{signature}` in base64url encoding ✅

**Status:** ✅ **FULLY COMPATIBLE** with Zendesk Messaging SDK

---

## 2. Zendesk Classic Widget (/api/guide)

### Zendesk Requirements
According to [Zendesk Web Widget Authentication Documentation](https://support.zendesk.com/hc/en-us/articles/4408832467098-Enabling-authenticated-visitors-in-the-Web-Widget):

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "jti": "unique_token_id",
  "iat": 1234567890,
  "name": "User Name",
  "email": "user@example.com"
}
```

**Note:** Classic Widget uses `jti` (JWT ID) and `iat` (issued at) instead of `exp` (expiration). No `kid` in header.

### Our Implementation ✅

**Header:**
```typescript
{
  alg: 'HS256',  // ✅ Required
  typ: 'JWT'     // ✅ Required
}
// No 'kid' - correct for Classic Widget ✅
```

**Payload:**
```typescript
{
  jti: Math.floor(Math.random() * 10000000),  // ✅ Unique token ID
  iat: Math.floor(Date.now() / 1000),         // ✅ Issued at timestamp
  name: userData.name,                         // ✅ Required
  email: userData.email                        // ✅ Required
}
// No 'exp', 'scope', 'external_id', 'email_verified' - correct ✅
```

**Signing:**
- Algorithm: HMAC-SHA256 ✅
- Secret: `env.GUIDE_SECRET`
- Format: `{header}.{payload}.{signature}` in base64url encoding ✅

**Status:** ✅ **FULLY COMPATIBLE** with Zendesk Classic Widget

---

## Key Differences Handled Correctly

| Feature | Messaging SDK | Classic Widget |
|---------|---------------|----------------|
| **Header `kid`** | ✅ Required (Integration Key ID) | ❌ Not used |
| **Payload `scope`** | ✅ Required ("user") | ❌ Not used |
| **Payload `external_id`** | ✅ Required | ❌ Not used |
| **Payload `email_verified`** | ✅ Required (true) | ❌ Not used |
| **Payload `exp`** | ✅ Required (expiration) | ❌ Not used |
| **Payload `jti`** | ❌ Not used | ✅ Required (unique ID) |
| **Payload `iat`** | ❌ Not used | ✅ Required (issued at) |
| **Payload `name`** | ✅ Required | ✅ Required |
| **Payload `email`** | ✅ Required | ✅ Required |

Our implementation correctly handles these differences by having separate functions for each JWT type.

---

## Environment Variables Required

### Messaging SDK
```bash
MESSAGING_APP_ID=integration_key_id_here
MESSAGING_SECRET=integration_secret_here
```

**Where to find:**
1. Go to Zendesk Admin Center
2. Navigate to: Channels → Messaging and social → Messaging
3. Click on your Web Widget
4. Under "Installation" tab, find "Authentication"
5. Copy the **Integration Key ID** and **Secret Key**

### Classic Widget
```bash
GUIDE_SECRET=shared_secret_here
```

**Where to find:**
1. Go to Zendesk Admin Center
2. Navigate to: Channels → Classic → Web Widget
3. Under "Settings" tab, find "Authentication"
4. Enable "Authenticated visitors"
5. Copy the **Shared Secret**

---

## Testing Your JWTs

### Test Messaging JWT
```bash
curl -X POST http://localhost:8788/api/messaging \
  -H "Content-Type: application/json" \
  -d '{
    "external_id": "test123",
    "email": "test@example.com",
    "name": "Test User"
  }'
```

Expected response: JWT token like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InlvdXJfYXBwX2lkIn0...`

**Decode at jwt.io to verify:**
- Header has `kid`
- Payload has `scope`, `external_id`, `email_verified`, `exp`
- `exp` is approximately 24 hours in the future

### Test Classic Widget JWT
```bash
curl -X POST http://localhost:8788/api/guide \
  -H "Content-Type: application/json" \
  -d '{
    "external_id": "test123",
    "user_email": "test@example.com",
    "user_name": "Test User"
  }'
```

Expected response: JWT token like `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Decode at jwt.io to verify:**
- Header does NOT have `kid`
- Payload has `jti` and `iat` (but not `exp`, `scope`, etc.)
- `iat` matches current Unix timestamp

---

## Common Issues & Solutions

### Issue: "Invalid JWT" error in Messaging SDK
**Cause:** Missing or incorrect `kid` in header
**Solution:** Verify `MESSAGING_APP_ID` environment variable matches your Integration Key ID exactly

### Issue: "Invalid JWT" error in Classic Widget
**Cause:** JWT has extra fields (like `kid`, `scope`, `exp`)
**Solution:** Ensure using `/api/guide` endpoint, not `/api/messaging`

### Issue: JWT works locally but not in production
**Cause:** Environment variables not set in Cloudflare Pages
**Solution:** Set variables in Pages Dashboard → Settings → Environment variables

### Issue: JWT expired immediately
**Cause:** System time mismatch or wrong timestamp calculation
**Solution:** Verify `exp` is in seconds (not milliseconds) and in the future

---

## Migration from Old Workers

### Old messaging-worker ✅ Migrated
- **Was:** `messaging-worker/src/worker.js`
- **Now:** `functions/api/messaging.ts`
- **Compatible:** Yes, identical JWT format

### Old classic-worker ✅ Migrated
- **Was:** `classic-worker/index.js` (respondGuide function)
- **Now:** `functions/api/guide.ts`
- **Compatible:** Yes, identical JWT format

---

## Verification Checklist

Before deploying to production:

- [ ] Set `MESSAGING_APP_ID` in Cloudflare Pages environment variables
- [ ] Set `MESSAGING_SECRET` in Cloudflare Pages environment variables
- [ ] Set `GUIDE_SECRET` in Cloudflare Pages environment variables
- [ ] Test `/api/messaging` endpoint returns valid JWT
- [ ] Decode messaging JWT at jwt.io - verify header has `kid`
- [ ] Decode messaging JWT at jwt.io - verify payload has all required fields
- [ ] Test `/api/guide` endpoint returns valid JWT
- [ ] Decode guide JWT at jwt.io - verify header does NOT have `kid`
- [ ] Decode guide JWT at jwt.io - verify payload has `jti` and `iat`
- [ ] Test authentication in Zendesk Messaging Widget
- [ ] Test authentication in Zendesk Classic Widget
- [ ] Verify old worker URLs redirect to new endpoints

---

## Additional Resources

- [Zendesk Messaging Authentication](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/sdk_api_reference/#authentication)
- [Classic Widget Authentication](https://support.zendesk.com/hc/en-us/articles/4408832467098)
- [JWT.io Debugger](https://jwt.io) - Decode and verify JWT tokens
- [Internal Note Guide](https://internalnote.com/jwt-messaging/) - Setup guide

---

**Last Verified:** 2026-03-02
**Status:** ✅ Both implementations are fully compatible with Zendesk requirements
