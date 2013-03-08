/*
IdeaPress Version 2.0
File: options.js
Author: IdeaNotion
Description: Configures the application and the modules.  Please go to https://github.com/ideanotion/ideapress for how to apply the options
*/
(function () {
    "use strict";

    ideaPress.importModulesAndSetOptions(
        /* import module */
        ["/modules/wordpress/js/wp.module.js"],
        function() {
            ideaPress.options = {
                appTitleImage: null,                       // App title image (approx. 600px x 80px)
                appTitle: "Secrets Floral",                // App title text
                cacheTime: 3600000,                        // Global cache time to try fetch   
                mainUrl: "http://secretsfloral.com",       // Main promoting site
                privacyUrl: "http://secretsfloral.com",    // Privacy URL
                modules: [
                    { name: wordpressModule, options: { apiUrl: 'http://secretsfloral.com/', title: "Pages", typeId: wordpressModule.PAGES, pageIds: [37, 39, 31] } },
                    { name: wordpressModule, options: { apiUrl: 'http://secretsfloral.com/', title: "What Is New?", typeId: wordpressModule.MOSTRECENT, hubItemsCount: 12 } },
                    { name: wordpressModule, options: { apiUrl: 'http://secretsfloral.com/', title: "Real Wedding", typeId: wordpressModule.CATEGORY, categoryId: 4 } },
                    { name: wordpressModule, options: { apiUrl: 'http://secretsfloral.com/', title: "Special Offers", typeId: wordpressModule.CATEGORY, categoryId: 39 } },
                    { name: wordpressModule, options: { apiUrl: 'http://secretsfloral.com/', title: "Useful Tips", typeId: wordpressModule.CATEGORY, categoryId: 40 } },
                    { name: wordpressModule, options: { apiUrl: 'http://secretsfloral.com/', title: "Bookmark", typeId: wordpressModule.BOOKMARKS } },
                ],
                searchModule: { name: wordpressModule, options: { apiUrl: 'http://secretsfloral.com/', title: "Search" } },
                liveTileModule: { name: wordpressModule, options: { apiUrl: 'http://secretsfloral.com/', title: "Live Tile" } },
            };

        });
})();
