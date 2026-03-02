/**
 * Cloudflare Pages Function for Zendesk Answer Bot - Rejection
 *
 * This endpoint marks an article as rejected in the Answer Bot API.
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

interface RejectRequest {
  article_id: string
  interaction_access_token: string
  reason_id: number
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
  let payload: RejectRequest
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
  if (!payload.article_id || !payload.interaction_access_token || !payload.reason_id) {
    return new Response(
      JSON.stringify({
        error: 'Missing required fields',
        required: ['article_id', 'interaction_access_token', 'reason_id']
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
    const zendeskUrl = `https://${env.ANSWERBOT_DOMAIN}.zendesk.com/api/v2/answer_bot/rejection`

    // Forward request to Zendesk API
    // Note: Rejection endpoint doesn't require authentication, only the interaction token
    const zendeskResponse = await fetch(zendeskUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(payload)
    })

    // Return status
    return new Response(
      JSON.stringify({ status: zendeskResponse.status }),
      {
        status: zendeskResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )

  } catch (error) {
    console.error('Answer Bot rejection error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to reject article',
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
