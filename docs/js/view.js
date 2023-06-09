//document ready
$('document').ready(function() {
    //add header
    $('body').prepend(`
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
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
      <div class="desktop_nav hidden lg:flex lg:gap-x-8 ml-8"></div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
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
              <div class="mobile_nav space-y-2 py-6"></div>
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
        { id: 'split', name: 'Messaging Widget', url: 'index.html' },
        { id: 'messaging', name: 'Authentication', url: 'index.html' },
        { id: 'customlauncher', name: 'Customize', url: 'customlauncher.html' },
        { id: 'voice', name: 'Voice', url: 'voice.html' },
        { id: 'metadata', name: ' Metadata', url: 'prefill.html' },
        { id: 'split', name: 'Classic Widget', url: '' },
        { id: 'classic', name: 'Authentication', url: 'classic.html' },
        { id: 'classiccustom', name: 'Customize', url: 'classiccustom.html' },
    ]

    //add links
    $.each(links, function(index, value) {
      if (value.id == 'split') {
        $('.desktop_nav').append(`<div class="text-sm font-bold leading-6">${value.name}</div>`);
        $('.mobile_nav').append(`<div class="-mx-3 block rounded-lg px-3 py-2 text-base font-bold leading-7 text-gray-900">${value.name}</div>`);
      } else {
        $('.desktop_nav').append(`
        <a href="${value.url}" class="text-sm font-medium leading-6 text-gray-900">${value.name}</a>
      `);
        $('.mobile_nav').append(`
        <a href="${value.url}" class="-mx-3 block rounded-lg px-3 py-2 text-base font-medium leading-7 text-gray-900 hover:bg-gray-50">${value.name}</a>
      `);
      }
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
});