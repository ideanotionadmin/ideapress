/*!
	IdeaPress v2.0.1 (Wednesday, June 5, 2013) | ideapress.me/license 
*/

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
            var elem = document.querySelector('#hub-container');

            // initialize IdeaPress modules
            if (!ideaPress.initialized) {
                ideaPress.initModules(elem);
                ideaPress.initialized = true;

                ideaPress.registerHero();            
            }
            if (ideaPress.heroModule) {
                WinJS.Utilities.addClass(document.getElementById("hero"), "show");
            }
            var promises = ideaPress.renderModules(elem);


            WinJS.Promise.join(promises).done(function () {
                setTimeout(function () { self.updateLayout(element, Windows.UI.ViewManagement.ApplicationView.value); }, 1000);
                ideaPress.startHero();

                // scroll background
                document.getElementById('hub-container').addEventListener("scroll", self.scrolling);                               
            });

            pingServer();
            self.loadingComplete(element, options);
        },


        loadingComplete: function (element, options) {
            document.getElementById("refresh").addEventListener("click", ideaPress.refresh, false);
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState) {
            if (document.getElementById('hub-container')) {
                var windowWidth = document.documentElement.offsetWidth;
                if (windowWidth <= 500) {
                    document.getElementById('hub-container').winControl.orientation = WinJS.UI.Orientation.vertical;
                    if (ideaPress.heroModule)
                        WinJS.Utilities.removeClass(document.getElementById("hero"), "show");
                }
                else {
                    document.getElementById('hub-container').winControl.orientation = WinJS.UI.Orientation.horizontal;
                    if (ideaPress.heroModule)
                        WinJS.Utilities.addClass(document.getElementById("hero"), "show");
                }
                ideaPress.update(element, viewState);
            }
        },
        
        timeoutHandle : null,
        
        scrolling: function (element) {
            ideaPress.scrollBackground(element);
            if (document.querySelector('#hub-container').scrollLeft / document.querySelector('#hub-container').offsetWidth > 0.5 ||
                document.querySelector('#hub-container').scrollTop / document.querySelector('#hub-container').offsetHeight > 0.5) {
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

    function pingServer() {
        //ping server
        var winStoreId = Windows.ApplicationModel.Store.CurrentApp.appId.toString();
        var appId = 1;

        if (ideaPress.options.appId) {
            appId = ideaPress.options.appId;
        }
        var packageSpecificToken;
        var nonce;
        packageSpecificToken = Windows.System.Profile.HardwareIdentification.getPackageSpecificToken(nonce);

        // hardware id, signature, certificate IBuffer objects 
        // that can be accessed through properties.
        var hardwareId = packageSpecificToken.id;
        var dataReader = Windows.Storage.Streams.DataReader.fromBuffer(hardwareId);
        var array = new Array(hardwareId.length);
        dataReader.readBytes(array);
        var machineId = array.toString();

        var appname;
        Windows.ApplicationModel.Package.current.installedLocation.getFileAsync("AppxManifest.xml").then(function (file) {
            Windows.Storage.FileIO.readTextAsync(file).done(function (text) {
                var xdoc = new Windows.Data.Xml.Dom.XmlDocument();
                xdoc.loadXml(text);
                appname = xdoc.selectNodesNS("m:Package/m:Applications/m:Application/m2:VisualElements",
                    "xmlns:m=\"http://schemas.microsoft.com/appx/2010/manifest\" xmlns:m2=\"http://schemas.microsoft.com/appx/2013/manifest\"")[0]
                    .attributes.getNamedItem("DisplayName").nodeValue;
            });
        });

        var encodedData = window.btoa(winStoreId + "::" + appname);
        
        var querystring = '/v1/' + appId + '?winStoreId=' + encodedData + '&devId=' + machineId + '&appUrl=' + ideaPress.options.mainUrl;
        var fullUrl = 'http://api.ideapress.me' + querystring;

        var headers = { "User-Agent": 'wp-window8' };
        try {
            WinJS.xhr({ type: 'GET', url: fullUrl, headers: headers }).then(function (r) {

            },
                function (e) {
                    //maybe put it in the queue
                },
                function (p) {
                    //maybe put it in the queue
                }
            );
        } catch (e) {
            //do nothing
        }
    }
})();
