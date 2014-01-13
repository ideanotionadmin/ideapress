/*!
	IdeaPress v2.0.1 (Wednesday, June 5, 2013) | ideapress.me/license 
*/

/*
IdeaPress Wordpress.COM API module
Author: IdeaNotion
*/
var wordpresscomModule = function (ideaPress, options) {
    this.ideaPress = ideaPress;
    this.list = new WinJS.Binding.List();
    this.localStorageBookmarkKey = "wpcom-bookmark";
    this.apiURL = 'https://public-api.wordpress.com/';
    this.userAgent = 'wpc-windows8';
    this.fetching = false;
    this.loadDescription = false;

    // set constants
    this.defaultCount = 32;
    this.numberOfRelatedPosts = 4;
    this.maxPagingIndex = -1;
    this.wideTileType =  Windows.UI.Notifications.TileTemplateType.tileWideImageAndText01;
    this.squareTileType =  Windows.UI.Notifications.TileTemplateType.TileSquarePeekImageAndText04;

    this.callBackUrl = "http://www.ideanotion.net/";
    // set options
    this.title = options.title;
    this.siteDomain = options.siteDomain;
    this.typeId = options.typeId;
    this.localStorageKey = "wpcom-" + options.typeId;
    if (options.categoryId) {
        this.categoryId = options.categoryId;
        this.localStorageKey = this.localStorageKey + "-" + this.categoryId;
    }
    this.pageIds = options.pageIds;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.hubItemsCount = options.hubItemsCount;
    if (options.wideTileType)
        this.wideTileType = options.wideTileType;
    if (options.squareTileType)
        this.squareTileType = options.squareTileType;
    if (options.defaultCount)
        this.defaultCount = options.defaultCount;
    if (options.numberOfRelatedPosts)
        this.numberOfRelatedPosts = options.numberOfRelatedPosts;
    if (options.loadDescription)
        this.loadDescription = options.loadDescription;
    return this;
};

// Constant
wordpresscomModule.PAGES = 0;
wordpresscomModule.MOSTRECENT = 1;
wordpresscomModule.CATEGORY = 2;
wordpresscomModule.BOOKMARKS = 3;

