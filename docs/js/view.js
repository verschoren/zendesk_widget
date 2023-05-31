//document ready
$('document').ready(function() {
    //add header
    $('body').prepend(`
      <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
              <div class="flex-shrink-0">
                <a href="https://internalnote.com"></a><img class="h-10" src="img/logo.svg" alt="Internal Note"></a>
              </div>
              <div class="flex gap-16 justify-between">
                <div class="flex items-baseline space-x-4">
                  <a id="messaging" href="index.html" class="nav_item text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Messaging</a>
                  <a id="customlauncher" href="customlauncher.html" class="nav_item text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Customize Messaging</a>
                  <a id="voice" href="voice.html" class="nav_item text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Voice Messaging</a>
                </div>
                <div class="flex items-baseline space-x-4">
                  <a id="classic" href="classic.html" class="nav_item text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Classic Widget</a>
                  <a id="classiccustom" href="classiccustom.html" class="nav_item text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Customize Classic Widget</a>
                </div>
            </div>
          </div>
        </div>
      </nav>
      `);

    //get body data-name
    var body_data_name = $('body').attr('data-name');
    console.log(body_data_name);
    $('.nav_item').removeClass('text-gray-300 hover:bg-gray-700 hover:text-white').addClass('text-gray-300 hover:bg-gray-700 hover:text-white');
    $('#' + body_data_name).removeClass('text-gray-300 hover:bg-gray-700 hover:text-white').addClass('bg-gray-900 text-white');

});