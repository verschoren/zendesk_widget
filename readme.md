
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
- Classic SDK Token
- Shared Secret (Chat and Widget
- Messaging App Secret and Token

We return
- Status 200 for POST to the /sdk endpoint with a valid payload for the Classic SDK
- Status 200 for POST to the /chat endpoint with a valid payload for the Chat SDK
- Status 200 for POST to the /guide endpoint with a valid payload for authenticating Guide in the Classic Widget
- Status 200 for POST to the /messaging endpoint with a valid payload in the Messaging SDK and Widget
- Status 401 for any error we find, which results in an unauthorized user in the SDK or Widget

## References
- [JWT Endpoint for Mobile SDK](https://develop.zendesk.com/hc/en-us/articles/360001075248-Building-a-dedicated-JWT-endpoint-for-the-Support-SDK)
- [Authenticated users in Chat SDK](https://develop.zendesk.com/hc/en-us/articles/360052354433-Enabling-authenticated-users-with-the-Chat-SDK-)
- [Authenticated Visitors in Widget](https://support.zendesk.com/hc/en-us/articles/360022185314-Enabling-authenticated-visitors-in-the-Chat-widget)
- [Authenticating Messaging Widget](https://developer.zendesk.com/documentation/zendesk-web-widget-sdks/sdks/web/sdk_api_reference/#authentication)
 
## SDK
The Zendesk Mobile SDK requires a JWT endpoint for authenticating its users.
It sends a payload to the endpoint. The payload contains a user identifier.

This can either be:
- the UUID of the user in the authentication service (which requires an extension of this script to retrieve the email and name of the user)
- an email adres of the user. 

We use the latter in our script for simplicities sake.

    {"user_token":"john@example.com"}
    
The endpoint is found at https://jwt.verschoren.com/sdk

It returns the following when handling a POST

### Status 201

     {"jwt": "abc123def456...."}

which has a decoded structure of

     {
       "jti": random_string,
       "iat": current_time_in_seconds,
       "name": user_token,
       "email": user_token
     }

### Status 401
If the past token can't be found we send a status 401 which will be handled as unauthorized by the SDK

## Chat or Widget
The Zendesk Chat SDK and the Widget requires a JWT endpoint for authenticating its users.
It sends a payload to the endpoint. The payload contains email, name and an external_id
The external_id can be anything but is preferably the UUID of the user in the authentication service so we can extend the code to validate the user.

    {"name":"John Appleseed","email":"john@example.com","external_id":"123456"}
    
The endpoint is found at https://jwt.verschoren.com/chat

It returns the following when handling a POST

### Status 201

     {"jwt": "abc123def456...."}

which has a decoded structure of

     {
       "iat": current_time_in_seconds,
       "name": name,
       "email": email,
       "external_id": external_id,
     }

### Status 401
If the past token can't be found we send a status 401 which will be handled as unauthorized by the SDK

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


# Zendesk Widget Branding

![image](https://github.com/verschoren/zendesk_widget/assets/894026/9c178006-8383-4141-9e13-976bff806e84)
See this article on [Internal Note](https://github.com/verschoren/zendesk_widget_branding/blob/master/internalnote.com/ticket-sendmessage-for-support-apps)

![image](https://github.com/verschoren/zendesk_widget/assets/894026/78f933b5-2049-4b0a-bcd8-a759f4a29de3)

Demo on https://widget.internalnote.com/classiccustom.html