/* 
============================================================================     External Methods     =============================================================//
*/
// Render main section with html
wordpresscomModule.prototype.render = function (elem) {
    var self = this;
    this.container = elem.contentElement;
    this.section = elem;
    return new WinJS.Promise(function (comp, err, prog) {
        WinJS.UI.Fragments.renderCopy("/modules/wordpressCom/pages/wpcom.module.html", self.container).done(
            function () {
                WinJS.UI.processAll(self.container);
                self.loader = self.container.querySelector("progress");
                ideaPress.toggleElement(self.loader, "show");
                comp();
            },
            function () {
                err();
            }, function () {
                prog();
            }
        );
    });
};
// Fetch data and update UI
wordpresscomModule.prototype.update = function (viewState) {
    var self = this;
    if (false !== self.fetching) {
        self.fetching.cancel();
    }

    self.fetching = self.fetch(0).then(function () {
        if (self.typeId === wordpresscomModule.BOOKMARKS) {
            if (self.list.length === 0) {
                var content = self.container.querySelector(".mp-module-content");
                content.parentNode.className = content.parentNode.className + ' hide';
                return;
            }
        }

        var listViewLayout;
        // set module title
        var title = self.container.querySelector(".wpc-title");

        title.onclick = WinJS.Utilities.markSupportedForProcessing(function () {
            self.showCategory();
        });
        var titleCount = self.container.querySelector(".wpc-title-count");

        // no header for page
        title.textContent = ideaPress.decodeEntities(self.title);
        if (self.typeId !== wordpresscomModule.PAGES) {
            titleCount.textContent = self.totalCount ? Math.max(self.list.length, self.totalCount) : self.list.length;
        }

        // set layout type
        if (viewState === Windows.UI.ViewManagement.ApplicationViewState.snapped) {
            title.textContent = '';
            titleCount.textContent = '';
            listViewLayout = new WinJS.UI.ListLayout();
        } else {
            listViewLayout = new WinJS.UI.GridLayout({
                groupInfo: function () {
                    return {
                        enableCellSpanning: true,
                        cellWidth: 10,
                        cellHeight: 10
                    };
                }
            });
        }

        // bind to list
        var listview = self.container.querySelector('.wpc-list').winControl;
        WinJS.UI.setOptions(listview, {
            itemDataSource: self.getHubList().dataSource,
            itemTemplate: self.container.querySelector('.wpc-post-template'),
            selectionMode: 'none',
            swipeBehavior: 'none',
            layout: listViewLayout,
            item: self
        });
        listview.oniteminvoked = function (e) { self.showPost(e); };
        self.fetching = false;
    }, function () {
        self.fetching = false;
    }, function () {
    });

    return self.fetching;
};
// Refresh data and update UI
wordpresscomModule.prototype.refresh = function (viewState) {
    var self = this;

    self.cancel();
    ideaPress.toggleElement(this.loader, "show");

    for (var i = 0; i < self.list.length; i++)
        self.list.pop();

    self.container.querySelector('.wpc-list').winControl.itemDataSource = null;

    self.loadFromStorage[this.localStorageKey] = null;
    self.update(viewState);
};
// Cancel any WinJS.xhr in progress
wordpresscomModule.prototype.cancel = function () {
    if (this.fetching)
        this.fetching.cancel();
};
// Search Charm initialization
wordpresscomModule.prototype.searchInit = function () {
    var appModel = Windows.ApplicationModel;
    var nav = WinJS.Navigation;
    appModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (args) { nav.navigate('/modules/wordpressCom/pages/wpcom.module.searchResults.html', args); };

};
// Live Tile
wordpresscomModule.prototype.getLiveTileList = function () {
    var queryString = 'rest/v1/sites/' + this.siteDomain + '/posts/?number=' + 5 + '&order_by=date&page=' + 1;
    var fullUrl = 'https://public-api.wordpress.com/' + queryString;
    var headers = { "User-Agent": this.userAgent };
    var self = this;

    return new WinJS.Promise(function (comp, err, prog) {

        WinJS.xhr({ type: 'GET', url: fullUrl, headers: headers }).then(function (r) {
            var data = JSON.parse(r.responseText);
            if (data.found || data.found === "0") {
                err();
                return;
            }

            var items = self.addItemsToList(data.posts);
            for (var i in items) {
                var post = items[i];

                // Setup Wide Tile
                var template = self.wideTileType;
                var tileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(template);
                var tileImageElements = tileXml.getElementsByTagName("image");
                if (tileImageElements && tileImageElements.length > 0) {
                    tileImageElements[0].setAttribute("src", post.imgThumbUrl);
                    tileImageElements[0].setAttribute("alt", "Post Image");
                }
                var tileTextElements = tileXml.getElementsByTagName("text");
                if (tileTextElements && tileTextElements.length > 0)
                    tileTextElements[0].appendChild(tileXml.createTextNode(post.title));

                // Setup Square Tile
                template = self.squareTileType;
                var squareTileXml = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(template);
                var squareTileImageElements = squareTileXml.getElementsByTagName("image");
                if(squareTileImageElements && squareTileImageElements.length > 0){
                    squareTileImageElements[0].setAttribute("src", post.imgThumbUrl);
                    squareTileImageElements[0].setAttribute("alt", "Post Image");
                }
                var squareTileTextElements = squareTileXml.getElementsByTagName("text");
                if (squareTileTextElements && squareTileTextElements.length > 0)
                    squareTileTextElements[0].appendChild(squareTileXml.createTextNode(post.title));

                // Add Square to Long tile
                var binding = squareTileXml.getElementsByTagName("binding").item(0);
                var node = tileXml.importNode(binding, true);
                tileXml.getElementsByTagName("visual").item(0).appendChild(node);

                items[i].tile = new Windows.UI.Notifications.TileNotification(tileXml);
            }
            comp(items);
        },
        function (m) {
            err(m);
        },
        function (p) {
            prog(p);
        });
    });
};

