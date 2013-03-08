/*
IdeaPress Wordpress JSON API module
Author: IdeaNotion
*/
(function () {
    "use strict";

    var item;

    function ready(element, options) {
        WinJS.UI.Animation.enterPage(document.querySelector('.fragment.wp-post'), { top: '0px', left: '200px' });

        item = options.item; // needs to be a global

        // Populate the Comment buttons events
        document.getElementById("commentButton").addEventListener("click", showCommentFlyout, false);
        document.getElementById("submitCommentButton").addEventListener("click", submitComment, false);
        document.getElementById("commentFlyout").addEventListener("afterhide", onDismiss, false);

        // Populate the page with Blog info
        document.title = ideaPress.decodeEntities(item.title);
        document.querySelector('.wp-post').setAttribute('id', item.id);
        document.querySelector('.wp-post').setAttribute('permalink', item.permalink);

        document.querySelector('.title').innerText = item.title;

        WinJS.Utilities.setInnerHTMLUnsafe(document.querySelector('.content'), item.content);

        document.querySelector('.meta').innerHTML += '<div class="meta-txt"><em>by ' + item.authorName + '</em><br />Posted ' + ideaPress.timeSince(item.date) + ' ago</div>';

        // setup sharing
        document.querySelector('.mp-share').innerText = document.querySelector('.content').innerText.substr(0, 50);
        document.querySelector('.mp-share').setAttribute('permalink', item.permalink);
        document.querySelector('.mp-share').setAttribute('title', item.title);

        document.getElementById("like").addEventListener("click", bookmarkClick, false);
        document.getElementById("home").addEventListener("click", function () { var nav = WinJS.Navigation; nav.back(nav.history.backStack.length); }, false);

        document.getElementById('viewblog').removeEventListener("click", viewBlog);
        document.getElementById('viewblog').addEventListener("click", viewBlog, false);

        document.querySelector('.contentArea').addEventListener("mousewheel", function (eventObject) {
            var delta = -Math.round(eventObject.wheelDelta);
            document.querySelector('.contentArea').scrollLeft += delta;
        });

        // scroll background
        document.querySelector('.contentArea').addEventListener("scroll", ideaPress.scrollBackground);

        // Catch link clicks and iframe them.
        ideaPress.iframePostLinks();
        
        // Comments
        // Loop through all comments

        if (item && item.comments) { 
            var comments = '';
            for (var i = 0; i < item.comments.length; i++) {
                comments += '<div class="item"><div class="wp-caption-text">';
                comments += item.comments[i].content + '</div>';
                comments += '<p style="float:right;">Posted by ' + item.comments[i].name + ' ';
                comments += getDateDifference(item.comments[i].date) + ' ago</p></div>';
            }
            WinJS.Utilities.setInnerHTMLUnsafe(document.querySelector('.comment'), comments);
        }
        // Related Post
        var relatedPost = '';
        var primCat = item.module;

        if (primCat) {
            for (var l = 0; l < primCat.list.length && l < primCat.numberOfRelatedPosts; l++) {
                // Only add post that is not itself.
                var value = primCat.list.getAt(l);
                if (value.id != item.id) {
                    relatedPost += '<div class="item"><div class="wp-caption-text" id="related' + value.id + '"><a href="#">' + value.title + '</a></div><br/>';
                    relatedPost += '<p style="float:right;">From ' + value.authorName + ' ' + getDateDifference(value.date) + ' ago</p></div>';
                }
            }
            WinJS.Utilities.setInnerHTMLUnsafe(document.querySelector(".relatedPost"), relatedPost);

            // We'll add the listener after we add the elements into the script
            primCat.list.forEach(
                function (v) {
                    if (v.id != item.id) {
                        if (document.getElementById('related' + v.id)) {
                            document.getElementById('related' + v.id).addEventListener("click", function() {
                                WinJS.Navigation.navigate("/modules/wordpress/pages/wp.module.detail.html", { item: v });
                            }, false);
                        }
                    }
                }
            );

            // Make sure the bookmark icon is properly updated.
            updateButton(item.module.checkIsBookmarked(item.id));
        }
        
        return; // convenient to set breakpoint :)
    }

    function getDateDifference(lsPostDateString) {
        // Expected Format: 
        //  0123456789012345678
        //  2012-10-26 07:49:03
        var year = lsPostDateString.substring(0, 4);
        var month = parseInt(lsPostDateString.substring(5, 7)) - 1; // month starts from 0 to 11
        var day = lsPostDateString.substring(8, 10);
        var hour = lsPostDateString.substring(11, 13);
        var minute = lsPostDateString.substring(14, 16);
        var milli = lsPostDateString.substring(17);
        return ideaPress.timeSince(new Date(year, month, day, hour, minute, milli, 0));
    }

    function viewBlog() {
        if (WinJS.Utilities.hasClass(document.querySelector("button#viewblog"), 'open-in-browser'))
            top.location.href = item.permalink;
        else
            ideaPress.renderIframeView(item.permalink);
    }

    function updateLayout(element, viewState) {
        if (viewState == Windows.UI.ViewManagement.ApplicationViewState.snapped) {
            var backlink = document.getElementById("backlink");
            if (backlink) {
                backlink.click();
            }
        }
    }

    // Update the behavior of the app button
    function updateButton(isBookmarked) {
        var likeButton = document.getElementById('like');

        if (!isBookmarked) {
            WinJS.Utilities.removeClass(likeButton, "selected");
            likeButton.onmouseover = "";
            likeButton.onmouseout = "";

            likeButton.getElementsByClassName('win-label').item(0).innerText = "Bookmark";
        }
        else {
            likeButton.getElementsByClassName('win-label').item(0).innerText = "Bookmarked";
            WinJS.Utilities.addClass(likeButton, "selected");
            likeButton.onmouseover = function() {
                likeButton.getElementsByClassName('win-label').item(0).innerText = "Unbookmark";
            };
            likeButton.onmouseout = function() {
                likeButton.getElementsByClassName('win-label').item(0).innerText = "Bookmarked";
            };
        }
    }

    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    function bookmarkClick() {
        var isBookmarked = item.module.checkIsBookmarked(item.id);
        if (!isBookmarked) {
            var copyItem = clone(item);
            item.module.addBookmark(copyItem);
            updateButton(true);
        }
        else {
            item.module.removeBookmark(item.id);
            updateButton(false);
        }
    }

    // Show the flyout
    function showCommentFlyout() {
        //loggedIn = false;
        //WinJS.log && WinJS.log("", "sample", "status", "status");

        var commentButton = document.getElementById("commentButton");
        document.getElementById("commentFlyout").winControl.show(commentButton);
        // Clear the results text
        document.getElementById('comments#results').innerText = "";
    }

    // Show errors if any of the text fields are not filled out when the Comment button is clicked
    function submitComment() {
        var error = false;
        if (document.getElementById("commentName").value.trim() === "") {
            document.getElementById("commentNameError").innerHTML = "Name is required";
            document.getElementById("commentName").focus();
            error = true;
        } else {
            document.getElementById("commentNameError").innerHTML = "";
        }
        if (document.getElementById("commentEmail").value.trim() === "") {
            document.getElementById("commentEmailError").innerHTML = "Email is required";
            document.getElementById("commentEmail").focus();
            error = true;
        } else {
            document.getElementById("commentEmailError").innerHTML = "";
        }
        if (document.getElementById("commentComment").value.trim() === "") {
            document.getElementById("commentCommentError").innerHTML = "Comment is required";
            document.getElementById("commentComment").focus();
            error = true;
        } else {
            document.getElementById("commentCommentError").innerHTML = "";
        }

        if (!error) {
            //loggedIn = true;
            //WinJS.log && WinJS.log("You have logged in.", "sample", "status");
            item.module.submitComment(item.id,
                document.getElementById("commentName").value.trim(),
                document.getElementById("commentEmail").value.trim(),
                document.getElementById("commentUrl").value.trim(),
                document.getElementById("commentComment").value.trim(),
                function (result) {
                    var data = JSON.parse(result.responseText);
                    if (data.status == 'pending') {
                        document.getElementById('comments#results').innerText = 'Comment submitted. Pending approval.';
                    }
                    else if (data.status == 'ok') {
                        document.getElementById('comments#results').innerText = 'Comment submitted successfully.';
                    }
                    else if (data.status == 'error') {
                        document.getElementById('comments#results').innerText = 'An error occurred: ' + data.error;
                    } else {
                        document.getElementById('comments#results').innerText = result.responseText;
                    }
                },
                function (result) {
                    document.getElementById('comments#results').innerText = 'An error occurred: ' + result.status + ' ' + result.statusText;
                },
                function () {
                    document.getElementById('comments#results').innerText = "Posting in progress.";
                }
            );

            document.getElementById("commentFlyout").winControl.hide();
        }
    }

    // On dismiss of the flyout, reset the fields in the flyout
    function onDismiss() {

        // Clear fields on dismiss
        document.getElementById("commentName").value = "";
        document.getElementById("commentNameError").innerHTML = "";
        document.getElementById("commentEmail").value = "";
        document.getElementById("commentEmailError").innerHTML = "";
        document.getElementById("commentComment").value = "";
        document.getElementById("commentCommentError").innerHTML = "";
        document.getElementById("commentUrl").value = "";

        //if (!loggedIn) {
        //    WinJS.log && WinJS.log("You have not logged in.", "sample", "status");
        //}
    }

    WinJS.UI.Pages.define("/modules/wordpress/pages/wp.module.detail.html", {
        ready: ready,
        updateLayout: updateLayout
    });
})();
        