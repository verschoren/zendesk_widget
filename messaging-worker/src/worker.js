export default {
	async fetch(request, env, ctx) {
		const { url } = request;
		const { pathname } = new URL(url);
		var json = {}
		try {
			json = await request.json();
		} catch (e) {
			console.log(e);
			return new Response("Bad json", { status: 400 });

		}
		console.log(json);

		switch (pathname) {
			case "/":
				return Response.redirect('https://demo.internalnote.com', 302);
			case "/messaging":
				var response_messaging = await respondMessaging(json,env,"external_id");
				response_messaging.headers.set("access-control-allow-origin", "*");
				return response_messaging;
			case "/messaging_email":
				var response_messaging = await respondMessaging(json,env,"email");
				response_messaging.headers.set("access-control-allow-origin", "*");
				return response_messaging;
			default :
				return new Response("Bad path", { status: 401 });
		}
	}
};

async function respondMessaging(json,env,type) {
	//{"external_id":"JB007","user_email":"james@universalexports.com","user_name":"James Bond"}

	if (!json.external_id || !json.user_email || !json.user_name) {
		return new Response("missing parameters", { status: 401 });
	} else {
		var app_id = env.MESSAGING_APP_ID;
		var secret = env.MESSAGING_SECRET;

		const key = await crypto.subtle.importKey(
			"raw",
			utf8ToUint8Array(secret),
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["sign"]
		);

		const header = JSON.stringify({ alg: "HS256", typ: "JWT", kid: app_id });

		var payload;
		if (type == "external_id") {
			payload = JSON.stringify({
				scope: "user",
				name: json.user_name,
				email: json.user_email,
				external_id: json.external_id,
				exp: Math.floor(new Date().getTime() / 1000.0) + 86400,
			});
		} else {
			payload = JSON.stringify({
				scope: "user",
				name: json.user_name,
				email: json.user_email,
				exp: Math.floor(new Date().getTime() / 1000.0) + 86400,
				external_id: "user_" + json.user_email,
				email_verified: true
			});
		}

		const partialToken = `${base64URLStringify(
			utf8ToUint8Array(header)
		)}.${base64URLStringify(utf8ToUint8Array(payload))}`;
			const signature = await crypto.subtle.sign(
			"HMAC",
			key,
			utf8ToUint8Array(partialToken)
		);
		const jwt = `${partialToken}.${base64URLStringify(
			new Uint8Array(signature)
		)}`;
		console.log(jwt);

		return new Response(jwt);
	}
}

function handleError(error) {
	console.error("Uncaught error:", error);

	const { stack } = error;
	return new Response(stack || error, { status: 401 });
}

/**
3 functions from https://github.com/tsndr/cloudflare-worker-jwt
These functions handle the base64 encoding and decoding logic.
*/
function base64URLParse(s) {
	return new Uint8Array(
	  Array.prototype.map.call(
		atob(s.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")),
		(c) => c.charCodeAt(0)
	  )
	);
  }
  function base64URLStringify(a) {
	return btoa(String.fromCharCode.apply(0, a))
	  .replace(/=/g, "")
	  .replace(/\+/g, "-")
	  .replace(/\//g, "_");
  }
  function utf8ToUint8Array(s) {
	return base64URLParse(btoa(unescape(encodeURIComponent(s))));
  }