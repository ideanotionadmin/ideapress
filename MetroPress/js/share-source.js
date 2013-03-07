(function () {
    function initializeShareSource() {
        setupShare();
    }

    function setupShare() {
        var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
        dataTransferManager.addEventListener("datarequested", function (e) {
            var request = e.request;
            uriDataRequestedHandler(request);
        });
    }
   
    function showShareUI() {
        // if we ever want a share button, just assign this onlick
        Windows.ApplicationModel.DataTransfer.DataTransferManager.showShareUI();
    }

    function uriDataRequestedHandler(request) {

        var postEl = document.querySelector('.mp-share');
        if (null != postEl) {           

            var permalink = postEl.getAttribute('permalink');
            if(!permalink)
                return; // can't find the matching localStorage post for extra props

            request.data.setUri(new Windows.Foundation.Uri(permalink));
            request.data.properties.title = postEl.getAttribute('title');
            request.data.properties.description = postEl.innerText.substring(0, 50);
        } else {
            // we're not in a single post view, let's promote your site
            request.data.setUri(new Windows.Foundation.Uri(metroPress.options.mainUrl));
            request.data.properties.title = metroPress.options.appTitle;
            request.data.properties.description = metroPress.options.appTitle;
        }
    }

    document.addEventListener("DOMContentLoaded", initializeShareSource, false);
})();