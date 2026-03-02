/**
 * Cloudflare Pages Function for Zendesk Answer Bot - Recommendations
 *
 * This endpoint fetches article recommendations from Zendesk Answer Bot API
 * based on a user's enquiry.
 *
 * Environment variables required:
 * - ANSWERBOT_DOMAIN: Your Zendesk subdomain (e.g., "mycompany")
 * - ANSWERBOT_ADMIN_EMAIL: Admin email for API authentication
 * - ANSWERBOT_API_TOKEN: API token for authentication
 */

interface Env {
  ANSWERBOT_DOMAIN: string
  ANSWERBOT_ADMIN_EMAIL: string
  ANSWERBOT_API_TOKEN: string
}

interface RecommendationsRequest {
  enquiry: string
  locale?: string
  reference?: string
}

export async function onRequestPost(context: {
  request: Request
  env: Env
}): Promise<Response> {
  const { request, env } = context

  // Validate environment variables
  if (!env.ANSWERBOT_DOMAIN || !env.ANSWERBOT_ADMIN_EMAIL || !env.ANSWERBOT_API_TOKEN) {
    return new Response(
      JSON.stringify({
        error: 'Server configuration error',
        details: 'Missing Answer Bot environment variables'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  // Parse request body
  let payload: RecommendationsRequest
  try {
    payload = await request.json()
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  // Validate required fields
  if (!payload.enquiry) {
    return new Response(
      JSON.stringify({
        error: 'Missing required field: enquiry'
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
    // Build Zendesk API URL
    const zendeskUrl = `https://${env.ANSWERBOT_DOMAIN}.zendesk.com/api/v2/answer_bot/answers/articles`

    // Create Basic Auth header
    const credentials = btoa(`${env.ANSWERBOT_ADMIN_EMAIL}/token:${env.ANSWERBOT_API_TOKEN}`)

    // Forward request to Zendesk API
    const zendeskResponse = await fetch(zendeskUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify(payload)
    })

    // Get response from Zendesk
    const results = await zendeskResponse.json()

    // Return results
    return new Response(JSON.stringify(results), {
      status: zendeskResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('Answer Bot API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
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
