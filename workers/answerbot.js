const subdomain = 'subdomain' //your Zendesk subdomain
const headers_body = {
  'content-type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
}
      
export default {
  async fetch(request, env) {
    try {
      if (request.method == 'OPTIONS') {
        return handleOptionsRequest(request)
      } else {
        const { pathname } = new URL(request.url);

        if (pathname.startsWith("/recommendations")) {
          //Get the incoming enquiry
          var enquiry = JSON.stringify(await request.json());

          const url = 'https://'+subdomain+'.zendesk.com/api/v2/answer_bot/answers/articles';

          const init = {
            body: enquiry,
            method: 'POST',
            headers: {
              'content-type': 'application/json;charset=UTF-8',
              'Authorization': 'Basic abc123def456xyz789=',
            },
          };
          
          const response = await fetch(url, init);
          const results = await response.json();
          
          //return an array of suggested articles
          return new Response(JSON.stringify(results), {headers: headers_body});
        }

        if (pathname.startsWith("/resolve")) {
          //Get the incoming payload
          var payload = JSON.stringify(await request.json());

          //Set API URL
          const url = 'https://'+subdomain+'.zendesk.com/api/v2/answer_bot/resolution';

          const init = {
            body: payload,
            method: 'POST',
            headers: {
              'content-type': 'application/json;charset=UTF-8'
            },
          };
          const response = await fetch(url, init);
          const results = await response.status;
          return new Response(JSON.stringify(results), {headers: headers_body});
        }

        if (pathname.startsWith("/reject")) {
          //Get the incoming payload
          var payload = JSON.stringify(await request.json());

          //Set API URL
          const url = 'https://'+subdomain+'.zendesk.com/api/v2/answer_bot/rejection';

          const init = {
            body: payload,
            method: 'POST',
            headers: {
              'content-type': 'application/json;charset=UTF-8'
            },
          };
          const response = await fetch(url, init);
          const results = await response.status;
          return new Response(JSON.stringify(results), {headers: headers_body});
        }
        
        return new Response(OK, {status: 200,headers: headers_body});
      }
    } catch(e) {
      return new Response(err.stack, {status: 500,headers: headers_body});
    }
  }
}

function handleOptionsRequest(request) {
  let headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ){
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
        "Access-Control-Max-Age": "86400",
        "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
      }
    })
  }
  else {
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    })
  }
}