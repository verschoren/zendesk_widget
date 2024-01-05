$('document').ready(function() {
    
  $('#show_menu').click(function() {
    $('#menu').removeClass('hidden');
    $('#menu_background').removeClass('transition-opacity ease-linear duration-300 from-opacity-100 to-opacity-0');
    $('#menu_background').addClass('transition-opacity ease-linear duration-300 from-opacity-0 to-opacity-100');
    $('#menu_sidebar').removeClass('transition ease-in-out duration-300 transform from-translate-x-0 to-translate-x-full');
    $('#menu_sidebar').addClass('transition ease-in-out duration-300 transform from-translate-x-full to-translate-x-0');
  });
 
  $('#hide_menu').click(function() {
    $('#menu').addClass('hidden');
    $('#menu_background').removeClass('transition-opacity ease-linear duration-300 from-opacity-0 to-opacity-100');
    $('#menu_background').addClass('transition-opacity ease-linear duration-300 from-opacity-100 to-opacity-0');
    $('#menu_sidebar').removeClass('transition ease-in-out duration-300 transform from-translate-x-full to-translate-x-0');
    $('#menu_sidebar').addClass('transition ease-in-out duration-300 transform from-translate-x-0 to-translate-x-full');

  });

  $('head').append(`
    <meta charset="UTF-8">
    <meta name="author" content="Internal Note">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta property="og:image" content="https://widget.internalnote.com/img/banner.png">
    <link href="css/style.css" rel="stylesheet">
    <link href="css/atom-one-dark.css" rel="stylesheet">
    <link rel="icon" href="img/favicon.png" type="image/x-icon">
    <script defer data-domain="jwt.internalnote.com, widget.internalnote.com" src="https://plausible.io/js/script.js"></script>
    `);

  $('main').before(`
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
    <div id="menu" class="relative z-50 lg:hidden" role="dialog" aria-modal="true">
      <div id="menu_background" class="fixed inset-0 bg-gray-900/80"></div>
  
      <div id="menu_sidebar" class="fixed inset-0 flex">
          <div class="relative mr-16 flex w-full max-w-xs flex-1">
            <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button id="hide_menu" type="button" class="-m-2.5 p-2.5">
                <span class="sr-only">Close sidebar</span>
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
    
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div class="flex h-16 shrink-0 items-center">
                    <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company">
                </div>
                <nav class="flex flex-1 flex-col">
                    <ul id="menu_mobile" role="list" class="flex flex-1 flex-col gap-6">                        
                    </ul>
                </nav>
            </div>
          </div>
      </div>
    </div>
    
    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div class="flex h-16 shrink-0 items-center">
          <img class="h-8 w-auto" src="img/logo.svg" alt="Internal Note">
          </div>
          <nav class="flex flex-1 flex-col">
            <ul id="menu_desktop" role="list" class="flex flex-1 flex-col gap-y-7"></ul>
          </nav>
      </div>
    </div>
  `);

  $('main').prepend(`
    <div class="lg:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button id="show_menu" type="button" class="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden">
          <span class="sr-only">Open sidebar</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
      </button>
      <img src="img/logo.svg" alt="Internal Note" class="h-8 w-auto">
    </div>  
  `);

  var meta = $('meta[name=loader]').attr("content");
  console.log(meta);  

  var links = [
    {
      "type": "messaging",
      "name" : "Messaging Widget",
      "links": [
        { icon: '🔐', id: 'authentication', name: 'Authentication', url: 'index.html', title: 'Zendesk Messaging Authentication', description: 'Demo page to showcase the JWT Authentication for Zendesk Messaging'},
        { icon: '🔐', id: 'guide_messaging', name: 'Guide Authentication', url: 'guide_messaging.html', title: 'Zendesk Messaging Authentication', description: 'Demo page to showcase the JWT Authentication for Zendesk Messaging'},
        { icon: '🎨', id: 'customlauncher', name: 'Customize', url: 'customlauncher.html' , title:'Custom Launcher for Messaging', description: 'Demo page to showcase the Custom Launcher for Zendesk Messaging'},
        { icon: '📞', id: 'voice', name: 'Voice', url: 'voice.html', title: 'Voice API for Messaging', description: 'Demo page to showcase the Voice API for Zendesk Messaging'},
        { icon: '🍿', id: 'metadata', name: ' Metadata', url: 'prefill.html', title: 'Metadata for Zendesk Messaging', description: 'Demo page to showcase the Metadata for Zendesk Messaging'},
        { icon: '🤖', id: 'nobot', name: ' No bot', url: 'no-bot.html', title: 'No Bot for Zendesk Messaging', description: 'Demo page to showcase using the Zendesk Messaging Widget without a Bot'},
        { icon: '✅', id: 'availability', name: ' Agent Availability', url: 'agent-availability-in-zendesk-messaging.html', title:'Agent Availability', description: 'Demo page to showcase using the Zendesk Messaging Widget with Agent Availability Checks'}
      ]
    },
    {
      "type": "classic",
      "name" : "Classic Widget",
      "links": [
      { icon: '🔐', id: 'classic', name: 'Authentication', url: 'classic.html', title: 'Zendesk Classic Widget Authentication',description: 'Demo page to showcase the JWT Authentication for the Classic Zendesk Widget'  },
      { icon: '🔐', id: 'classic_guide', name: 'Guide Authentication', url: 'guide_classic.html', title:'Zendesk Classic Widget Customization', description: 'Authentication in Zendesk Guide'},
      { icon: '🎨', id: 'classiccustom', name: 'Customize', url: 'classiccustom.html', title:'Zendesk Classic Widget Customization', description: 'Demo page to showcase the Customization for the Classic Zendesk Widget'},
      ]
    },
    { 
      "type": "proactive",
      "name" : "Proactive Messaging",
      "links": [
        { icon: '🔔', id: 'proactive', name: 'Proactive Messaging', url: 'proactive.html', title: 'Proactive Messaging', description: 'Demo page to showcase the Proactive Messaging for Zendesk Messaging'},
        { icon: '🧑🏻‍💻', id: 'proactive_contact', name: 'Contact', url: 'proactive-contact.html', title: 'Proactive Messaging', description: 'Demo page to showcase the Proactive Messaging for Zendesk Messaging'},
        { icon: '👑', id: 'proactive_contact_vip', name: 'VIP Contact', url: 'proactive-contact.html#vip', title: 'Proactive Messaging', description: 'Demo page to showcase the Proactive Messaging for Zendesk Messaging'},
        { icon: '🦖', id: 'proactive_product', name: 'Product', url: 'proactive-product.html', title: 'Proactive Messaging', description: 'Demo page to showcase the Proactive Messaging for Zendesk Messaging'},
        { icon: '🦕', id: 'proactive_product_campaign', name: 'Product with Campaign', url: 'proactive-product.html?utm_campaign=trex', title: 'Proactive Messaging', description: 'Demo page to showcase the Proactive Messaging for Zendesk Messaging'},
        { icon: '🇪🇸', id: 'proactive_es', name: 'Spanish Locale', url: 'es.html', title: 'Proactive Messaging - Spanish', description: 'Demo page to showcase the Proactive Messaging for Zendesk Messaging'},
        { icon: '🇫🇷', id: 'proactive_fr', name: 'French Locale', url: 'fr.html', title: 'Proactive Messaging - French', description: 'Demo page to showcase the Proactive Messaging for Zendesk Messaging'}
      ]
    }
  ]

  //add links
  $('#menu_mobile').html('');
  $('#menu_desktop').html('');
  $.each(links, function(index,value) {
    console.log(value.type)
    $('#menu_mobile').append(`
      <li>
        <div class="text-xs font-semibold leading-6 text-gray-400">${value.name}</div>
        <ul id="mobile_nav_ul_${value.type}" role="list" class="-mx-2 mt-2 space-y-1"></ul>
      </li>
    `);
    $('#menu_desktop').append(`
      <li>
        <div class="text-xs font-semibold leading-6 text-gray-400">${value.name}</div>
        <ul id="desktop_nav_ul_${value.type}" role="list" class="-mx-2 mt-2 space-y-1"></ul>
      </li>
    `);
    $.each(value.links, function(index,link){
      $('#mobile_nav_ul_'+value.type).append(`
        <li>
            <a href="${link.url}" class="${link.id} text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600">${link.icon}</span>
                <span class="truncate">${link.name}</span>
            </a>
        </li>
      `);
      $('#desktop_nav_ul_'+value.type).append(`
        <li>
            <a href="${link.url}" class="${link.id} text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600">${link.icon}</span>
                <span class="truncate">${link.name}</span>
            </a>
        </li>
      `);
      if(link.id == meta){
        $('.'+link.id).addClass('bg-gray-50 text-indigo-600');
        $('.'+link.id).removeClass('text-gray-700 hover:text-indigo-600 hover:bg-gray-50');
        $('head').append(`<title>Internal Note - ${link.title}</title>`);
        $('head').append(`<meta name="description" content="${link.description}">`);
      }
    });
  });

  $('main').append(`
    <footer class="w-full bg-white fixed bottom-0" aria-labelledby="footer-heading">
      <div class="border-t border-gray-900/10 p-4">
        <p class="text-xs leading-5 text-gray-500">&copy; 2023 Internal Note, Inc. All rights reserved.</p>
      </div>
    </footer>  
  `)

  $('main').append(`
    <div class="pointer-events-none fixed inset-x-0 top-2 sm:flex sm:justify-center sm:px-4 sm:pb-3 lg:px-4 z-50">
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