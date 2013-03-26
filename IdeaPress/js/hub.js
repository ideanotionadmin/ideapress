/*
IdeaPress Version 2.0
File: hub.js
Author: IdeaNotion
Description: Controls the hub.html page, and intialize the modules.
*/
(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/hub.html", {
        ready: function (element, options) {
            WinJS.UI.Animation.enterPage(document.querySelector('header'), { top: '0px', left: '200px' });
            var self = this;
            document.getElementsByClassName("pagetitle")[0].innerHTML = ideaPress.options.appTitle;

            if (ideaPress.options.appTitleImage) {
                document.getElementsByClassName("titleImage")[0].src = ideaPress.options.appTitleImage;
                document.querySelector('header').className = 'showImage';
            }
            var elem = document.querySelector('#hub-content');

            // initialize IdeaPress modules
            if (!ideaPress.initialized) {
                ideaPress.initModules(elem);
                ideaPress.initialized = true;
            }

            var promises = ideaPress.renderModules(elem);


            WinJS.Promise.join(promises).done(function () {
                setTimeout(function () { self.updateLayout(element, Windows.UI.ViewManagement.ApplicationView.value); }, 1000);

                // scroll background
                document.getElementById('hub-content').addEventListener("scroll", self.scrolling);                               
            });

            self.loadingComplete(element, options);
        },


        loadingComplete: function (element, options) {
            document.getElementById("refresh").addEventListener("click", ideaPress.refresh, false);
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState) {
            ideaPress.update(element, viewState);
        },

        timeoutHandle : null,
        
        scrolling: function (element) {
            ideaPress.scrollBackground(element);
            if (document.querySelector('#hub-content').scrollLeft / document.querySelector('#hub-content').offsetWidth > 0.5 ||
                document.querySelector('#hub-content').scrollTop / document.querySelector('#hub-content').offsetHeight > 0.5) {
                ideaPress.updateRemaining(element, Windows.UI.ViewManagement.ApplicationView.value);
            }
            if (this.timeoutHandle)
                window.clearTimeout(this.timeoutHandle);

            var self = this;
            this.timeoutHandle = setTimeout(function () {
                ideaPress.snapEffect();
                self.timeoutHandle = null;
            }, 200);
        },        
    });
})();
