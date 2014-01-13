/*!
	IdeaPress v2.0.1 (Wednesday, June 5, 2013) | ideapress.me/license 
*/

/*
IdeaPress Wordpress JSON API module
Author: IdeaNotion
*/
var wordpressModule = function (ideaPress, options) {
    this.list = new WinJS.Binding.List();
    this.ideaPress = ideaPress;
    this.localStorageBookmarkKey = "wp-bookmark";
    this.userAgent = 'wp-window8';
    this.bookmarks = null;
    this.fetching = false;
    this.loadDescription = false;
    this.isHero = false;

    // set constant
    this.defaultCount = 32;
    this.numberOfRelatedPosts = 4;
    this.maxPagingIndex = -1;
    this.wideTileType = Windows.UI.Notifications.TileTemplateType.tileWideImageAndText01;
    this.squareTileType = Windows.UI.Notifications.TileTemplateType.TileSquarePeekImageAndText04;

    // set options
    this.title = options.title;
    this.typeId = options.typeId;
    this.localStorageKey = "wp-" + options.typeId;
    if (options.categoryId) {
        this.categoryId = options.categoryId;
        this.localStorageKey = this.localStorageKey + "-" + this.categoryId;
    }
    this.pageIds = options.pageIds;
    this.apiURL = options.apiUrl;
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
    if (options.isHero)
        this.isHero = options.isHero;

    if (options.pages) {
        this.pagesOptions = options.pages;
        this.pageIds = [];
        for (var i in this.pagesOptions) {
            this.pageIds.push(this.pagesOptions[i].id);
        }
    }

    return this;
};

// Constants
wordpressModule.PAGES = 0;
wordpressModule.MOSTRECENT = 1;
wordpressModule.CATEGORY = 2;
wordpressModule.BOOKMARKS = 3;

/* 
============================================================================     External Methods     =============================================================//
*/

