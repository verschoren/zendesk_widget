$('document').ready(function() {
    
  $('body').on('click', '#show_menu', function(e) {
    $('#menu').removeClass('hidden');
    $('#menu_background').removeClass('transition-opacity ease-linear duration-300 from-opacity-100 to-opacity-0');
    $('#menu_background').addClass('transition-opacity ease-linear duration-300 from-opacity-0 to-opacity-100');
    $('#menu_sidebar').removeClass('transition ease-in-out duration-300 transform from-translate-x-0 to-translate-x-full');
    $('#menu_sidebar').addClass('transition ease-in-out duration-300 transform from-translate-x-full to-translate-x-0');
  });
 
  $('body').on('click', '#hide_menu', function(e) {
    $('#menu').addClass('hidden');
    $('#menu_background').removeClass('transition-opacity ease-linear duration-300 from-opacity-0 to-opacity-100');
    $('#menu_background').addClass('transition-opacity ease-linear duration-300 from-opacity-100 to-opacity-0');
    $('#menu_sidebar').removeClass('transition ease-in-out duration-300 transform from-translate-x-full to-translate-x-0');
    $('#menu_sidebar').addClass('transition ease-in-out duration-300 transform from-translate-x-0 to-translate-x-full');
  });

  $('main').before(`
    <div id="menu" class="hidden relative z-50 md:hidden" role="dialog" aria-modal="true">
      <div id="menu_background" class="fixed inset-0 bg-gray-900/80"></div>
  
      <div id="menu_sidebar" class="bg-[#FEFAF2] fixed inset-0 flex">
          <div class="relative mr-16 flex w-full max-w-xs flex-1">
            <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button id="hide_menu" type="button" class="-m-2.5 p-2.5">
                <span class="sr-only">Close sidebar</span>
                <svg class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
    
            <div class="flex grow flex-col gap-y-5 overflow-y-autopx-6 pl-4 pb-4">
                <div class="flex h-16 shrink-0 items-center">
                  <a href="index.html"><img class="h-8 w-auto" src="img/logo.svg" alt="Internal Note"></a>    
                </div>
                <nav class="flex flex-1 flex-col">
                    <ul id="menu_mobile" role="list" class="flex flex-1 flex-col gap-6"></ul>
                </nav>
                <div class="rounded-md bg-blue-50 p-4">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800">Caching</h3>
                      <div class="mt-2 text-sm text-blue-700">
                        <p>If you experience issues triggering the proactive alerts, clear your LocalStorage and try again.</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
      </div>
    </div>
    
    <!-- Static sidebar for desktop -->
    <div class="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-72 md:flex-col">
      <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6 pb-4">
          <div class="flex h-16 shrink-0 items-center">
            <a href="index.html"><img class="h-8 w-auto" src="img/logo.svg" alt="Internal Note"></a>
          </div>
          <nav class="flex flex-1 flex-col">
            <ul id="menu_desktop" role="list" class="flex flex-1 flex-col gap-y-7"></ul>
          </nav>
          <div class="rounded-md bg-blue-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Caching</h3>
                <div class="mt-2 text-sm text-blue-700">
                  <p>If you experience issues triggering the proactive alerts, clear your LocalStorage and try again.</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  `);

  $('main').prepend(`
    <div class="md:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4px-4 sm:gap-x-6 sm:px-6 md:px-8">
      <img src="img/logo.svg" alt="Internal Note" class="h-8 w-auto">
      <button id="show_menu" type="button" class="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 md:hidden">
          <span class="sr-only">Open sidebar</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
      </button>
    </div>  
  `);

  var meta = $('meta[name=loader]').attr("content");
  console.log(meta);  

  var links = [
    {
      "type": "messaging",
      "name" : "Messaging Widget",
      "links": [
        { icon: '🔐', id: 'authentication', name: 'Authentication', url: 'messaging.html', title: 'Zendesk Messaging Authentication', description: 'Demo page to showcase the JWT Authentication for Zendesk Messaging'},
        { icon: '🔐', id: 'guide_messaging', name: 'Guide Authentication', url: 'guide_messaging.html', title: 'Zendesk Messaging Authentication', description: 'Demo page to showcase the JWT Authentication for Zendesk Messaging'},
        { icon: '🎨', id: 'customlauncher', name: 'Customize', url: 'customlauncher.html' , title:'Custom Launcher for Messaging', description: 'Demo page to showcase the Custom Launcher for Zendesk Messaging'},
        { icon: '📞', id: 'voice', name: 'Voice', url: 'voice.html', title: 'Voice API for Messaging', description: 'Demo page to showcase the Voice API for Zendesk Messaging'},
        { icon: '🍿', id: 'metadata', name: ' Metadata', url: 'prefill.html', title: 'Metadata for Zendesk Messaging', description: 'Demo page to showcase the Metadata for Zendesk Messaging'},
        { icon: '🚫', id: 'nobot', name: ' No bot', url: 'no-bot.html', title: 'No Bot for Zendesk Messaging', description: 'Demo page to showcase using the Zendesk Messaging Widget without a Bot'},
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
    },
    {
      "type": "answerbot",
      "name" : "Answer Bot",
      "links": [
        { icon: '🤖', id: 'answerbot', name: 'Answer Bot API Demo', url: 'answerbot.html', title: 'Zendesk Answer Bot Demo', description: 'Demo page to showcase theZendesk Answer Bot API'},
      ]
    },
    {
      "type": "storagelimits",
      "name" : "Storage Limits",
      "links": [
        { icon: '💾', id: 'storagelimits', name: 'Storage Calculator', url: 'storagelimits.html', title: 'Zendesk AStorage Limits Calculator', description: 'Utility page to calculate Zendesk Storage Limits'},
      ]
    }
  ]

  //add links
  $('#menu_mobile').html('');
  $('#menu_desktop').html('');


  $('body').on('click', '.list_header', function(e) {
    var target = $(this).attr('data-target');
    $('#'+target).toggleClass('hidden');
    //rotate svg in this 90 degrees
    $(this).find('svg').toggleClass('rotate-90');
  });

  $.each(links, function(index,value) {
    var list_mobile = `
    <li>
      <div class="list_header text-xs font-semibold leading-6 text-gray-500 flex justify-between items-center" data-target="mobile_nav_ul_${value.type}">
        ${value.name}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>
      </div>
      <ul id="mobile_nav_ul_${value.type}" role="list" class="hidden -mx-2 mt-2 space-y-1"></ul>
    </li>
    `

    var list_desktop = `
    <li>
      <div class="list_header text-xs font-semibold leading-6 text-gray-500 flex justify-between items-center" data-target="desktop_nav_ul_${value.type}">
        ${value.name}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
        </svg>
      </div>
      <ul id="desktop_nav_ul_${value.type}" role="list" class="hidden -mx-2 mt-2 space-y-1"></ul>
    </li>
    `
    $('#menu_mobile').append(list_mobile);
    $('#menu_desktop').append(list_desktop);
    $.each(value.links, function(index,link){
      $('#mobile_nav_ul_'+value.type).append(`
        <li>
            <a href="${link.url}" class="${link.id} text-gray-700 hover:text-white hover:bg-blue-600 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-blue-600 group-hover:text-blue-600">${link.icon}</span>
                <span class="truncate">${link.name}</span>
            </a>
        </li>
      `);
      $('#desktop_nav_ul_'+value.type).append(`
        <li>
            <a href="${link.url}" class="${link.id} text-gray-00 hover:text-blue-600 hover:bg-transparant group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                <span class="${link.id}_icon flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white text-gray-400 border-gray-200 group-hover:border-blue-600 group-hover:text-blue-600">${link.icon}</span>
                <span class="truncate">${link.name}</span>
            </a>
        </li>
      `);
      if(link.id == meta){
        $('.'+link.id+'_icon').addClass('border-blue-600 bg-blue-200');
        $('.'+link.id+'_icon').removeClass('border-gray-200 bg-white');
        $('head').append(`<title>Internal Note - ${link.title}</title>`);
        $('head').append(`<meta name="description" content="${link.description}">`);

        $('#desktop_nav_ul_'+value.type).toggleClass('hidden');
        $('#mobile_nav_ul_'+value.type).toggleClass('hidden');
        //rotate svg in this 90 degrees
        //find svg in parent of #mobile_nav_ul_${value.type}
        $('#mobile_nav_ul_'+value.type).parent().find('svg').toggleClass('rotate-90');
        $('#desktop_nav_ul_'+value.type).parent().find('svg').toggleClass('rotate-90');
      }
    });
  });
});