
## Config
`npx tailwindcss -i ./tailwind/input.css -o ./docs/css/style.css --watch`

![image](https://github.com/verschoren/zendesk_widget/assets/894026/08346076-dce8-4e05-804a-fb3264474acd)

# JWT Generator
**CHECK OUT THE FULL DEMO AND SETUP AT [INTERNALNOTE.COM](https://internalnote.com/jwt-messaging/)**


## High Level
This [Cloudflare](https://cloudflare.com) Worker generates multiple types of webtokens for the Zendesk SDKs and the Chat SDK and Web Widget. 

They assume a trusted environment where the SSO happens before this service is called.
We assume that the app or website that calls these endpoints already handled the authentication and that we can return a status 200 trusted.

## Deployment
This tools makes use of Cloudflare Worker. Those are *free* serverless function that can run your API logic.
Deployment can be done via this [GitHub Action](https://github.com/marketplace/actions/deploy-to-cloudflare-workers-with-wrangler)

**We do recommend including a check with your SSO tool of choice to validate the user before returning the token**

The script requires:
- Messaging App Secret and Token

We return
- Status 200 for POST to the /messaging endpoint with a valid payload in the Messaging SDK and Widget
- Status 401 for any error we find, which results in an unauthorized user in the SDK or Widget

## References
- [Authenticating Messaging Widget](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/sdk_api_reference/#authentication)
 
## Messaging
The Zendesk Messaging SDK and the Widget requires a JWT endpoint for authenticating its users.
It sends a payload to the endpoint. The payload contains email, name and an external_id
The external_id can be anything but is preferably the UUID of the user in the authentication service so we can extend the code to validate the user.

    {"name":"John Appleseed","email":"john@example.com","external_id":"123456"}
    
The endpoint is found at https://jwt.verschoren.com/messaging

It returns the following when handling a POST

### Status 201

     {"jwt": "abc123def456...."}

which has a decoded structure of

    {
        "alg": "HS256",
        "typ": "JWT",
        "kid": "act_5963ceb97cde542d000dbdb1"
    }
    {
        "iat": current_time_in_seconds,
        "name": name,
        "email": email,
        "external_id": external_id,
    }

### Status 401
If the past token can't be found we send a status 401 which will be handled as unauthorized by the SDK