/* 
============================================================================     Module Internal Methods     =============================================================//
*/

// Fetch pages, posts or bookmarks
wordpresscomModule.prototype.fetch = function (page) {
    var self = this;
    return new WinJS.Promise(function (comp, err, prog) {
        var url = self.apiURL;
        var queryString;

        if (self.typeId === wordpresscomModule.PAGES) {
            self.getPages(page).then(function () {
                comp(0);
            }, function (m) {
                var storage = self.loadFromStorage();
                if (localStorageObject != null && storage.pages != null) {
                    var pages = storage.pages;
                    self.addPagesToList(pages);
                }

                comp();
                ideaPress.toggleElement(self.loader, "hide");
            },
                function (p) {
                    prog(p);
                });
            return;

        }

        if (self.typeId === wordpresscomModule.BOOKMARKS) {
            var bookmarks = self.getBookmarks();
            self.post_count = bookmarks.post_count;
            self.lastFetched = bookmarks.lastFetched;

            //self.list = new WinJS.Binding.List();
            var listLength = self.list.length;
            for (var i = 0; i < listLength; i++) {
                self.list.pop();
            }

            for (var j = 0; j < bookmarks.posts.length; j++) {
                bookmarks.posts[j].module = self;
                self.list.push(bookmarks.posts[j]);
            }
            self.totalCount = bookmarks.posts.length;

            ideaPress.toggleElement(self.loader, "hide");
            comp();
            return;
        } else if (self.typeId === wordpresscomModule.MOSTRECENT)
            queryString = 'rest/v1/sites/' + self.siteDomain + '/posts/?number=' + self.defaultCount + '&order_by=date&page=' + (page + 1);
        else
            queryString = 'rest/v1/sites/' + self.siteDomain + '/posts/?number=' + self.defaultCount + '&category=' + self.categoryId + '&page=' + (page + 1);


        var fullUrl = url + queryString;
        var headers = { "User-Agent": self.userAgent };
        var localStorageObject = self.loadFromStorage();

        if (self.shouldFetch(localStorageObject, page)) {
            WinJS.xhr({ type: 'GET', url: fullUrl, headers: headers }).then(function (r) {
                var data = JSON.parse(r.responseText);
                if (!data.found || data.found === "0") {
                    self.maxPagingIndex = page;
                    comp(0);
                    return;
                }

                self.totalCount = data.found;

                if (data.found > 0) {
                    self.maxPagingIndex = page;
                    var items = self.addItemsToList(data.posts);
                    localStorageObject = { 'post_count': self.totalCount, 'posts': [], 'lastFetched': new Date() };

                    for (var item in items) {
                        localStorageObject.posts.push(data.posts[item]);
                    }
                    self.saveToStorage(localStorageObject);
                }

                comp(0);
                ideaPress.toggleElement(self.loader, "hide");
            },
                function (m) {
                    localStorageObject = self.loadFromStorage();
                    if (localStorageObject != null && localStorageObject.posts != null) {
                        self.addItemsToList(localStorageObject.posts);

                        ideaPress.toggleElement(self.loader, "hide");
                        comp();
                    } else {
                        err(m);
                    }
                },
                function (p) {
                    prog(p);
                });
        } else {
            if (!localStorageObject) {
                err();
                return;
            }
            self.addItemsToList(localStorageObject.posts);

            self.lastFetched = localStorageObject.lastFetched;
            self.totalCount = localStorageObject.post_count;
            comp(0);
            ideaPress.toggleElement(self.loader, "hide");
        }

    });
};

// Check if module show call API or read from local storage
wordpresscomModule.prototype.shouldFetch = function (localStorageObject, page) {
    if (localStorageObject) {
        if (page && page > this.maxPagingIndex) {
            return true;
        }

        if (this.typeId === wordpresscomModule.PAGES) {
            if (localStorageObject.pages && localStorageObject.pages.length > 0) {
                if (new Date() - new Date(localStorageObject.lastFetched) < 360000) {
                    return false;
                }
            }
        } else {
            if (localStorageObject.posts && localStorageObject.posts.length > 0) {
                if (new Date() - new Date(localStorageObject.lastFetched) < 360000) {
                    return false;
                }
            }
        }
    }
    return true;
};

