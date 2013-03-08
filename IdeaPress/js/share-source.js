/*
IdeaPress Version 2.0
File: share-source.js
Author: IdeaNotion
Description: It handles the Sharing functionality.
*/
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

        // Looks for any DOM element with class "mp-share".  If element exists, we will share the content from the element.
        // If not, we will share the mainUrl from options.js.
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
            request.data.setUri(new Windows.Foundation.Uri(ideaPress.options.mainUrl));
            request.data.properties.title = ideaPress.options.appTitle;
            request.data.properties.description = ideaPress.options.appTitle;
        }
    }

    document.addEventListener("DOMContentLoaded", initializeShareSource, false);
})();