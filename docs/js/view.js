//document ready
$('document').ready(function() {
    //add header
    $('body').prepend(`
      <nav class="mx-auto flex max-w-7xl justify-between lg:justify-start p-6 lg:px-8" aria-label="Global">
        <div class="flex">
          <a href="https://internalnote.com" class="-m-1.5 p-1.5">
            <img class="h-8 w-auto" src="img/logo.svg" alt="Internal Note">
          </a>
        </div>
        <div class="flex lg:hidden">
          <button id="openmenu" type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
            <span class="sr-only">Open main menu</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div class="hidden lg:inline-block lg:flex-1 space-y-4">
          <div class="desktop_nav_messaging lg:flex lg:justify-start lg:gap-x-8 ml-8"></div>
          <div class="desktop_nav_classic lg:flex lg:gap-x-8 ml-8"></div>
          <div class="desktop_nav_proactive lg:flex lg:gap-x-8 ml-8"></div>
        </div>
        <div class="hidden lg:inline-block">
          <a href="https://github.com/verschoren/zendesk_widget" class="flex items-center gap-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" target="_blank">
            <img src="img/github-mark.svg" class="h-5 inline-block" alt="GitHub">
            <span>GitHub</span>
          </a>
        </div>
      </nav>
      <!-- Mobile menu, show/hide based on menu open state. -->
      <div id="mobilemenu" class="hidden lg:hidden" role="dialog" aria-modal="true">
        <!-- Background backdrop, show/hide based on slide-over state. -->
        <div class="fixed inset-0 z-10"></div>
        <div class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div class="flex items-center justify-between">
            <a href="https://internalnote.com" class="-m-1.5 p-1.5">
              <img class="h-8 w-auto" src="img/logo.svg" alt="Internal Note">
            </a>
            <button id="closemenu" type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
              <span class="sr-only">Close menu</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-gray-500/10">
              <div class="mobile_nav_messaging space-y-2 py-6"></div>
              <div class="mobile_nav_classic space-y-2 py-6"></div>
              <div class="mobile_nav_proactive space-y-2 py-6"></div>
              <div class="py-6">
                <a href="https://github.com/verschoren/zendesk_widget" class="flex items-center gap-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" target="_blank">
                  <img src="img/github-mark.svg" class="h-5 inline-block" alt="GitHub">
                  <span>GitHub</span>
                </a>  
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    //Customlinks
    var links = [
      {
        "type": "messaging",
        "name" : "Messaging Widget",
        "links": [
          { id: 'messaging', name: 'Authentication', url: 'index.html' },
          { id: 'customlauncher', name: 'Customize', url: 'customlauncher.html' },
          { id: 'voice', name: 'Voice', url: 'voice.html' },
          { id: 'metadata', name: ' Metadata', url: 'prefill.html' },
          { id: 'nobot', name: ' No bot', url: 'no-bot.html' },
          { id: 'availability', name: ' Agent Availability', url: 'agent-availability-in-zendesk-messaging.html' }
        ]
      },
      {
        "type": "classic",
        "name" : "Classic Widget",
        "links": [
        { id: 'classic', name: 'Authentication', url: 'classic.html' },
        { id: 'classiccustom', name: 'Customize', url: 'classiccustom.html' }
        ]
      },
      { 
        "type": "proactive",
        "name" : "Proactive Messaging",
        "links": [
          { id: 'proactive', name: 'Proactive Messaging', url: 'https://proactive.internalnote.com' }
        ]
      }
    ]

    //add links
    $.each(links, function(index,value) {
      console.log(value.type)
        $('.desktop_nav_'+value.type).append(`<div class="capitalize text-sm font-bold leading-6">${value.name}</div>`);
        $('.mobile_nav_'+value.type).append(`<div class="capitalize -mx-3 block rounded-lg px-3 py-2 text-base font-bold leading-7 text-gray-900">${value.name}</div>`);
        $.each(value.links, function(index,link){
          $('.desktop_nav_'+value.type).append(`
            <a href="${link.url}" class="text-sm font-medium leading-6 text-gray-900 hover:text-blue-600">${link.name}</a>
          `);
          $('.mobile_nav_'+value.type).append(`
            <a href="${link.url}" class="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50">${link.name}</a>
          `);
        });
    });

    $('body').append(`
      <footer class="bg-white" aria-labelledby="footer-heading">
        <div class="mx-auto max-w-7xl px-6 pb-8 pt-16">
          <div class="border-t border-gray-900/10 pt-8">
            <p class="text-xs leading-5 text-gray-500">&copy; 2023 Internal Note, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>  
    `)

    $('#openmenu').click(function() {
      $('#mobilemenu').removeClass('hidden');
    });

    $('#closemenu').click(function() {
      $('#mobilemenu').addClass('hidden');
    });

    $('main').append(`
    <div class="pointer-events-none fixed inset-x-0 bottom-0 sm:flex sm:justify-center sm:px-4 sm:pb-3 lg:px-4">
        <div class="pointer-events-auto flex items-center justify-between gap-x-6 bg-gray-900 px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5 border border-gray-800 shadow-sm">
            <div type="button" class="-m-1.5 flex-none p-1.5">
                <span class="sr-only">Dismiss</span>
                <svg class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
                </svg>
            </div>
            <p class="text-sm leading-2 text-white">
                <strong class="font-semibold">Caching</strong>
                <svg viewBox="0 0 2 2" class="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>
                If you experience issues triggering the proactive alerts, clear your LocalStorage and try again.
            </p>
        </div>
    </div>
    `);
});