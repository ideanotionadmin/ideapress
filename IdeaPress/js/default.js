/*
IdeaPress Version 2.0
File: default.js
Author: IdeaNotion
Description: Starting point of the App
*/
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            ideaPress.checkLocalStorageSchemaVersion();
            WinJS.UI.processAll();
        }
    });
    
    WinJS.Application.onsettings = function (e) {

        // Adding the About Page to the Settings Charm
        e.detail.applicationcommands = {
            "help": { title: "About Us", href: "/pages/about-flyout.html" }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);

        // Adding the Privacy Policy to the Settings Charm
        var appCommands = e.detail.e.request.applicationCommands;
        var appCmdPrivacy = new Windows.UI.ApplicationSettings.SettingsCommand("privacy", "Privacy Policy", function () {
            window.open(ideaPress.options.privacyUrl);
        });
        appCommands.append(appCmdPrivacy);       
    };

    app.start();
})();
