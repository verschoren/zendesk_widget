/**
 * Cloudflare Pages Function for generating JWT tokens for Zendesk SDK
 *
 * This function accepts POST requests with user token and returns a JWT token
 * for authenticating with Zendesk SDK.
 *
 * Environment variables required:
 * - SDK_SECRET: Your Zendesk SDK Secret Key
 */

interface Env {
  SDK_SECRET: string
}

interface UserInfo {
  user_token: string
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

  // Validate required fields
  if (!json.user_token) {
    return new Response(
      JSON.stringify({
        error: 'Missing required parameters',
        required: ['user_token']
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
    const jwt = await generateSDKJWT(json, env)

    return new Response(JSON.stringify({ jwt }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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
 * Generate JWT for Zendesk SDK authentication
 */
async function generateSDKJWT(
  userData: { user_token: string },
  env: Env
): Promise<string> {
  const secret = env.SDK_SECRET

  if (!secret) {
    throw new Error('Missing environment variable: SDK_SECRET')
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
    typ: 'JWT'
  })

  // Create JWT payload for SDK
  // Uses user_token as both name and email
  const payload = JSON.stringify({
    jti: Math.floor(Math.random() * 10000000),
    iat: Math.floor(Date.now() / 1000),
    name: userData.user_token,
    email: userData.user_token
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
