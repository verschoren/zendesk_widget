# JWT Authentication Endpoint Documentation

This document explains how to interact with the JWT authentication endpoint for Zendesk Messaging widget integration.

## Endpoint URL

The JWT endpoint is available at multiple URLs:

- **Production (demo site)**: `https://demo.internalnote.com/api/messaging`
- **Production (JWT subdomain)**: `https://jwt.internalnote.com/messaging`
- **Production (root domain)**: `https://internalnote.com/api/messaging` *(coming soon)*
- **Local development**: `http://localhost:5173/api/messaging`

All endpoints serve the same functionality - use whichever fits your deployment setup.

## Authentication Flow

```
User Profile Data → JWT Endpoint → Signed JWT Token → Zendesk Messenger
```

1. Collect user information (name, email, external_id)
2. Send POST request to JWT endpoint with user data
3. Receive signed JWT token
4. Pass token to Zendesk Messenger via `loginUser` callback

## API Specification

### Request

**Method**: `POST`

**Headers**:
```
Content-Type: application/json
```

**Body Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` or `user_name` | string | Yes | User's full name |
| `email` or `user_email` | string | Yes | User's email address |
| `external_id` | string | Yes | Unique identifier for the user in your system |

**Example Request Body**:
```json
{
  "name": "Maximus Decimus Meridius",
  "email": "maximus@gladiator.example",
  "external_id": "bWF4aW11c0BnbGFkaWF0b3IuZXhhbXBsZQ=="
}
```

### Response

**Success Response** (200 OK):
```
Content-Type: text/plain

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyMzQ1In0.eyJzY29wZSI6InVzZXIiLCJuYW1lIjoiTWF4aW11cyBEZWNpbXVzIE1lcmlkaXVzIiwiZW1haWwiOiJtYXhpbXVzQGdsYWRpYXRvci5leGFtcGxlIiwiZXhwIjoxNzA5NjM4NDAwLCJleHRlcm5hbF9pZCI6ImJXRjRhVzExYzBCbmJHRmthV0YwYjNJdVpYaGhiWEJzWlE9PSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlfQ.example-signature
```

**Error Responses**:

| Status | Description | Response Body |
|--------|-------------|---------------|
| 400 | Invalid JSON | `{"error": "Invalid JSON"}` |
| 400 | Missing parameters | `{"error": "Missing required parameters", "required": [...]}` |
| 500 | JWT generation failed | `{"error": "Failed to generate JWT"}` |

## JWT Token Details

The generated JWT contains the following claims:

```json
{
  "scope": "user",
  "name": "User's full name",
  "email": "user@example.com",
  "external_id": "unique-user-id",
  "email_verified": true,
  "exp": 1234567890
}
```

- **Token validity**: 24 hours (86400 seconds)
- **Algorithm**: HS256 (HMAC-SHA256)
- **Header includes**: `alg`, `typ`, `kid` (App ID)

## Integration Examples

### JavaScript (Fetch API)

```javascript
async function authenticateUser(userData) {
  try {
    const response = await fetch('https://demo.internalnote.com/api/messaging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        external_id: userData.external_id
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const jwtToken = await response.text()

    // Pass token to Zendesk Messenger
    if (window.zE) {
      window.zE('messenger', 'loginUser', function(callback) {
        callback(jwtToken)
      })
    }

    return jwtToken
  } catch (error) {
    console.error('Authentication failed:', error)
    throw error
  }
}
```

### React Example

```typescript
import { useState } from 'react'

interface User {
  name: string
  email: string
  external_id: string
}

function useZendeskAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const login = async (user: User) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/messaging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      })

      if (!response.ok) {
        throw new Error('Authentication failed')
      }

      const jwtToken = await response.text()

      // Authenticate with Zendesk
      if (window.zE) {
        window.zE('messenger', 'loginUser', function(callback: (token: string) => void) {
          callback(jwtToken)
        })
      }

      return jwtToken
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
```

### cURL Example

```bash
curl -X POST https://demo.internalnote.com/api/messaging \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maximus Decimus Meridius",
    "email": "maximus@gladiator.example",
    "external_id": "bWF4aW11c0BnbGFkaWF0b3IuZXhhbXBsZQ=="
  }'