// Load from local storage
wordpresscomModule.prototype.loadFromStorage = function () {
    if (localStorage[this.localStorageKey] != null) {
        var localStorageObject = JSON.parse(localStorage[this.localStorageKey]);
        self.lastFetched = localStorageObject.lastFetched;
        return localStorageObject;
    }
    return null;
};

// Save to local storage
wordpresscomModule.prototype.saveToStorage = function (data) {
    localStorage[this.localStorageKey] = JSON.stringify(data);
};

// Navigate to Detail page
wordpresscomModule.prototype.showPost = function (eventObject) {
    var i = this.list.getAt(eventObject.detail.itemIndex);

    WinJS.Navigation.navigate("/modules/wordpressCom/pages/wpcom.module.detail.html", { item: i });
};

// Navigate to Section page
wordpresscomModule.prototype.showCategory = function () {
    WinJS.Navigation.navigate("/modules/wordpressCom/pages/wpcom.module.section.html", { category: this });
};

// generate the list for hub page
wordpresscomModule.prototype.getHubList = function () {
    var hubList = new WinJS.Binding.List();

    var h = window.innerHeight;
    var l = 6;
    if (h > 1919)
        l = 12;
    else if (h > 1199)
        l = 8;

    // override
    if (this.hubItemsCount)
        l = this.hubItemsCount;

    for (var i = 0; i < Math.min(l, this.list.length) ; i++)
        hubList.push(this.list.getAt(i));

    return hubList;
};

// Add post to list
wordpresscomModule.prototype.addItemsToList = function (jsonPosts) {
    var self = this;
    var itemArray = new Array();
    for (var key in jsonPosts) {
        var item = self.convertItem(jsonPosts[key], 'post');
        item.module = self;
        item.categories = jsonPosts[key].categories;


        item.className = "wpc-item wpc-item-" + key;

        var insert = true;
        self.list.forEach(function (value) {
            if (value.id === item.id) {
                insert = false;
            }
        });
        if (insert) {
            self.list.push(item);
            itemArray.push(item);
        }
    }
    return itemArray;

};

// Add page to list
wordpresscomModule.prototype.addPagesToList = function (jsonPages) {
    var self = this;
    var itemArray = new Array();

    for (var index in jsonPages) {
        var item = jsonPages[index];

        item.module = self;

        item.className = "wpc-item wpc-item-" + index;

        var insert = true;
        self.list.forEach(function (value) {
            if (value.id === item.id) {
                insert = false;
            }
        });
        if (insert) {
            self.list.push(item);
            itemArray.push(item);
        }

    }

    return;
};

// Translate page to local object
wordpresscomModule.prototype.convertPage = function (item, list, parentId) {
    var res = {
        type: 'page',
        title: ideaPress.decodeEntities(item.title),
        id: item.ID,
        content: item.content,
        timestamp: item.date.substr(0, 10),
        permalink: item.URL.replace(/^https:/, 'http:'),
        date: item.date.replace(' ', 'T'),
        authorId: item.author.ID,
        authorName: item.author.name,
        comments: item.comments,
        parentId: parentId,
        hasChildren: false
    };

    res.description = "";
    // get the first image from attachments
    res.imgUrl = 'ms-appx:/images/blank.png';
    res.imgThumbUrl = 'ms-appx:/images/blank.png';

    if (item.featured_image) {
        res.imgUrl = item.featured_image;
        res.imgThumbUrl = item.featured_image + "?h=220";  // TODO: resize based on CSS size?
    }
    else {
        for (var i in item.attachments) {
            if (item.attachments[i].URL) {
                res.imgUrl = item.attachments[i].URL;
                res.imgThumbUrl = item.attachments[i].URL + "?h=220";  // TODO: resize based on CSS size?
                break;
            }
        }
    }

    var imgUrlStyle = res.imgThumbUrl;
    res.imgUrlStyle = "url('" + imgUrlStyle + "')";

    // we are ok as long as Wordpress doesn't allow cyclic parent-children relationship!
    for (var j in item.children) {
        this.convertPage(item.children[j], list, res.id);
        res.hasChildren = true;
    }
    res.subtitle = "";
    if (this.pageIds.length === 0 || this.pageIds.indexOf(res.id) > -1) {
        list.push(res);
    }
    return;
};

