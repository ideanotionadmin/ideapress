/*!
	IdeaPress v2.0.1 (Wednesday, June 5, 2013) | ideapress.me/license 
*/

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
                appTitleImage: '/images/title.png',                      // App title image (approx. 600px x 80px)
                appTitle: "Make Web Not War",             // App title text
                cacheTime: 3600000,                       // Global cache time to try fetch   
                mainUrl: "http://www.webnotwar.ca/",        // Main promoting site
                privacyUrl: "http://www.webnotwar.ca/make-web-not-war-windows-8-application-privacy-policy/",      // Privacy URL
                useSnapEffect: true,
                fetchOnPostInit: false,                           //only for selfhosted sites
                modules: [
                    { name: wordpressModule, options: { apiUrl: 'http://www.webnotwar.ca/', title: "News", typeId: wordpressModule.MOSTRECENT } },
                    { name: wordpressModule, options: { apiUrl: 'http://www.webnotwar.ca/', title: "Bookmark", typeId: wordpressModule.BOOKMARKS } },
                    { name: wordpressModule, options: { apiUrl: 'http://www.webnotwar.ca/', title: "Featured", typeId: wordpresscomModule.CATEGORY, categoryId: 530, isHero: true } },
                    { name: wordpressModule, options: { apiUrl: 'http://www.webnotwar.ca/', title: "Open Data", typeId: wordpresscomModule.CATEGORY, categoryId: 1729, isHero: true } },
                    { name: wordpressModule, options: { apiUrl: 'http://www.webnotwar.ca/', title: "Events", typeId: wordpresscomModule.CATEGORY, categoryId: 4, isHero: true } },
                    { name: wordpressModule, options: { apiUrl: 'http://www.webnotwar.ca/', title: "Training &amp; Webcasts", typeId: wordpresscomModule.CATEGORY, categoryId: 350, isHero: true } },
                    { name: wordpressModule, options: { apiUrl: 'http://www.webnotwar.ca/', title: "Featured", typeId: wordpresscomModule.CATEGORY, categoryId: 530, isHero: true } },
                ],
                searchModule: { name: wordpressModule, options: { apiUrl: 'http://www.webnotwar.ca/', title: "Search" } },
                liveTileModule: { name: wordpressModule, options: { apiUrl: 'http://www.webnotwar.ca/', title: "Live Tile", squareTileType: Windows.UI.Notifications.TileTemplateType.tileSquarePeekImageAndText04, wideTileType: Windows.UI.Notifications.TileTemplateType.tileWideImageAndText01 } },
            };
        });
})();
