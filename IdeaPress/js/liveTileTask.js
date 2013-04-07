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

                    Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().update(liveTiles[i].tile);
                }
            }
            settings.values["LiveTileLastComplete"] = new Date();
            close();
        }, function () { settings.values["LiveTileLastFailed"] = new Date();; close(); }, function () { });
    }

    doWork();
})();



