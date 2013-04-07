/*
IdeaPress Version 2.0
File: core.js
Author: IdeaNotion
Description: Control and maintain core logics of the application
*/
var ideaPress = {
    // Change Storage Version to empty the local storage
    localStorageSchemaVersion: '20130201-2',
    modules: [],
    initialized: false,
    accessToken: null,
    maxConcurrent: 6,
    globalFetch: false,
    loadRemaining: false,
    useSnapEffect: false,
    disableIframe: true,
    useScrollingBackground: false,

    // Initialize all modules
    initModules: function () {
        // register all the modules defined in options.js
        for (var i in this.options.modules) {
            var module = this.options.modules[i].name;
            var options = this.options.modules[i].options;
            this.modules.push(new module(this, options));
        }

        // register search module
        if (this.options.searchModule) {
            module = this.options.searchModule.name;
            options = this.options.searchModule.options;
            this.searchModule = new module(this, options);
            this.searchModule.searchInit();
        }

        // register live tile background timer task
        if (this.options.liveTileModule) {
            this.registerTask("Live Tile");
        }
        else {
            this.unregisterTask("Live Tile");
        }

        this.useSnapEffect = this.options.useSnapEffect;
        if (this.options.useScrollingBackground != undefined)
            this.useScrollingBackground = this.options.useScrollingBackground;
    },

    // Call each module to render its content on hub.html
    renderModules: function (elem) {
        var promises = [];
        var count = 1;
        elem.style.msGridColumns = "";
        for (var i in this.modules) {
            elem.style.msGridColumns = elem.style.msGridColumns + " auto";
            var container = document.createElement("div");
            container.style.msGridColumn = count++;
            container.className = "mp-module";
            container.className = "mp-module mp-module-" + i;
            elem.appendChild(container);
            promises.push(this.modules[i].render(container));
        }
        return promises;
    },

    // Call each module to update its content on hub.html
    update: function (element, viewState) {
        var promises = new Array();
        var m = this.modules.length;
        if (!ideaPress.loadRemaining)
            m = Math.min(ideaPress.maxConcurrent, this.modules.length);

        for (var i = 0; i < m; i++) {
            promises.push(this.modules[i].update(viewState));
        }
        ideaPress.globalFetch = WinJS.Promise.join(promises).then(function () {
            ideaPress.globalFetch = false;
        });
    },


    // Call each module to update its content on hub.html
    updateRemaining: function (element, viewState) {
        if (!ideaPress.loadRemaining && this.modules.length > ideaPress.maxConcurrent) {
            ideaPress.loadRemaining = true;
            var promises = new Array();
            for (var i = ideaPress.maxConcurrent; i < this.modules.length; i++) {
                promises.push(this.modules[i].update(viewState));
            }
            ideaPress.globalFetch = WinJS.Promise.join(promises).then(function () {
                ideaPress.globalFetch = false;
            });
        }
    },

    // Call each module to refresh its content or data store
    refresh: function () {
        for (var i in ideaPress.modules) {
            ideaPress.modules[i].refresh(Windows.UI.ViewManagement.ApplicationView.value);
        }
        document.getElementById('appbar').winControl.hide();
    },

    // Call each module to cancel any operation    
    cancel: function () {
        for (var i in ideaPress.modules) {
            ideaPress.modules[i].cancel();
        }
        if (ideaPress.searchModule)
            ideaPress.searchModule.cancel();
        if (ideaPress.globalFetch)
            ideaPress.globalFetch.cancel();
    },

    // Override the onClick for all the links and launch content in an iframe 
    iframePostLinks: function () {
        var links = document.querySelectorAll('.content a');
        for (var i = 0; i < links.length; i++) {
            links[i].onclick = undefined;
            links[i].addEventListener('click', function (e) {
                e.preventDefault();
                if (Windows.UI.ViewManagement.ApplicationView.value == Windows.UI.ViewManagement.ApplicationViewState.snapped)
                    top.location.href = this.getAttribute('href');
                else
                    ideaPress.renderIframeView(this.getAttribute('href'));
            });
        }
    },

    // Render content in an iframe
    renderIframeView: function (href) {
        document.getElementById('appbar').winControl.hide();
        if (ideaPress.disableIframe) {
            top.location.href = href;
            return;
        }

        var iframe = document.createElement("iframe");
        var backbar = document.createElement("div");
        var loader = document.createElement('progress');

        document.body.appendChild(iframe);
        iframe.setAttribute('src', href);
        iframe.setAttribute('id', 'external-link');

        loader.setAttribute('id', 'iframe-loader');
        loader.setAttribute('class', 'win-ring');

        document.body.appendChild(loader);
        document.body.appendChild(backbar);

        backbar.setAttribute('id', 'backbar');
        var backlink = document.createElement("button");
        backlink.setAttribute('id', 'backlink');
        backbar.appendChild(backlink);
        backlink.setAttribute('class', 'win-backbutton');

        ideaPress.toggleElement(document.getElementById('like'), 'hide');
        ideaPress.toggleElement(document.getElementById('home'), 'hide');

        document.querySelector("button#viewblog span.win-label").innerHTML = 'View in Browser';
        WinJS.Utilities.addClass(document.querySelector("button#viewblog"), 'open-in-browser');

        // hook up the back button        
        backlink.addEventListener('click', function (e) {
            e.preventDefault();
            loader.setAttribute('class', 'hide');
            iframe.setAttribute('class', 'loaded');
            backlink.removeNode();
            iframe.removeNode();
            backbar.removeNode();
            loader.removeNode();
            ideaPress.toggleElement(document.getElementById('like'), 'show');
            ideaPress.toggleElement(document.getElementById('home'), 'show');

            document.querySelector("button#viewblog span.win-label").innerHTML = 'View Blog';
            WinJS.Utilities.removeClass(document.querySelector("button#viewblog"), 'open-in-browser');
        });

        iframe.addEventListener('load', function () {
            loader.setAttribute('class', 'hide');
            iframe.setAttribute('class', 'loaded');
        });
    },

    // Check local storage schema version
    checkLocalStorageSchemaVersion: function () {
        if (null == localStorage || null == localStorage.schemaVersion || localStorage.schemaVersion != this.localStorageSchemaVersion)
            ideaPress.clearLocalStorage();
    },

    // Clear all local storage
    clearLocalStorage: function () {
        localStorage.clear();
        localStorage.schemaVersion = this.localStorageSchemaVersion;
    },

    // Import javascripts
    importModulesAndSetOptions: function (urls, options) {
        // importScripts  is only defined for Web Worker Scope (background task)
        // hence, we have another way to import javascripts for the main thread
        if (typeof importScripts == "function") {
            for (var i in urls)
                importScripts(urls[i]);
            options();
        } else {
            for (var j in urls) {
                var tag = document.createElement("script");
                tag.type = "text/javascript";
                tag.src = urls[j];
                document.head.appendChild(tag);
            }
            WinJS.UI.processAll().then(options, function () { }, function () { });
        }
    },

    // Register Live Tile background task 
    registerTask: function (taskName) {
        var background = Windows.ApplicationModel.Background;
        if (!ideaPress.getRegisteredTask(taskName)) {
            var taskBuilder = new background.BackgroundTaskBuilder();

            // poll for data
            var hourlyTrigger = new background.MaintenanceTrigger(15, false);
            var internetCondition = new background.SystemCondition(background.SystemConditionType.internetAvailable);

            taskBuilder.setTrigger(hourlyTrigger);
            taskBuilder.taskEntryPoint = "js\\liveTileTask.js";
            taskBuilder.name = taskName;
            taskBuilder.addCondition(internetCondition);

            try {
                taskBuilder.register();
            } catch (e) {
                if (WinJS.log)
                    WinJS.log("error " + e.message);
            }
        }
    },

    // Unregister Live Tile background task 
    unregisterTask: function () {
        var task = getRegisteredTask();
        if (task) {
            task.unregister(true);
        } else {
        }
    },

    // Get registered Live Tile background task 
    getRegisteredTask: function (taskName) {
        var iter = Windows.ApplicationModel.Background.BackgroundTaskRegistration.allTasks.first();
        var hascur = iter.hasCurrent;
        while (hascur) {
            var cur = iter.current.value;
            if (cur.name === taskName) {
                return cur;
            }
            hascur = iter.moveNext();
        }
        return null;
    },

    // Handle live tile callback
    getLiveTile: function () {
        var self = this;
        return new WinJS.Promise(function (comp, err, prog) {
            var module = self.options.liveTileModule.name;
            var options = self.options.liveTileModule.options;
            var liveModule = new module(this, options);

            liveModule.getLiveTileList().then(function (r) {
                comp(r);
            }, function (e) { err(e); }, function (m) { prog(m); });
        });
    },

    // Scroll background image
    scrollBackground: function (e) {
        if (ideaPress.useScrollingBackground) {

            var elem = e.currentTarget;
            var percent = elem.scrollLeft / (elem.scrollWidth - elem.clientWidth) * 100;
            setImmediate(function () {
                document.body.style["background-position-x"] = percent + "%";
            });
        }
    },

    // Set access token
    setAccessToken: function (accessToken) {
        this.accessToken = accessToken;
    },

    // Get access token
    getAccessToken: function () {
        return this.accessToken;
    },

    // Helper method to convert DateTime to readable format
    timeSince: function (date) {
        var seconds = Math.floor((new Date().getTime() / 1000) - (new Date(date).getTime() / 1000));

        var interval = Math.floor(seconds / 31536000);
        var timeago;

        if (interval >= 1) {
            timeago = interval + " year";
        } else {
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                timeago = interval + " month";
            } else {
                interval = Math.floor(seconds / 86400);
                if (interval >= 1) {
                    timeago = interval + " day";
                } else {
                    interval = Math.floor(seconds / 3600);
                    if (interval >= 1) {
                        timeago = interval + " hour";
                    } else {
                        interval = Math.max(1, Math.floor(seconds / 60));
                        timeago = interval + " minute";
                    }
                }
            }
        }

        if (1 != interval)
            timeago = timeago + 's';
        return timeago;
    },

    // Helper method to escape illegal characters
    decodeEntities: function (s) {
        if (typeof document == "undefined") {
            return s;
        }
        var str, temp = document.createElement('p');
        temp.innerHTML = s;
        str = temp.textContent || temp.innerText;
        return str;
    },

    // Helper method to toggle element visibility
    toggleElement: function (e, status) {
        if (null == e)
            return;
        if ('hide' == status || (WinJS.Utilities.hasClass(e, 'show') && 'show' != status)) {
            if (WinJS.Utilities.hasClass(e, 'show'))
                WinJS.Utilities.removeClass(e, 'show');
            WinJS.Utilities.addClass(e, 'hide');
        } else {
            if (WinJS.Utilities.hasClass(e, 'hide'))
                WinJS.Utilities.removeClass(e, 'hide');
            WinJS.Utilities.addClass(e, 'show');
        }
    },

    // Helper method to clean img src
    cleanImageTag: function (content, url) {
        try {
            var div = document.createElement("div");
            WinJS.Utilities.setInnerHTMLUnsafe(div, content);
            var imgs = div.getElementsByTagName("img");
            for (var i = 0; i < imgs.length; i++) {
                if (imgs[i].src.indexOf("ms-appx://") > -1) {
                    imgs[i].src = url + imgs[i].src.substring(imgs[i].src.indexOf("/", 10));
                }
            }
            return div.innerHTML;
        }
        catch (e) {
            return content;
        }
    },

    // Show URL in a browser
    showUrl: function (url) {
        Windows.System.Launcher.launchUriAsync(Windows.Foundation.Uri(url));
    },
    
    // snap effect
    snapEffect: function () {
        if (ideaPress.useSnapEffect) {            
            var modules = document.getElementsByClassName("mp-module");
            for (var i in modules) {
                if (Math.abs(document.querySelector('#hub-content').scrollLeft - modules[i].offsetLeft + 116) < 60) {
                    document.querySelector('#hub-content').scrollLeft = modules[i].offsetLeft - 116;
                }
            }
        }
    }
}