```

### Python Example

```python
import requests
import json

def get_zendesk_jwt(user_data):
    url = 'https://demo.internalnote.com/api/messaging'
    headers = {'Content-Type': 'application/json'}

    response = requests.post(url, headers=headers, json=user_data)

    if response.status_code == 200:
        return response.text
    else:
        raise Exception(f"JWT generation failed: {response.status_code} - {response.text}")

# Usage
user = {
    'name': 'Maximus Decimus Meridius',
    'email': 'maximus@gladiator.example',
    'external_id': 'bWF4aW11c0BnbGFkaWF0b3IuZXhhbXBsZQ=='
}

jwt_token = get_zendesk_jwt(user)
print(jwt_token)
```

## CORS Configuration

The endpoint is configured to accept requests from:
- `https://demo.internalnote.com`
- `https://internalnote.com`
- `http://localhost:5173` (development)

If you need to call the endpoint from a different origin, contact the administrator to add your domain to the allowed origins list.

## Best Practices

### Security Considerations

1. **Never expose your Zendesk secret key** - It must remain server-side only
2. **Use HTTPS** in production - All JWT endpoints use HTTPS for secure transmission
3. **Validate user data** - Always validate user input before sending to the JWT endpoint
4. **Handle token expiration** - Tokens expire after 24 hours, implement refresh logic if needed

### External ID Guidelines

The `external_id` should be:
- **Unique** per user in your system
- **Permanent** - Don't change it for existing users
- **Not personally identifiable** - Use hashed or encoded values (e.g., base64 encoded email)

Example external_id generation:
```javascript
// Using base64 encoding
const external_id = btoa(user.email) // "maximus@example.com" → "bWF4aW11c0BleGFtcGxlLmNvbQ=="

// Or use a UUID if available
const external_id = user.uuid // "550e8400-e29b-41d4-a716-446655440000"
```

### User Matching

Zendesk will automatically merge conversations if:
- The **email** matches an existing user in Zendesk
- The **external_id** matches an existing user in Zendesk

This allows users to continue conversations across sessions and devices.

## Troubleshooting

### Common Issues

**Issue**: `Missing required parameters` error
- **Solution**: Ensure all three fields (`name`, `email`, `external_id`) are present and non-empty

**Issue**: CORS error in browser console
- **Solution**: Verify you're calling from an allowed origin (demo.internalnote.com or internalnote.com)

**Issue**: `Failed to generate JWT` error
- **Solution**: Check server logs - this usually indicates missing environment variables (MESSAGING_APP_ID or MESSAGING_SECRET)

**Issue**: Zendesk widget shows "Authentication failed"
- **Solution**: Verify the JWT token is valid and not expired. Check Zendesk dashboard for authentication errors.

### Testing the Endpoint

Test with curl to verify the endpoint is working:

```bash
# Should return a JWT token
curl -X POST https://demo.internalnote.com/api/messaging \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","external_id":"test123"}'

# Should return error for missing parameters
curl -X POST https://demo.internalnote.com/api/messaging \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User"}'
```

## Environment Variables

The JWT endpoint requires the following environment variables to be configured:

| Variable | Description | Example |
|----------|-------------|---------|
| `MESSAGING_APP_ID` | Zendesk Messaging App ID (acts as JWT `kid`) | `abc123def456` |
| `MESSAGING_SECRET` | Zendesk Messaging Secret Key for signing | `your-secret-key-here` |

These are configured in the Cloudflare Pages dashboard under **Settings → Environment Variables**.

## Additional Resources

- [Zendesk Messaging Authentication Guide](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/sdk_api_reference/#loginuser)
- [JWT.io - JWT Debugger](https://jwt.io) - Use to decode and inspect tokens
- [Internal Note Blog - JWT Authentication](https://internalnote.com/jwt-messaging)
- [Demo Site - Live Example](https://demo.internalnote.com/messaging/authentication)

## Support

For issues or questions:
- Check the [demo implementation](https://demo.internalnote.com/messaging/authentication)
- Review [Zendesk documentation](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/)
- Open an issue in the project repository