// Translate Post to local object
wordpresscomModule.prototype.convertItem = function (item, type) {
    var res = {
        type: type,
        title: ideaPress.decodeEntities(item.title),
        id: item.ID,
        content: item.content,
        timestamp: item.date.substr(0, 10),
        permalink: item.URL.replace(/^https:/, 'http:'),
        date: item.date.replace(' ', 'T'),
        authorId: item.author.ID,
        authorName: item.author.name,
        comments: item.comments
    };
    
    if (self.document && self.loadDescription) {

        var div = document.createElement("div");
        //div.innerHTML = item.content;
        WinJS.Utilities.setInnerHTMLUnsafe(div, res.content);


        res.description = div.textContent || div.innerText || "";

        if (res.description) {
            if (res.description.length > 180) {
                res.description = res.description.substr(0, 177) + "...";
            }
        } else {
            res.description = "";
        }
    } else {
        res.description = "";
    }

    // get the first image from attachments
    res.imgUrl = 'ms-appx:/images/blank.png';
    res.imgThumbUrl = 'ms-appx:/images/blank.png';

    if (item.featured_image) {
        res.imgUrl = item.featured_image;
        res.imgThumbUrl = item.featured_image + "?h=220";  // TODO: resize based on CSS size?
    }
    else {
        for (var i in item.attachments) {
            if (item.attachments[i].URL) {
                res.imgUrl = item.attachments[i].URL;
                res.imgThumbUrl = item.attachments[i].URL + "?h=220";  // TODO: resize based on CSS size?
                break;
            }
        }
    }

    var imgUrlStyle = res.imgThumbUrl;
    res.imgUrlStyle = "url('" + imgUrlStyle + "')";

    var subtitle = '';
    for (var j in item.categories) {
        subtitle = subtitle + ', ' + ideaPress.decodeEntities(item.categories[j].name);
    }
    res.subtitle = subtitle.substring(2);

    return res;

};

// Fetch pages from API
wordpresscomModule.prototype.getPages = function (page) {
    var self = this;
    return new WinJS.Promise(function (comp, err, prog) {

        var url = self.apiURL;
        var queryString = 'rest/v1/sites/' + self.siteDomain + '/posts/';
        var fullUrl = url + queryString;
        var headers = { "User-Agent": self.userAgent };
        var localStorageObject = self.loadFromStorage();

        if (!self.shouldFetch(localStorageObject, page)) {
            if (!localStorageObject) {
                err();
                return;
            }
            var pages = [];
            for (var i in localStorageObject.pages) {
                self.convertPage(localStorageObject.pages[i], pages, 0);
            }
            self.addPagesToList(pages);


            self.lastFetched = localStorageObject.lastFetched;
            self.totalCount = localStorageObject.page_count;

            comp();
            ideaPress.toggleElement(self.loader, "hide");

        } else {
            WinJS.xhr({ type: 'GET', url: fullUrl, headers: headers }).then(function () {
                var localPages = new Array();

                var promises = new Array();
                var data = [];
                for (var j = 0; j < self.pageIds.length; j++) {
                    promises.push(WinJS.xhr({ type: 'GET', url: url + queryString + self.pageIds[j], headers: headers }).then(function (r) {
                        data.push(JSON.parse(r.responseText));

                        self.pagesFetched = new Date();
                    },
                            // If no internet connection, let it go, later will fetch it
                            function (f) {
                                err(f);
                            },
                            function (p) {
                                prog(p);
                            })
                    );
                }

                // Wait for all fetch to complete
                WinJS.Promise.join(promises).then(function () {
                    for (var k in data) {
                        self.convertPage(data[k], localPages, 0);
                    }
                    localStorageObject = { 'page_count': localPages.length, 'pages': data, 'lastFetched': new Date() };
                    /*self.list.splice(0, self.list.length); //Purge old self.list when pushing

                    for (var index in localPages) {
                        self.list.push(localPages[index]);
                    }*/
                    self.addPagesToList(localPages);

                    self.saveToStorage(localStorageObject);
                    self.postsFetched = new Date();
                    ideaPress.toggleElement(self.loader, "hide");
                    comp();
                }, function (e) { err(e); }, function (p) { prog(p); });
            },
                // If no internet connection, try to fetch from the localStorage
                function () {
                    localStorageObject = self.loadFromStorage();
                    if (localStorageObject != null && localStorageObject.pages != null) {
                        pages = localStorageObject.pages;
                        self.addPagesToList(pages);
                    }


                    comp();
                    ideaPress.toggleElement(self.loader, "hide");
                },
                function (p) {
                    prog(p);
                });
        }
    });

};