// Render main section with html
wordpressModule.prototype.render = function (elem) {
    var self = this;
    this.container = elem.contentElement;
    this.section = elem;
    return new WinJS.Promise(function (comp, err, prog) {
        var pageLocation = "/modules/wordpress/pages/wp.module.html";
        if (self.typeId == wordpressModule.PAGES)
            WinJS.Utilities.addClass(self.container.parentNode, "wp-module-pages");
        if (self.typeId == wordpressModule.BOOKMARKS)
            WinJS.Utilities.addClass(self.container.parentNode, "wp-module-bookmarks");
        if (self.typeId == wordpressModule.CATEGORY)
            WinJS.Utilities.addClass(self.container.parentNode, "wp-module-category");
        if (self.typeId == wordpressModule.MOSTRECENT)
            WinJS.Utilities.addClass(self.container.parentNode, "wp-module-mostrecent");

        WinJS.UI.Fragments.renderCopy(pageLocation, self.container).done(
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
wordpressModule.prototype.update = function (viewState) {
    var self = this;

    if (false !== self.fetching) {
        self.fetching.cancel();
    }

    self.fetching = self.fetch(0).then(function () {
        var listViewLayout;

        if (self.typeId === wordpressModule.BOOKMARKS) {
            if (self.list.length === 0) {
                var content = self.container.querySelector(".mp-module-content");
                content.parentNode.parentNode.className = content.parentNode.parentNode.className + ' hide';
                return;
            }
        }

        // set module title
        var title = self.container.querySelector(".wp-title");
        title.onclick = WinJS.Utilities.markSupportedForProcessing(function () {
            self.showCategory();
        });
        var titleCount = self.container.querySelector(".wp-title-count");

        // no header for page
        title.textContent = ideaPress.decodeEntities(self.title);
        if (self.typeId !== wordpressModule.PAGES) {
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
        var listview = self.container.querySelector('.wp-list').winControl;
        WinJS.UI.setOptions(listview, {
            itemDataSource: self.getHubList().dataSource,
            itemTemplate: self.container.querySelector('.wp-post-template'),
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
wordpressModule.prototype.refresh = function (viewState) {
    var self = this;

    self.cancel();

    ideaPress.toggleElement(self.loader, "show");

    var listLength = self.list.length;
    for (var i = 0; i < listLength; i++)
        self.list.pop();

    self.container.querySelector('.wp-list').winControl.itemDataSource = null;

    self.loadFromStorage[this.localStorageKey] = null;
    self.update(viewState);

};

// Cancel any WinJS.xhr in progress
wordpressModule.prototype.cancel = function () {
    if (this.fetching)
        this.fetching.cancel();
};

// Search Charm initialization
wordpressModule.prototype.searchInit = function () {
    var appModel = Windows.ApplicationModel;
    var nav = WinJS.Navigation;
    appModel.Search.SearchPane.getForCurrentView().onquerysubmitted = function (args) { nav.navigate('/modules/wordpress/pages/wp.module.searchResults.html', args); };

};

// Live Tile
// Supports: TileSquarePeekImageAndText04, TileSquareText04 
//           TileWideImageAndText01, TileWideText03 TileWideSmallImageAndText01 TileWidePeekImageAndText01 TileWidePeekImage03
wordpressModule.prototype.getLiveTileList = function () {
    var queryString = '?json=get_recent_posts&count=5&page=1';
    var fullUrl = this.apiURL + queryString;
    var headers = { "User-Agent": this.userAgent };
    var self = this;
    return new WinJS.Promise(function (comp, err, prog) {

        WinJS.xhr({ type: 'GET', url: fullUrl, headers: headers }).then(function (r) {
            var data = self.getJsonFromResponse(r.responseText);
            if (data.status != "ok" || data.count <= 0) {
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
                if (squareTileImageElements && squareTileImageElements.length > 0) {
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
            function (e) {
                err(e);
            },
            function (p) {
                prog(p);
            });
    });
};

wordpressModule.prototype.initHero = function () {
    if (!this.isHero) {
        return null;
    }

    return this;
};

wordpressModule.prototype.getHeroList = function () {
    var heroList = new WinJS.Binding.List();
    var itemsWithImage = new WinJS.Binding.List();

    var hasImage = false;
    for (var i = 0; i < this.list.length; i++) {
        var item = this.list.getAt(i);
        if (!item.noLargeImage) {
            itemsWithImage.push(this.list.getAt(i));
        }
    }

    if (itemsWithImage.length > 0) {
        for (var i = 0; i < Math.min(5, itemsWithImage.length) ; i++) {
            var item = itemsWithImage.getAt(i);
            heroList.push({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle,
                imgUrl: item.imgUrl,
                date: item.date,
            });
        }
    }
    else {
        for (var i = 0; i < Math.min(1, this.list.length) ; i++) {
            var item = this.list.getAt(i);
            heroList.push({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle,
                imgUrl: 'ms-appx:/images/hero.jpg',
                date: item.date,
            });
        }

    }

    return heroList;
};

wordpressModule.prototype.heroClicked = function (item) {
    var post = this.list.getAt(0);
    for (var i = 0; i < this.list.length; i++) {
        if (this.list.getAt(i).id == i.id) {
            post = this.list.getAt(i);
        }
    }

    WinJS.Navigation.navigate("/modules/wordpress/pages/wp.module.detail.html", { item: post });
};

/* 
============================================================================     Module Internal Methods     =============================================================//
*/


// Fetch pages, posts or bookmarks
wordpressModule.prototype.fetch = function (page) {
    var self = this;

    return new WinJS.Promise(function (comp, err, prog) {
        var url = self.apiURL;
        var queryString;

        // branch off to get pages, posts or bookmark based on categoryId
        if (self.typeId === wordpressModule.PAGES) {
            self.getPages().then(function () {
                comp();
                return;
            }, function () {
                localStorageObject = self.loadFromStorage();
                if (localStorageObject != null && localStorageObject.pages != null) {
                    var pages = localStorageObject.pages;

                    self.addPagesToList(pages);
                }

                comp();
                ideaPress.toggleElement(self.loader, "hide");
            },
            function (p) {
                prog(p);
            });
            return;
        } else if (self.typeId === wordpressModule.BOOKMARKS) {

            // read from bookmark and store to the list
            var bookmarks = self.getBookmarks();
            self.post_count = bookmarks.post_count;
            self.lastFetched = bookmarks.lastFetched;

            var listLength = self.list.length;
            for (var i = 0; i < listLength; i++) {
                self.list.pop();
            }

            for (i = 0; i < bookmarks.posts.length; i++) {
                bookmarks.posts[i].module = self;
                self.list.push(bookmarks.posts[i]);
            }
            self.totalCount = bookmarks.posts.length;
            ideaPress.toggleElement(self.loader, "hide");
            comp();
            return;
        } else {
            // fetch Posts            
            if (self.typeId === wordpressModule.MOSTRECENT)
                queryString = '?json=get_recent_posts&count=' + self.defaultCount + "&page=" + (page + 1);
            else
                queryString = '?json=get_category_posts&id=' + self.categoryId + '&count=' + self.defaultCount + "&page=" + (page + 1);

            var fullUrl = url + queryString;
            var headers = { "User-Agent": self.userAgent };
            var localStorageObject = self.loadFromStorage();

            if (self.shouldFetch(localStorageObject, page)) {
                WinJS.xhr({ type: 'GET', url: fullUrl, headers: headers }).then(function (r) {
                    //var data = JSON.parse(r.responseText);
                    var data = self.getJsonFromResponse(r.responseText);
                    if (data.status !== "ok" || data.count === 0) {
                        // no data
                        self.maxPagingIndex = 0;
                        ideaPress.toggleElement(self.loader, "hide");
                        comp();
                        return;
                    }

                    if (data.category != null) {
                        self.totalCount = data.category.post_count;
                    } else {
                        self.totalCount = data.count_total;
                    }

                    if (data.count > 0) {
                        self.addItemsToList(data.posts);
                        localStorageObject = { 'post_count': self.totalCount, 'posts': [], 'lastFetched': new Date() };

                        for (var item in data.posts) {
                            localStorageObject.posts.push(data.posts[item]);
                        }
                        self.saveToStorage(localStorageObject);
                        self.maxPagingIndex = page;
                    }

                    comp();
                    ideaPress.toggleElement(self.loader, "hide");
                    return;
                },
                function (m) {
                    ideaPress.toggleElement(self.loader, "hide");
                    localStorageObject = self.loadFromStorage();
                    if (localStorageObject != null && localStorageObject.posts != null) {
                        self.addItemsToList(localStorageObject.posts);
                        comp();
                    }
                    else {
                        err(m);
                    }
                },
                function (p) {
                    prog(p);
                });
            } else {
                // local from local storage
                if (!localStorageObject) {
                    err();
                    return;
                }
                self.addItemsToList(localStorageObject.posts);

                self.lastFetched = localStorageObject.lastFetched;
                self.totalCount = localStorageObject.post_count;
                comp();
                ideaPress.toggleElement(self.loader, "hide");
            }
        }
    });
};

// Get pages data using JSON API
wordpressModule.prototype.getPages = function () {
    var self = this;
    return new WinJS.Promise(function (comp, err, prog) {

        var url = self.apiURL;
        var queryString = '?json=get_page&id=';

        var fullUrl = url + queryString;
        var headers = { "User-Agent": self.userAgent };
        var localStorageObject = self.loadFromStorage();

        if (!self.shouldFetch(localStorageObject)) {
            self.addPagesToList(localStorageObject.pages);

            self.lastFetched = localStorageObject.lastFetched;
            self.totalCount = localStorageObject.page_count;
            comp();
            ideaPress.toggleElement(self.loader, "hide");

        } else {
            var promises = [];
            var pageData = new Array();
            var pagesToFetch = new Array();
            for (var i in self.pageIds) {
                pagesToFetch.push(self.pageIds[i]);
            }
            var toFetch = function () {
                var numFetch = Math.min(pagesToFetch.length, ideaPress.maxConcurrent);
                for (var index = 0; index < numFetch; index++) {
                    var pOpt = pagesToFetch.shift();
                    var id = pOpt;
                    promises.push(WinJS.xhr({ type: 'GET', url: fullUrl + id, headers: headers }).then(function (r) {

                        var data = self.getJsonFromResponse(r.responseText);
                        var index = self.pageIds.indexOf(data.page.id);
                        //if (self.pagesOptions[index].imgUrl)
                        //    data.page.iconUrl = self.pagesOptions[index].imgUrl;

                        if (data.page) {
                            pageData[self.pageIds.indexOf(data.page.id)] = data.page;
                        }
                    }, function () { err(); }, function () { prog(); }));
                }

                WinJS.Promise.join(promises).then(function () {
                    if (pagesToFetch.length > 0) {
                        toFetch();
                        return;
                    }

                    if (pageData.length > 0) {
                        localStorageObject = { 'page_count': pageData.length, 'pages': pageData, 'lastFetched': new Date() };

                        ideaPress.toggleElement(self.loader, "hide");

                        self.addPagesToList(pageData);
                        self.saveToStorage(localStorageObject);
                    }
                    comp();
                },
                function () {
                    err();
                },
                function (p) {
                    prog(p);
                });
            };
            toFetch();
        }
    });

};

wordpressModule.prototype.getJsonFromResponse = function (responseText) {
    if (/^[\],:{}\s]*$/.test(responseText.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        //the json is ok
        return JSON.parse(responseText);
    } else {

        //the json is not ok
        /*var lIndex = responseText.split("").reverse().join("").indexOf(">--");
        var fIndex = resposeText.split("").reverse().join("").indexOf("--!<");

        if (fIndex >= 0 && lIndex >= 0) {
            return JSON.parse(responseText.substring(0, responseText.length - fIndex - 4) + responseText.substring(responseText.length - lIndex, responseText.length));
        } else {
            //fail
            return JSON.parse(responseText);
        }*/
        var startIndex = responseText.indexOf('{"status"');

        if (startIndex < 0) {
            return JSON.parse("{\"status\":\"fail\"}");
        }
        responseText = responseText.substring(startIndex);

        var regex = /<!--.+?-->/g;
        responseText = responseText.replace(regex, '');
        var responseText = responseText;
        return JSON.parse(responseText);
    }
};

// Search text using JSON API 
wordpressModule.prototype.search = function (query) {
    var self = this;

    return new WinJS.Promise(function (comp, err, prog) {
        prog(0);

        var queryString = '?json=get_search_results&count=20&search=' + query;

        var fullUrl = self.apiURL + queryString;
        var headers = { "User-Agent": self.userAgent };

        if (false !== self.fetching) {
            self.fetching.cancel();
        }

        self.fetching =
            WinJS.xhr({ type: 'GET', url: fullUrl, headers: headers }).then(function (r) {
                var data = self.getJsonFromResponse(r.responseText);
                self.list = new WinJS.Binding.List();
                self.addItemsToList(data.posts);

                self.fetching = false;
                comp(self.list);
            }, function (e) { err(e); }, function (p) { prog(p); });
    });
};

//function to call when module detail is clicked
//Solution for read more
wordpressModule.prototype.getPostContent = function (id, elem) {
    var self = this;
    ideaPress.toggleElement(self.loader, "show");
    return new WinJS.Promise(function (comp, err, prog) {
        prog(0);

        var queryString = '?json=get_post&page_id=' + id;

        var fullUrl = self.apiURL + queryString;
        var headers = { "User-Agent": self.userAgent };

        if (false !== self.fetching) {
            self.fetching.cancel();
        }

        self.fetching =
            WinJS.xhr({ type: 'GET', url: fullUrl, headers: headers }).then(function (r) {
                var data = self.getJsonFromResponse(r.responseText);
                WinJS.Utilities.setInnerHTMLUnsafe(elem, data.post.content);
                ideaPress.toggleElement(self.loader, "hide");
                self.fetching = false;
                comp(self.list);
            }, function (e) { err(e); }, function (p) { prog(p); });
    });
};

// Check if the app should fetch data
wordpressModule.prototype.shouldFetch = function (localStorageObject, page) {
    if (localStorageObject) {
        if (page && (page > this.maxPagingIndex)) {
            return true;
        }
        if (this.typeId === wordpressModule.PAGES) {
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
wordpressModule.prototype.loadFromStorage = function () {
    if (localStorage[this.localStorageKey] != null) {
        var localStorageObject = JSON.parse(localStorage[this.localStorageKey]);
        self.lastFetched = localStorageObject.lastFetched;
        return localStorageObject;
    }
    return null;
};

// Save to the local storage
wordpressModule.prototype.saveToStorage = function (data) {

    localStorage[this.localStorageKey] = JSON.stringify(data);
};

// Navigate to Detail page
wordpressModule.prototype.showPost = function (eventObject) {
    var i = this.list.getAt(eventObject.detail.itemIndex);
    WinJS.Navigation.navigate("/modules/wordpress/pages/wp.module.detail.html", { item: i });
};

// Navigate to Section page
wordpressModule.prototype.showCategory = function () {
    WinJS.Navigation.navigate("/modules/wordpress/pages/wp.module.section.html", { category: this });
};

// Generate the list for hub page
wordpressModule.prototype.getHubList = function () {
    var hubList = new WinJS.Binding.List();

    var h = window.innerHeight;
    var l = 6;
    if (h > 1919)
        l = 12;
    else if (h > 1079)
        l = 8;

    // override
    if (this.hubItemsCount)
        l = this.hubItemsCount;

    for (var i = 0; i < Math.min(l, this.list.length) ; i++)
        hubList.push(this.list.getAt(i));

    return hubList;
};

// Post Comment
wordpressModule.prototype.submitComment = function (postId, name, email, url, comment, c, r, p) {
    var fullUrl = this.apiURL + '?json=submit_comment&post_id=' + postId + '&name=' + encodeURI(name) + '&email=' + encodeURI(email) + '&content=' + encodeURI(comment);
    var headers = { "User-Agent": this.userAgent };


    var self = this;
    if (false !== self.fetching) {
        self.fetching.cancel();
    }

    self.fetching = WinJS.xhr({ type: "POST", url: fullUrl, headers: headers }).then(
        function (result) {
            c(result);
            self.fetching = false;
        },
        function (result) {
            r(result);
            self.fetching = false;
        },
        function (result) {
            p(result);
        }
    );
};

// Add posts to the list
wordpressModule.prototype.addItemsToList = function (jsonPosts) {
    var self = this;
    var itemArray = new Array();
    for (var key in jsonPosts) {
        var item = self.convertItem(jsonPosts[key]);

        item.module = self;
        item.categories = jsonPosts[key].categories;
        item.className = "wp-item wp-item-" + key;

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

// Add pages to the list
wordpressModule.prototype.addPagesToList = function (jsonPages) {
    var self = this;
    var itemArray = new Array();


    for (var index in jsonPages) {
        if (!jsonPages[index])
            continue;

        var item = self.convertPage(jsonPages[index]);
        item.module = self;

        item.className = "wp-item wp-item-" + index;

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

// Translate Post to local object
wordpressModule.prototype.convertItem = function (item, type) {
    var res = {
        type: 'post',
        title: ideaPress.decodeEntities(item.title),
        id: item.id,
        content: item.content,
        timestamp: item.date.substr(0, 10),
        permalink: item.url.replace(/^https:/, 'http:'),
        date: item.date.replace(' ', 'T'),
        authorId: item.author.id,
        authorName: item.author.name,
        comments: item.comments
    };

    //description
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
    res.noLargeImage = true;

    var found = false;

    var itemThumbnail = item.thumbnail;
    if (itemThumbnail) {
        res.imgThumbUrl = itemThumbnail;
        found = true;
    }

    for (var i in item.attachments) {
        if (item.attachments[i].images != null) {
            if (res.noLargeImage) {
                if (item.attachments[i].images.full.height > 520) {
                    res.imgUrl = item.attachments[i].images.full.url;
                    res.noLargeImage = false;
                }
            }

            if (!found) {
                if (item.attachments[i].images.medium) {
                    res.imgThumbUrl = item.attachments[i].images.medium.url;
                }
                found = true;
            }
            break;
        }
    }
    // Workaround: fix-up img src is not using absolute paths "/" 
    /*if (self.document) {
        res.content = ideaPress.cleanImageTag(res.content, this.apiURL);
    }*/

    // Workaround: some wordpress post do not have attachment, 
    // - this fix do not work for live tile because there is no document for background thread
    /*if (!found && self.document) {
        var div = document.createElement("div");
        WinJS.Utilities.setInnerHTMLUnsafe(div, res.content);
        var imgs = div.getElementsByTagName("img");
        if (imgs && imgs.length > 0) {
            res.imgUrl = imgs[0].src;
            res.imgThumbUrl = imgs[0].src;
        }
    }*/

    var imgUrlStyle = res.imgThumbUrl;
    res.imgUrlStyle = "url('" + imgUrlStyle + "')";

    var subtitle = '';
    if (item.categories) {
        for (var j in item.categories) {
            subtitle = subtitle + ', ' + ideaPress.decodeEntities(item.categories[j].title);
        }
        res.subtitle = subtitle.substring(2);
    }

    return res;

};

// Translate Page to local object
wordpressModule.prototype.convertPage = function (item, parentId) {
    var res = {
        type: 'page',
        title: ideaPress.decodeEntities(item.title),
        id: item.id,
        content: item.content,
        timestamp: item.date.substr(0, 10),
        permalink: item.url.replace(/^https:/, 'http:'),
        date: item.date.replace(' ', 'T'),
        authorId: item.author.id,
        authorName: item.author.name,
        comments: item.comments,
        parentId: parentId,
        hasChildren: false
    };

    // get the first image from attachments
    res.imgUrl = 'ms-appx:/images/blank.png';
    res.imgThumbUrl = 'ms-appx:/images/blank.png';
    res.description = "";

    if (item.iconUrl) {
        res.imgThumbUrl = item.iconUrl;
        res.imgUrl = item.iconUrl;
    }
    else {
        var found = false;
        for (var i in item.attachments) {
            if (item.attachments[i].images != null) {
                res.imgUrl = item.attachments[i].images.full.url;
                if (item.attachments[i].images.medium) {
                    res.imgThumbUrl = item.attachments[i].images.medium.url;
                    found = true;
                }
                break;
            }
        }

        // Workaround: fix-up img src is not using absolute paths "/" 
        /*if (self.document) {
            res.content = ideaPress.cleanImageTag(res.content, this.apiURL);
        }*/

        // Workaround: some wordpress post do not have attachment, 
        // - this fix do not work for live tile because there is no document for background thread
        /*if (!found && self.document) {
            var div = document.createElement("div");
            WinJS.Utilities.setInnerHTMLUnsafe(div, res.content);
            var imgs = div.getElementsByTagName("img");
            if (imgs && imgs.length > 0) {
                res.imgUrl = imgs[0].src;
                res.imgThumbUrl = imgs[0].src;
            }
        }*/
    }

    var imgUrlStyle = res.imgThumbUrl;
    res.imgUrlStyle = "url('" + imgUrlStyle + "')";
    res.subtitle = "";

    return res;
};

// Get Bookmarks from local storage
wordpressModule.prototype.getBookmarks = function () {
    var self = this;
    if (!localStorage[self.localStorageBookmarkKey]) {
        localStorage[self.localStorageBookmarkKey] = JSON.stringify({ 'post_count': 0, 'posts': [], 'lastFetched': new Date() });
    }

    this.bookmarks = JSON.parse(localStorage[self.localStorageBookmarkKey]);
    return this.bookmarks;
};

// Check if a post has been bookmarked
wordpressModule.prototype.checkIsBookmarked = function (id) {
    var bookmarks = this.getBookmarks();
    for (var index in bookmarks.posts) {
        if (id === bookmarks.posts[index].id)
            return true;
    }
    return false;
};

// Add post to bookmark
wordpressModule.prototype.addBookmark = function (item) {
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
wordpressModule.prototype.removeBookmark = function (id) {
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
