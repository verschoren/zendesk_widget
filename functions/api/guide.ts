/**
 * Cloudflare Pages Function for generating JWT tokens for Zendesk Classic Widget / Guide
 *
 * This function accepts POST requests with user information and returns a JWT token
 * for authenticating with the Classic Zendesk Widget.
 *
 * Environment variables required:
 * - GUIDE_SECRET: Your Zendesk Guide Secret Key
 */

interface Env {
  GUIDE_SECRET: string
}

interface UserInfo {
  external_id: string
  user_email?: string
  email?: string
  user_name?: string
  name?: string
}

export async function onRequestPost(context: {
  request: Request
  env: Env
}): Promise<Response> {
  const { request, env } = context

  // Parse request body
  let json: UserInfo
  try {
    json = await request.json()
  } catch (e) {
    console.error('Invalid JSON:', e)
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  }

  // Normalize field names (support both user_email/email and user_name/name)
  const email = json.user_email || json.email
  const name = json.user_name || json.name
  const external_id = json.external_id

  // Validate required fields
  if (!external_id || !email || !name) {
    return new Response(
      JSON.stringify({
        error: 'Missing required parameters',
        required: ['external_id', 'email (or user_email)', 'name (or user_name)']
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  try {
    const jwt = await generateClassicWidgetJWT(
      {
        external_id,
        email,
        name
      },
      env
    )

    return new Response(jwt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('JWT generation error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate JWT' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  })
}

/**
 * Generate JWT for Classic Widget / Guide authentication
 * Uses simpler format than Messaging SDK: jti, iat, name, email
 */
async function generateClassicWidgetJWT(
  userData: { external_id: string; email: string; name: string },
  env: Env
): Promise<string> {
  const secret = env.GUIDE_SECRET

  if (!secret) {
    throw new Error('Missing environment variable: GUIDE_SECRET')
  }

  // Import the secret key
  const key = await crypto.subtle.importKey(
    'raw',
    utf8ToUint8Array(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  // Create JWT header (no kid for classic widget)
  const header = JSON.stringify({
    alg: 'HS256',
    typ: 'JWT'
  })

  // Create JWT payload - Classic Widget format
  // Uses jti (random) and iat (issued at) instead of exp
  const payload = JSON.stringify({
    jti: Math.floor(Math.random() * 10000000),
    iat: Math.floor(Date.now() / 1000),
    name: userData.name,
    email: userData.email
  })

  // Create the token
  const partialToken = `${base64URLStringify(
    utf8ToUint8Array(header)
  )}.${base64URLStringify(utf8ToUint8Array(payload))}`

  // Sign the token
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    utf8ToUint8Array(partialToken)
  )

  // Combine everything
  const jwt = `${partialToken}.${base64URLStringify(new Uint8Array(signature))}`

  return jwt
}

/**
 * Utility functions for base64 encoding/decoding
 * Based on https://github.com/tsndr/cloudflare-worker-jwt
 */

function base64URLParse(s: string): Uint8Array {
  return new Uint8Array(
    Array.prototype.map.call(
      atob(s.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, '')),
      (c: string) => c.charCodeAt(0)
    ) as number[]
  )
}

function base64URLStringify(a: Uint8Array): string {
  return btoa(String.fromCharCode(...Array.from(a)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function utf8ToUint8Array(s: string): Uint8Array {
  return base64URLParse(btoa(unescape(encodeURIComponent(s))))
}