// Get Bookmarks from local storage
wordpresscomModule.prototype.getBookmarks = function () {
    var self = this;
    if (!localStorage[self.localStorageBookmarkKey]) {
        localStorage[self.localStorageBookmarkKey] = JSON.stringify({ 'post_count': 0, 'posts': [], 'lastFetched': new Date() });
    }

    this.bookmarks = JSON.parse(localStorage[self.localStorageBookmarkKey]);
    return this.bookmarks;
};

// Check if a post has been bookmarked
wordpresscomModule.prototype.checkIsBookmarked = function (id) {
    var bookmarks = this.getBookmarks();
    for (var index in bookmarks.posts) {
        if (id === bookmarks.posts[index].id)
            return true;
    }
    return false;
};

// Add post to bookmark
wordpresscomModule.prototype.addBookmark = function (item) {
    var self = this;

    var bookmarks = self.getBookmarks();
    for (var index in bookmarks.posts) {
        if (item.id === bookmarks.posts[index].id) {
            return;
        }
    }
    item.module = null;
    bookmarks.posts.push(item);
    bookmarks.post_count = bookmarks.posts.length;
    localStorage[self.localStorageBookmarkKey] = JSON.stringify(bookmarks);
};

// Remove post to bookmark
wordpresscomModule.prototype.removeBookmark = function (id) {
    var self = this;
    var bookmarks = self.getBookmarks();
    for (var index in bookmarks.posts) {
        if (id === bookmarks.posts[index].id) {
            bookmarks.posts.splice(index, 1);
            break;
        }
    }
    bookmarks.post_count = bookmarks.posts.length;
    localStorage[self.localStorageBookmarkKey] = JSON.stringify(bookmarks);
};

// Submit Comment Without Access Token
wordpresscomModule.prototype.submitCommentWithoutToken = function (callback) {
    // This will be the function to call back when we get token (or not)
    var self = this;

    // https://public-api.wordpress.com/oauth2/authorize?client_id=your_client_id&redirect_uri=your_url&response_type=code

    var authorizeUrl = "https://public-api.wordpress.com/oauth2/authorize?client_id=";
    var callbackUrl = this.callBackUrl;
    authorizeUrl += this.clientId + "&redirect_uri=" + encodeURIComponent(callbackUrl) + "&response_type=code";

    try {
        var startUri = new Windows.Foundation.Uri(authorizeUrl);
        var endUri = new Windows.Foundation.Uri(callbackUrl);

        Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
            Windows.Security.Authentication.Web.WebAuthenticationOptions.none,
            startUri,
            endUri).then(function (result) { self.callbackWordPressWebAuth(result, self, callback); }, function (err) { self.callbackWordPressWebAuthError(err); });
    } catch (e) {
        return;
    }
};

