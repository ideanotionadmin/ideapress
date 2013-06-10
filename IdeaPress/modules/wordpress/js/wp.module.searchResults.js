/*!
	IdeaPress v2.0.1 (Wednesday, June 5, 2013) | ideapress.me/license 
*/

/*
IdeaPress Wordpress JSON API module
Author: IdeaNotion
*/
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var appModel = Windows.ApplicationModel;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;
    var searchPageUri = "/modules/wordpress/pages/wp.module.searchResults.html";

    ui.Pages.define(searchPageUri, {
        _filters: [],
        _lastSearch: "",

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var listView = element.querySelector(".resultslist").winControl;
            listView.itemTemplate = element.querySelector(".wp-post-template");
            listView.oniteminvoked = this._itemInvoked;
            this._handleQuery(element, options);
            listView.element.focus();

            document.getElementById("home").addEventListener("click", function () { ideaPress.navBack(nav, nav.history.backStack.length);/*nav.back(nav.history.backStack.length);*/ }, false);

            var wc = document.querySelector('.wp-list').winControl;
            wc.addEventListener("mousewheel", ideaPress.scrollBackground);
        },

        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var listView = element.querySelector(".resultslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function(e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    };
                    listView.addEventListener("contentanimating", handler, false);
                    var firstVisible = listView.indexOfFirstVisible;
                    this._initializeLayout(listView, viewState);
                    if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
                        listView.indexOfFirstVisible = firstVisible;
                    }
                }
            }
        },

        // This function filters the search data using the specified filter.
        _applyFilter: function (filter, originalResults) {
            if (filter.results === null) {
                filter.results = originalResults.createFiltered(filter.predicate);
            }
            return filter.results;
        },

        // This function responds to a user selecting a new filter. It updates the
        // selection list and the displayed results.
        _filterChanged: function (element, filterIndex) {
            var listView = element.querySelector(".resultslist").winControl;

            listView.itemDataSource = this._filters[filterIndex].results.dataSource;
        },

        _generateFilters: function () {
            this._filters = [];
            this._filters.push({ results: null, text: "All", predicate: function () { return true; } });
        },

        // This function executes each step required to perform a search.
        _handleQuery: function (element, args) {
            var self = this;
            this._lastSearch = args.queryText;
            WinJS.Namespace.define("searchResults", { markText: WinJS.Binding.converter(this._markText.bind(this)) });
            this._initializeLayout(element.querySelector(".resultslist").winControl, Windows.UI.ViewManagement.ApplicationView.value);
            this._generateFilters();

            self.loader = element.querySelector("progress");
            ideaPress.toggleElement(self.loader, "show");
            this._searchData(args.queryText).then(function (originalResults) {
                if (originalResults.length === 0) {
                    document.querySelector('.resultsmessage').style.display = "block";
                }
                
                ideaPress.toggleElement(self.loader, "hide");
                self._populateFilterBar(element, originalResults);
                self._applyFilter(self._filters[0], originalResults);
            }, function () { }, function () {  });
        },

        // This function updates the ListView with new layouts
        _initializeLayout: function (listView, viewState) {
   
            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
                document.querySelector(".titlearea .pagetitle").textContent = '“' + this._lastSearch + '”';
            } else {
                listView.layout = new ui.GridLayout();

                document.querySelector(".titlearea .pagetitle").textContent = "Results for “" + this._lastSearch + '”';
            }
        },

        _itemInvoked: function (args) {
            ideaPress.searchModule.showPost(args);
        },

        // This function colors the search term. Referenced in /searchResults.html
        // as part of the ListView item templates.
        _markText: function (text) {
            return text.replace(this._lastSearch, "<mark>" + this._lastSearch + "</mark>");
        },

        // This function generates the filter selection list.
        _populateFilterBar: function (element, originalResults) {
            var listView = element.querySelector(".resultslist").winControl;
            var filterIndex;
            
            for (filterIndex = 0; filterIndex < this._filters.length; filterIndex++) {
                this._applyFilter(this._filters[filterIndex], originalResults);
                
                if (filterIndex === 0) {
                    listView.itemDataSource = this._filters[filterIndex].results.dataSource;
                }
            }
        },

        // This function populates a WinJS.Binding.List with search results for the
        // provided query.
        _searchData: function (queryText) {
           
            return ideaPress.searchModule.search(queryText);
        }
    });

    WinJS.Application.addEventListener("activated", function (args) {
        if (args.detail.kind === appModel.Activation.ActivationKind.search) {
            args.setPromise(ui.processAll().then(function () {
                if (!nav.location) {
                    nav.history.current = { location: Application.navigator.home, initialState: {} };
                }

                return nav.navigate(searchPageUri, { queryText: args.detail.queryText });
            }));
        }
    });


})();
