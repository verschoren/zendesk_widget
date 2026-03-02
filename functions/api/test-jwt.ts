/**
 * Test endpoint to verify JWT token structure
 * Only available in development - DO NOT deploy to production
 *
 * Usage:
 * POST /api/test-jwt
 * Body: { "type": "messaging" | "guide" }
 *
 * Returns decoded JWT structure for verification
 */

interface Env {
  MESSAGING_APP_ID: string
  MESSAGING_SECRET: string
  GUIDE_SECRET: string
}

export async function onRequestPost(context: {
  request: Request
  env: Env
}): Promise<Response> {
  const { request, env } = context

  // Only allow in development
  const url = new URL(request.url)
  const isDev = url.hostname === 'localhost' || url.hostname.includes('pages.dev')

  if (!isDev) {
    return new Response('Test endpoint not available in production', { status: 403 })
  }

  let json: { type: string }
  try {
    json = await request.json()
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const testUser = {
    external_id: 'test123',
    email: 'test@example.com',
    name: 'Test User'
  }

  let jwtToken: string
  let endpoint: string

  try {
    if (json.type === 'messaging') {
      endpoint = '/api/messaging'
      const messagingResponse = await fetch(new URL(endpoint, url.origin), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      })
      jwtToken = await messagingResponse.text()
    } else if (json.type === 'guide') {
      endpoint = '/api/guide'
      const guideResponse = await fetch(new URL(endpoint, url.origin), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          external_id: testUser.external_id,
          user_email: testUser.email,
          user_name: testUser.name
        })
      })
      jwtToken = await guideResponse.text()
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid type. Use "messaging" or "guide"' }),
        { status: 400 }
      )
    }

    // Decode JWT (without verification - just for inspection)
    const parts = jwtToken.split('.')
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format')
    }

    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')))
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))

    const result = {
      success: true,
      endpoint,
      jwt: jwtToken,
      decoded: {
        header,
        payload
      },
      verification: {
        messaging: json.type === 'messaging' ? {
          hasKid: !!header.kid,
          hasScope: payload.scope === 'user',
          hasExternalId: !!payload.external_id,
          hasEmailVerified: payload.email_verified === true,
          hasExp: !!payload.exp,
          expIsValid: payload.exp ? payload.exp > Math.floor(Date.now() / 1000) : false,
          allFieldsPresent: !!(header.kid && payload.scope && payload.external_id && payload.email_verified && payload.exp)
        } : null,
        guide: json.type === 'guide' ? {
          noKid: !header.kid,
          hasJti: !!payload.jti,
          hasIat: !!payload.iat,
          noExp: !payload.exp,
          noScope: !payload.scope,
          allFieldsCorrect: (!header.kid && !!payload.jti && !!payload.iat && !payload.exp && !payload.scope)
        } : null
      }
    }

    return new Response(JSON.stringify(result, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('Test JWT error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to generate or decode JWT',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    )
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}
