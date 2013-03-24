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
        ["/modules/wordpress/js/wp.module.js", "/modules/wordpressCom/js/wpcom.module.js"],

        function() {
            ideaPress.options = {
                appTitleImage: null,                      // App title image (approx. 600px x 80px)
                appTitle: "IdeaPress",                    // App title text
                cacheTime: 3600000,                       // Global cache time to try fetch   
                mainUrl: "http://ideanotion.net",         // Main promoting site
                privacyUrl: "http://ideanotion.net",      // Privacy URL
                useSnapEffect : false,                     // use snapping scrolling effect
                modules: [
                    { name: wordpressModule, options: { apiUrl: 'http://abilities.ca/', title: "Pages", typeId: wordpressModule.PAGES, pageIds: [11, 381, 801, 4589] } },
                    { name: wordpressModule, options: { apiUrl: 'http://abilities.ca/', title: "Recent News", typeId: wordpressModule.MOSTRECENT } },
                    { name: wordpressModule, options: { apiUrl: 'http://abilities.ca/', title: "Bookmark", typeId: wordpressModule.BOOKMARKS } },
                    { name: wordpressModule, options: { apiUrl: 'http://abilities.ca/', title: "Blog", typeId: wordpressModule.CATEGORY, categoryId: 131 } },
                    { name: wordpressModule, options: { apiUrl: 'http://abilities.ca/', title: "Travel", typeId: wordpressModule.CATEGORY, categoryId: 31 } },
                    { name: wordpressModule, options: { apiUrl: 'http://abilities.ca/', title: "Arts", typeId: wordpressModule.CATEGORY, categoryId: 21 } },
                    { name: wordpressModule, options: { apiUrl: 'http://abilities.ca/', title: "People", typeId: wordpressModule.CATEGORY, categoryId: 11 } },
                ],
                searchModule: { name: wordpressModule, options: { apiUrl: 'http://ideanotion.net/', title: "Search" } },
                liveTileModule: { name: wordpressModule, options: { apiUrl: 'http://ideanotion.net/', title: "Live Tile", squareTileType: Windows.UI.Notifications.TileTemplateType.tileSquarePeekImageAndText04, wideTileType : Windows.UI.Notifications.TileTemplateType.tileWideImageAndText01 } },
            };
        });
})();
