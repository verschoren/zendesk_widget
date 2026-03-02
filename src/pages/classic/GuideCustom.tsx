import { useEffect } from 'react'
import { PageMetadata } from '@/types/page'

export const metadata: PageMetadata = {
  id: 'classic-guide',
  category: 'classic',
  categoryName: 'Classic Widget',
  name: 'Guide Integration',
  icon: '📖',
  path: '/classic/guide-custom',
  title: 'Guide Integration - Classic',
  description: 'Code to authenticate logged in Chat users in Guide'
}

export default function GuideCustom() {
  useEffect(() => {
    document.title = `Internal Note - ${metadata.title}`

    // Add Zendesk widget script
    const script = document.createElement('script')
    script.id = 'ze-snippet'
    script.src = 'https://static.zdassets.com/ekr/snippet.js?key=0a2feffd-e8f6-4772-96bf-2e1ae82842a9'
    script.async = true
    document.body.appendChild(script)

    // Load highlight.js for syntax highlighting
    const highlightScript = document.createElement('script')
    highlightScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js'
    highlightScript.async = true
    document.body.appendChild(highlightScript)

    highlightScript.onload = () => {
      if (window.hljs) {
        window.hljs.highlightAll()
      }
    }

    return () => {
      const existing = document.getElementById('ze-snippet')
      if (existing) existing.remove()
      if (highlightScript.parentNode) {
        highlightScript.remove()
      }
    }
  }, [])

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div>
              <h1 className="text-3xl text-licorice">{metadata.title}</h1>
              <h2 className="mt-2 text-xl text-licorice">{metadata.description}</h2>
            </div>
            <div className="justify-stretch mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
              <a
                href="https://internalnote.com/customize-and-your-zendesk-widget?utm_source=widget_demo&campaign=demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-matcha px-4 py-2 text-sm text-licorice shadow-xs"
              >
                Read more
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-32">
          <pre className="text-sm whitespace-pre-wrap rounded-lg" style={{ backgroundColor: '#282c34', padding: '20px' }}>
            <code id="codeblock" className="language-json">{`<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
{{#if signed_in}}
<script type="text/javascript">
    console.log("User Logged In");

    //Get info on current User
    var user = [];
    $.ajax({
        url: '/api/v2/users/me',
        async: false,
        dataType: 'json',
        success: function (json) {
            user = json;
        }
    });

    //get token for current user
    var jwttoken = '';
    $.ajax({
        type: "POST",
        url: 'https://jwtauth.internalnote.com/guide', //replace with your worker
        data: JSON.stringify({
          "external_id": user.user.id,
          "user_email": user.user.email,
          "user_name": user.user.name
        }),
        dataType: 'text',
        async: false,
        success: function (json) {
            jwttoken = json;
        }
    });
    console.log(jwttoken)

    //Prefill Forms and Chat
    zE('webWidget', 'identify', {
        name: user.user.name,
        email: user.user.email,
    });

    zE('webWidget', 'prefill', {
        name: {
            value: user.user.name,
            readOnly: true
        },
        email: {
            value: user.user.email,
            readOnly: true
        }
    });

    //Authenticate
    window.zESettings = {
        webWidget: {
            authenticate: {
                jwtFn: function (callback) {
                    callback(jwttoken);
                }
            }
        }
    }
</script>
{{else}}
<script>
    console.log("user logged out");
    zE(function () {
        zE.logout();
    });
    </script>
{{/if}}`}</code>
          </pre>
        </div>
      </div>
    </>
  )
}

// Extend window type for highlight.js
declare global {
  interface Window {
    hljs?: any
  }
}
