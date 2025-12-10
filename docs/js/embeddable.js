$(document).ready(function () {
    var meta = $('meta[name=loader]').attr("content");
    const options = [
        {
            "name": "overlay",
            "message": `Click the <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg> icon to view an overlayed widget`
        },
        {
            "name": "multicolumn",
            "message": `Click <strong>Get Support</strong> to view a full a columnised widget`
        },
        {
            "name": "intranet",
            "message": `Discover an embedded chat right within this page`
        },
        {
            "name": "embed",
            "message": `Click get support and discover the embedded chat.`
        },
        {
            "name": "draggable",
            "message": `Click get Help and drag the widget around.`
        },
    ]

    var option = options.find(o => o.name === meta);

    const banner = `
        <div class="fixed w-full flex h-16 justify-between items-center gap-x-6 bg-matcha px-6 py-2.5 dark:bg-gray-800 z-10">
            <a href="index.html" class="flex gap-4 items-center">
                <img class="h-8 w-auto" src="https://demo.internalnote.com/img/zendesk.svg" alt="Zendesk">
                <img class="h-8 w-auto" src="https://demo.internalnote.com/img/logo.svg" alt="Internal Note">
            </a>    
            <p class="text-sm/6 text-licorice dark:text-white flex gap-1">
                ${option ? option.message : ''}
            </p>
            <a href="https://internalnote.com/embeddable-zendesk-widget?utm_source=demo_pages" class="flex-none rounded-full bg-licorice px-3.5 py-1 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 dark:bg-white/10 dark:inset-ring-white/20 dark:hover:bg-white/15 dark:focus-visible:outline-white">View article <span aria-hidden="true">&rarr;</span></a>
        </div>
    `;

    $('body').prepend(banner);
});