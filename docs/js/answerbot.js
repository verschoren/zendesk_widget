$('body').on('click', '#enquiry', function(){
    var comment = $('#comment').val();

    var payload = {
        "enquiry": comment,
        "locale": "en-us",
        "reference": "internal-note-demo"
    }

    var settings = {
        "url": "https://answer-bot-demo.verschoren.workers.dev/recommendations",
        "method": "POST",
        "secure": true,
        "headers": {
            "Content-Type": "application/json",
        },
        "data": JSON.stringify(payload),
    };

    $.ajax(settings).done(function (response) {
        $('#title').html('Results for: ' + comment)
        $('#list').html('');
        $('#enquiry_code').html(`<code class="language-json">${JSON.stringify(payload, null, 2)}</code>`)
        $('#enquiry_code').removeClass('hidden');
        $('#return_code').html(`<code class="language-json">${JSON.stringify(response, null, 2)}</code>`)
        $('#return_code').removeClass('hidden');
        hljs.highlightAll();

        response.articles.forEach(function(article){
            $('#list').append(`
            <li data-source="${article.article_id}" class="col-span-1 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
                <div class="p-6">
                    <div class="flex items-center space-x-3 justify-between mb-4">
                        <h3 class="truncate text-sm font-medium text-gray-900">${article.title}</h3>
                        <a href="${article.html_url}" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-gray-600">
                            <path fill-rule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clip-rule="evenodd" />
                            <path fill-rule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clip-rule="evenodd" />
                        </svg>
                        </a>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 h-32 wrap-break-word">${article.snippet}</p>
                </div>
                <div data-buttons="${article.article_id}">
                    <div class="-mt-px flex divide-x divide-gray-200">
                        <div data-token="${response.interaction_access_token}" data-article="${article.article_id}" class="resolve w-1/2 p-4 flex items-center gap-2 text-sm font-medium">
                            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                            </svg>
                            <span>Mark as solved</span>
                        </div>
                        <div data-token="${response.interaction_access_token}" data-article="${article.article_id}" class="reject w-1/2 p-4 flex items-center gap-2 text-sm font-medium">
                            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                            </svg>  
                            <span>Doesn't help</span>
                        </div>
                    </div>
                </div>
            </li>
            `)
        });
    });
});

$('body').on('click', '.resolve', function(){
    var article = $(this).attr('data-article');
    var token = $(this).attr('data-token');
    console.log(article);

    var payload = {
        "article_id": article,
        "interaction_access_token": token
    }

    var settings = {
        "url": "https://answer-bot-demo.verschoren.workers.dev/resolve",
        "method": "POST",
        "secure": true,
        "headers": {
            "Content-Type": "application/json",
        },
        "data": JSON.stringify(payload),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        $(`[data-source="${article}"]`).addClass('bg-green-100');
        $(`[data-buttons="${article}"]`).hide();
        $('#resolve_code').html(`<code class="language-json">//POST to worker to resolve\n\n${JSON.stringify(payload, null, 2)}</code>`)
        $('#resolve_code').removeClass('hidden');

    });
});

$('body').on('click', '.reject', function(){
    var article = $(this).attr('data-article');
    var token = $(this).attr('data-token');
    console.log(article);

    var payload = {
        "article_id": article,
        "interaction_access_token": token,
        "reason_id": 2
    }

    var settings = {
        "url": "https://answer-bot-demo.verschoren.workers.dev/reject",
        "method": "POST",
        "secure": true,
        "headers": {
            "Content-Type": "application/json",
        },
        "data": JSON.stringify(payload),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        $(`[data-source="${article}"]`).addClass('bg-red-100');
        $(`[data-buttons="${article}"]`).hide();
        $('#reject_code').html(`<code class="language-json">//POST to worker to reject\n\n${JSON.stringify(payload, null, 2)}</code>`)
        $('#reject_code').removeClass('hidden');
    });
});
