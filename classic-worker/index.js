var jwt = require("jwt-simple");

addEventListener("fetch", function (event) {
  const { request } = event;
  const response = handleRequest(request).catch(handleError);
  event.respondWith(response);
});

async function handleRequest(request) {
  const { url } = request;
  const { pathname } = new URL(url);

  const json = await request.json();
  console.log(json);

  switch (pathname) {
    case "/":
      return new Response("Bad path", { status: 401 });
    case "/chat":
      return respondChat(json);
    case "/sdk":
      return await respondSDK(json);
    case "/guide":
      var response_guide = await respondGuide(json);
      response_guide.headers.set("access-control-allow-origin", "*");
      return response_guide;
    default:
      return new Response("Bad path", { status: 401 });
  }
}

function respondChat(json) {
  //{"name":"James Bond","email":"james@universalexports.com","external_id":"JB007"}
  if (!json.name || !json.email || !json.external_id) {
    return new Response("missing parameters", { status: 401 });
  } else {
    var secret = CHAT_SECRET;
 
    var token_raw = {
      iat: Math.floor(Date.now() / 1000),
      name: json.name,
      external_id: json.external_id,
      email: json.email,
    };
    console.log(token_raw);

    var token = jwt.encode(token_raw, secret);

    return new Response('{"jwt": "' + token + '"}');
  }
}

async function respondSDK(json) {
  //{"user_token":"james@universalexports.com"}

  if (!json.user_token) {
    return new Response("missing parameters", { status: 401 });
  } else {
    var secret = SDK_SECRET;

    var token_raw = {
      jti: Math.floor(Math.random() * 10000000),
      iat: Math.floor(Date.now() / 1000),
      name: json.user_token,
      email: json.user_token,
    };
    console.log(token_raw);

    var token = jwt.encode(token_raw, secret);

    return new Response('{"jwt": "' + token + '"}');
  }
}

async function respondGuide(json) {
  //{"external_id":JB007,"user_email":"james@universalexports.com","user_name":"James Bond"}

  if (!json.external_id || !json.user_email || !json.user_name) {
    return new Response("missing parameters", { status: 401 });
  } else {
    var secret = GUIDE_SECRET;

    var token_raw = {
      jti: Math.floor(Math.random() * 10000000),
      iat: Math.floor(Date.now() / 1000),
      name: json.user_name,
      email: json.user_email,
    };
    console.log(token_raw);

    var token = jwt.encode(token_raw, secret);
    var payload = token;
    console.log(payload);
    return new Response(payload);
  }
}

function handleError(error) {
  console.error("Uncaught error:", error);

  const { stack } = error;
  return new Response(stack || error, { status: 401 });
}