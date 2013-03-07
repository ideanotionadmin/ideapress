// For an introduction to the Grid template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=232446
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    WinJS.strictProcessing();

    app.addEventListener("activated", function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            metroPress.checkLocalStorageSchemaVersion();
            WinJS.UI.processAll();
        }
    });
    
    WinJS.Application.onsettings = function (e) {

        //Adding the About page
        e.detail.applicationcommands = {
            "help": { title: "About Us", href: "/pages/about-flyout.html" }
        };
        WinJS.UI.SettingsFlyout.populateSettings(e);

        //Adding the Privacy Policy        
        var appCommands = e.detail.e.request.applicationCommands;
        var appCmdPrivacy = new Windows.UI.ApplicationSettings.SettingsCommand("privacy", "Privacy Policy", function () {
            window.open(metroPress.options.privacyUrl);
        });
        appCommands.append(appCmdPrivacy);       
    };

    app.start();
})();