// Submit Comment With Access Token
wordpresscomModule.prototype.submitCommentWithToken = function (accessToken, postId, comment, c, r, p) {
    var fullUrl = this.apiURL + 'rest/v1/sites/' + this.siteDomain + '/posts/' + postId + '/replies/new';
    var headers = { 'authorization': 'Bearer ' + accessToken, "User-Agent": this.userAgent, "Content-type": "application/x-www-form-urlencoded" };
    var postData = "content=" + comment;

    var self = this;
    if (false !== self.fetching) {
        self.fetching.cancel();
    }

    self.fetching = WinJS.xhr({ type: "POST", url: fullUrl, headers: headers, data: postData }).then(
        function (result) {
            c(result);
            self.fetching = false;
        },
        function (result) {
            var msg = "";
            try {
                if (result.responseText) {
                    msg = JSON.parse(result.responseText).message;
                }
            }
            catch (e) {

            }
            r(msg);
            self.fetching = false;
        },
        function (result) {
            p(result);
        }
    );
};

// OAuth Callback
wordpresscomModule.prototype.callbackWordPressWebAuth = function (result, self, callback) {
    if (result.responseStatus === 0) {
        var vars = result.responseData.split('?')[1].split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === 'code') {
                // Found code
                var code = decodeURIComponent(pair[1]);

                // Get Token and post Comment
                // You are required to pass client_id, client_secret, and redirect_uri for web applications. 
                // These parameters have to match the details for your application. grant_type has to be set to “authorization_code”. 
                // code must match the code you received in the redirect.
                var callbackUrl = this.callBackUrl;
                var fullUrl = 'https://public-api.wordpress.com/oauth2/token';
                var postData = 'client_id=' + self.clientId + '&client_secret=' + self.clientSecret + '&redirect_uri=' + encodeURIComponent(callbackUrl) + '&grant_type=authorization_code&code=' + code;
                var headers = { "User-Agent": 'wp-window8', "Content-type": "application/x-www-form-urlencoded" };

                WinJS.xhr({ type: "POST", url: fullUrl, headers: headers, data: postData }).done(
                    function (r) {
                        try {
                            // Parse JSON results
                            var data = JSON.parse(r.responseText);

                            // Store the Access Token
                            ideaPress.setAccessToken(data.access_token);
                            callback(data.access_token);

                        } catch (e) {
                            callback(null, "");
                        }
                    },
                    function () {
                        callback(null, "");
                    },
                    function () {
                    }
                );
            }
        }
    }
};

// OAuth Error Callback
wordpresscomModule.prototype.callbackWordPressWebAuthError = function () {
    // Do nothing
    // var error = "Error returned by WebAuth broker. Error Number: " + err.number + " Error Message: " + err.message + "\r\n";
};

// Get comments for a post thru API
wordpresscomModule.prototype.getComments = function (postId, c, r, p) {

    //https://public-api.wordpress.com/rest/v1/sites/$site/posts/$postId/replies/

    var queryString = 'rest/v1/sites/' + this.siteDomain + '/posts/' + postId + '/replies/';
    var fullUrl = this.apiURL + queryString;
    var headers = { "User-Agent": this.userAgent };

    WinJS.xhr({ type: 'GET', url: fullUrl, headers: headers }).done(
        function (result) {
            var data = JSON.parse(result.responseText);
            c(data);
        },
        function (result) {
            r(result);
        },
        function (result) {
            p(result);
        }
    );
};

// Search for posts thru API
wordpresscomModule.prototype.search = function (query) {
    var self = this;

    return new WinJS.Promise(function (comp, err, prog) {
        prog();

        //var queryString = '?json=get_search_results&search=' + query;
        var queryString = 'rest/v1/sites/' + self.siteDomain + '/posts/?number=100&search=' + query;

        var fullUrl = self.apiURL + queryString;
        var headers = { "User-Agent": self.userAgent };

        if (false !== self.fetching) {
            self.fetching.cancel();
        }

        self.fetching =
            WinJS.xhr({ type: 'GET', url: fullUrl, headers: headers }).then(function (r) {
                var data = JSON.parse(r.responseText);
                self.list = new WinJS.Binding.List();
                self.addItemsToList(data.posts);

                self.fetching = false;
                comp(self.list);
            }, function (e) { err(e); }, function (p) { prog(p); });
    });
};