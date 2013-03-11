/*
IdeaPress Version 2.0
File: liveTileTask.js
Author: IdeaNotion
Description: handles the support of live tiles
*/
(function () {
    "use strict";
    importScripts("//Microsoft.WinJS.1.0/js/base.js");
    importScripts("/js/core.js");
    importScripts("/js/options.js");

    var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
    var settings = Windows.Storage.ApplicationData.current.localSettings;
    settings.values["LiveTileLastStart"] = new Date();

    function onCanceled(cancelSender, cancelReason) {
        settings.values["LiveTileLastCancelled"] = cancelReason;
    }
    backgroundTaskInstance.addEventListener("canceled", onCanceled);
    
    function doWork() {
        ideaPress.getLiveTile().then(function (liveTiles) {            
            var tileUpdateManager = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
            tileUpdateManager.enableNotificationQueue(true);
            
            if (liveTiles.length > 0)
            {
                Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().clear();

                for (var i = 0; i < Math.min(liveTiles.length, 5) ; i++) {
                    var post = liveTiles[i];

                    // Setup Wide Tile
                    var template = Windows.UI.Notifications.TileTemplateType.tileWideImageAndText01;
                    var tileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(template);
                    var tileImageElements = tileXml.getElementsByTagName("image");
                    tileImageElements[0].setAttribute("src", post.imgThumbUrl);
                    tileImageElements[0].setAttribute("alt", "Post Image");

                    var tileTextElements = tileXml.getElementsByTagName("text");
                    tileTextElements[0].appendChild(tileXml.createTextNode(post.title));

                    // Setup Square Tile
                    template = Windows.UI.Notifications.TileTemplateType.tileSquareImage;
                    var squareTileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(template);
                    var squareTileImageElements = squareTileXml.getElementsByTagName("image");
                    squareTileImageElements[0].setAttribute("src", post.imgThumbUrl);
                    squareTileImageElements[0].setAttribute("alt", "Post Image");

                    // Add Square to Long tile
                    var binding = squareTileXml.getElementsByTagName("binding").item(0);
                    var node = tileXml.importNode(binding, true);
                    tileXml.getElementsByTagName("visual").item(0).appendChild(node);

                    liveTiles.tile = new Windows.UI.Notifications.TileNotification(tileXml);
                    Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().update(liveTiles.tile);
                }
            }
            settings.values["LiveTileLastComplete"] = new Date();
            close();
        }, function () { settings.values["LiveTileLastFailed"] = new Date();; close(); }, function () { });
    }

    doWork();
})();



