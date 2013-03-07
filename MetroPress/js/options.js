(function () {
    "use strict";

    metroPress.importModulesAndSetOptions(
        /* import module */
        ["/modules/wordpress/js/wp.module.js", "/modules/wordpressCom/js/wpcom.module.js"],
        /* MetroPress options */
        function() {
            metroPress.options = {
                appTitleImage: null,                      // App title image
                appTitle: "Metro Press",                  // App title text
                cacheTime: 3600000,                       // Global cache time to try fetch   
                mainUrl: "http://ideanotion.net",         // Main promoting site
                privacyUrl: "http://ideanotion.net",      // Privacy URL
                modules: [
                    { name: wordpressModule, options: { apiUrl: 'http://ideanotion.net/', title: "Pages", categoryId: wordpressModule.PAGES, pageIds: [2, 546, 565] } },
                    { name: wordpressModule, options: { apiUrl: 'http://ideanotion.net/', title: "Recent News", categoryId: wordpressModule.MOSTRECENT } },
                    { name: wordpressModule, options: { apiUrl: 'http://ideanotion.net/', title: "Bookmark", categoryId: wordpressModule.BOOKMARKS } },
                    { name: wordpresscomModule, options: { siteDomain: 'wordpressmetro.wordpress.com', title: "Pages", categoryId: wordpresscomModule.PAGES, pageIds: [2, 9], clientId: '2131', clientSecret: 'b8OEIPyqH113smvoCpgrShM3wakwYALgPOoFUn3X8PA9Y3l2hslQCCKev51VvHsR' } },
                    { name: wordpresscomModule, options: { siteDomain: 'wordpressmetro.wordpress.com', title: "Recent News", categoryId: wordpresscomModule.MOSTRECENT, clientId: '2131', clientSecret: 'b8OEIPyqH113smvoCpgrShM3wakwYALgPOoFUn3X8PA9Y3l2hslQCCKev51VvHsR' } },
                    { name: wordpresscomModule, options: { siteDomain: 'wordpressmetro.wordpress.com', title: "Tech", categoryId: "tech", clientId: '2131', clientSecret: 'b8OEIPyqH113smvoCpgrShM3wakwYALgPOoFUn3X8PA9Y3l2hslQCCKev51VvHsR' } },
                    { name: wordpresscomModule, options: { siteDomain: 'wordpressmetro.wordpress.com', title: "Bookmark", categoryId: wordpresscomModule.BOOKMARKS, clientId: '2131', clientSecret: 'b8OEIPyqH113smvoCpgrShM3wakwYALgPOoFUn3X8PA9Y3l2hslQCCKev51VvHsR' } }
                ],
                searchModule: { name: wordpressModule, options: { apiUrl: 'http://ideanotion.net/', title: "Search" } },
                liveTileModule: { name: wordpressModule, options: { apiUrl: 'http://ideanotion.net/', title: "Live" } },
            };
        });
})();
