(function () {
	"use strict";

	WinJS.UI.Pages.define("/pages/hub.html", {
        ready: function (element, options) {
            WinJS.UI.Animation.enterPage(document.querySelector('header'), { top: '0px', left: '200px' });
            var self = this;
            document.getElementsByClassName("pagetitle")[0].innerHTML = metroPress.options.appTitle;

            if (metroPress.options.appTitleImage) {
                document.getElementsByClassName("titleImage")[0].src = metroPress.options.appTitleImage;
                document.querySelector('header').className = 'showImage';
            }          
            var elem = document.querySelector('#hub-content');
            
            // initialize MetroPress modules
            if (!metroPress.initialized) {
                metroPress.initModules(elem);
                metroPress.initialized = true;
            }
            
            var promises = metroPress.renderModules(elem);
            

            WinJS.Promise.join(promises).done(function () {
                setTimeout(function () { self.updateLayout(element, Windows.UI.ViewManagement.ApplicationView.value); }, 1000);
            });

            // scroll background
            document.getElementById('hub-content').addEventListener("scroll", metroPress.scrollBackground);

            self.loadingComplete(element, options);
        },


        loadingComplete: function (element, options) {
            document.getElementById("refresh").addEventListener("click", metroPress.refresh, false);            
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState) {                        
            metroPress.update(element, viewState);
        },        
    });
})();
