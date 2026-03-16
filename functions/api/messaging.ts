/**
 * Cloudflare Pages Function for generating JWT tokens for Zendesk Messaging
 *
 * This function accepts POST requests with user information and returns a JWT token
 * for authenticating with Zendesk Messaging.
 *
 * Features:
 * - Checks if user already exists in Zendesk by email
 * - Uses existing external_id if found
 * - Updates user with external_id if they don't have one
 * - Generates JWT with correct external_id
 *
 * Environment variables required:
 * - MESSAGING_APP_ID: Your Zendesk Messaging App ID
 * - MESSAGING_SECRET: Your Zendesk Messaging Secret Key
 * - ANSWERBOT_DOMAIN: Your Zendesk subdomain (for API calls)
 * - ANSWERBOT_ADMIN_EMAIL: Admin email for API authentication
 * - ANSWERBOT_API_TOKEN: API token for authentication
 */

interface Env {
  MESSAGING_APP_ID: string
  MESSAGING_SECRET: string
  ANSWERBOT_DOMAIN?: string
  ANSWERBOT_ADMIN_EMAIL?: string
  ANSWERBOT_API_TOKEN?: string
}

interface UserInfo {
  external_id?: string
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
  let external_id = json.external_id

  // Validate required fields (external_id is now optional as we can generate/lookup)
  if (!email || !name) {
    return new Response(
      JSON.stringify({
        error: 'Missing required parameters',
        required: ['email (or user_email)', 'name (or user_name)']
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
    // Check if we have Zendesk API credentials for user lookup
    const hasZendeskAPI = env.ANSWERBOT_DOMAIN && env.ANSWERBOT_ADMIN_EMAIL && env.ANSWERBOT_API_TOKEN
    console.log(`Zendesk API credentials available: ${hasZendeskAPI}`)

    // If we have API access, check for existing user in Zendesk
    if (hasZendeskAPI) {
      console.log(`Looking up user by email: ${email}`)
      const existingUser = await findZendeskUserByEmail(email, env)

      if (existingUser) {
        console.log(`Found existing Zendesk user:`, JSON.stringify(existingUser))

        // If user exists and has an external_id, use it
        if (existingUser.external_id) {
          console.log(`Using existing external_id: ${existingUser.external_id}`)
          external_id = existingUser.external_id
        }
        // If user exists but no external_id, update them with our generated one
        else {
          const generatedExternalId = external_id || generateExternalId(email)
          console.log(`User exists without external_id, updating with: ${generatedExternalId}`)

          const updated = await updateZendeskUserExternalId(
            existingUser.id,
            generatedExternalId,
            env
          )

          if (updated) {
            external_id = generatedExternalId
          } else {
            console.warn('Failed to update user external_id, using generated one anyway')
            external_id = generatedExternalId
          }
        }
      } else {
        // User doesn't exist in Zendesk yet, use provided or generate external_id
        external_id = external_id || generateExternalId(email)
        console.log(`User not found in Zendesk, using external_id: ${external_id}`)
      }
    } else {
      // No API access, use provided external_id or generate one
      external_id = external_id || generateExternalId(email)
      console.log('No Zendesk API access, using provided/generated external_id')
    }

    // Generate JWT with the final external_id
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
      JSON.stringify({
        error: 'Failed to generate JWT',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
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
 * Search for a Zendesk user by email
 * Returns the user object if found, null otherwise
 */
interface ZendeskUser {
  id: number
  email: string
  name: string
  external_id: string | null
}

async function findZendeskUserByEmail(
  email: string,
  env: Env
): Promise<ZendeskUser | null> {
  if (!env.ANSWERBOT_DOMAIN || !env.ANSWERBOT_ADMIN_EMAIL || !env.ANSWERBOT_API_TOKEN) {
    return null
  }

  try {
    const encodedEmail = encodeURIComponent(email)
    const searchUrl = `https://${env.ANSWERBOT_DOMAIN}.zendesk.com/api/v2/users/search.json?query=email:${encodedEmail}`

    const credentials = btoa(`${env.ANSWERBOT_ADMIN_EMAIL}/token:${env.ANSWERBOT_API_TOKEN}`)

    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      }
    })

    if (!response.ok) {
      console.error(`Zendesk search failed: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json() as { users: ZendeskUser[] }

    // Return first user if found (email should be unique)
    if (data.users && data.users.length > 0) {
      console.log(`Found ${data.users.length} user(s) for email ${email}`)
      return data.users[0]
    }

    console.log(`No users found for email ${email}`)
    return null
  } catch (error) {
    console.error('Error searching for Zendesk user:', error)
    return null
  }
}

/**
 * Update a Zendesk user's external_id
 * Returns true if successful, false otherwise
 */
async function updateZendeskUserExternalId(
  userId: number,
  externalId: string,
  env: Env
): Promise<boolean> {
  if (!env.ANSWERBOT_DOMAIN || !env.ANSWERBOT_ADMIN_EMAIL || !env.ANSWERBOT_API_TOKEN) {
    return false
  }

  try {
    const updateUrl = `https://${env.ANSWERBOT_DOMAIN}.zendesk.com/api/v2/users/${userId}.json`

    const credentials = btoa(`${env.ANSWERBOT_ADMIN_EMAIL}/token:${env.ANSWERBOT_API_TOKEN}`)

    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({
        user: {
          external_id: externalId
        }
      })
    })

    if (!response.ok) {
      console.error(`Zendesk user update failed: ${response.status} ${response.statusText}`)
      const errorBody = await response.text()
      console.error('Error response:', errorBody)
      return false
    }

    console.log(`Successfully updated user ${userId} with external_id: ${externalId}`)
    return true
  } catch (error) {
    console.error('Error updating Zendesk user:', error)
    return false
  }
}

/**
 * Generate a unique external_id from email
 * Uses base64 encoding for consistency with existing pattern
 */
function generateExternalId(email: string): string {
  return btoa(email)
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
