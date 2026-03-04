/**
 * Cloudflare Pages Function for generating JWT tokens for Zendesk Messaging
 *
 * This function accepts POST requests with user information and returns a JWT token
 * for authenticating with Zendesk Messaging.
 *
 * Environment variables required:
 * - MESSAGING_APP_ID: Your Zendesk Messaging App ID
 * - MESSAGING_SECRET: Your Zendesk Messaging Secret Key
 */

interface Env {
  MESSAGING_APP_ID: string
  MESSAGING_SECRET: string
}

interface UserInfo {
  external_id: string
  user_email?: string
  email?: string
  user_name?: string
  name?: string
}

/**
 * Allowed origins for CORS
 */
const ALLOWED_ORIGINS = [
  'https://demo.internalnote.com',
  'https://internalnote.com',
  'https://www.internalnote.com',
  'http://localhost:5173',
  'http://localhost:4173'
]

/**
 * Get CORS headers based on request origin
 */
function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin')
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  }
}

export async function onRequestPost(context: {
  request: Request
  env: Env
}): Promise<Response> {
  const { request, env } = context
  const corsHeaders = getCorsHeaders(request)

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
        ...corsHeaders
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
          ...corsHeaders
        }
      }
    )
  }

  try {
    const jwt = await generateMessagingJWT(
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
        ...corsHeaders
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
          ...corsHeaders
        }
      }
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions(context: {
  request: Request
}): Promise<Response> {
  const corsHeaders = getCorsHeaders(context.request)

  return new Response(null, {
    status: 204,
    headers: corsHeaders
  })
}

async function generateMessagingJWT(
  userData: { external_id: string; email: string; name: string },
  env: Env
): Promise<string> {
  const app_id = env.MESSAGING_APP_ID
  const secret = env.MESSAGING_SECRET

  if (!app_id || !secret) {
    throw new Error('Missing environment variables: MESSAGING_APP_ID or MESSAGING_SECRET')
  }

  // Import the secret key
  const key = await crypto.subtle.importKey(
    'raw',
    utf8ToUint8Array(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  // Create JWT header
  const header = JSON.stringify({
    alg: 'HS256',
    typ: 'JWT',
    kid: app_id
  })

  // Create JWT payload with 24 hour expiration
  const payload = JSON.stringify({
    scope: 'user',
    name: userData.name,
    email: userData.email,
    exp: Math.floor(Date.now() / 1000) + 86400,
    external_id: userData.external_id,
    email_verified: true
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
