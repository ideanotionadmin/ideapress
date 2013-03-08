/*
IdeaPress Wordpress.COM API module
Author: IdeaNotion
*/
(function () {
    "use strict";

    var item;

    function ready(element, options) {
        WinJS.UI.Animation.enterPage(document.querySelector('.fragment.wpc-post'), { top: '0px', left: '200px' });

        item = options.item; // needs to be a global

        // Populate the Comment buttons events
        document.getElementById("commentButton").addEventListener("click", showCommentFlyout, false);
        document.getElementById("submitCommentButton").addEventListener("click", submitComment, false);
        document.getElementById("commentFlyout").addEventListener("afterhide", onDismiss, false);

        // Populate the page with Blog info
        document.title = ideaPress.decodeEntities(item.title);
        document.querySelector('.wpc-post').setAttribute('id', item.id);
        document.querySelector('.title').innerText = item.title;
        //document.querySelector('.wp-post').setAttribute('permalink', item.permalink);

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
        getComment(item.id);

        // if no WP client ID/Secret, enable the post comment button
        if (item.module.clientId && item.module.clientSecret)
            document.getElementById('commentButton').style.display = "block";

        if (item.module) {
            // Related Post
            var relatedPost = '';
            var primCat = item.module;
            
            for (var l = 0; l < primCat.list.length && l < primCat.numberOfRelatedPosts; l++) {
                // Only add post that is not itself.
                var value = primCat.list.getAt(l);
                if (value.id != item.id) {
                    relatedPost += '<div class="item"><div class="wpc-caption-text" id="related' + value.id + '"><a href="#">' + value.title + '</a></div><br/>';
                    relatedPost += '<p style="float:right;">From ' + value.authorName + ' ' + getDateDifference(value.date) + ' ago</p></div>';
                }
            }

            WinJS.Utilities.setInnerHTMLUnsafe(document.querySelector(".relatedPost"), relatedPost);

            // We'll add the listener after we add the elements into the script
            primCat.list.forEach(
                 function (v) {
                     if (v.id != item.id) {
                         if (document.getElementById('related' + v.id)) {
                             document.getElementById('related' + v.id).addEventListener("click", function () {
                                 WinJS.Navigation.navigate("/modules/wordpressCom/pages/wpcom.module.detail.html", { item: v });
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

    // fetch comment 
    function getComment(postId) {
        item.module.getComments(
            postId,
            function (result) {
                var data = result;
                if (data.found > 0) {

                    var comments = '';

                    for (var i = 0; i < data.comments.length; i++) {
                        comments += '<div class="item"><div class="wpc-caption-text">';
                        comments += data.comments[i].content + '</div>';
                        comments += '<p style="float:right;">Posted by ' + data.comments[i].author.name + ' ';
                        comments += getDateDifference(data.comments[i].date) + ' ago</p></div>';
                    }

                    WinJS.Utilities.setInnerHTMLUnsafe(document.querySelector('.comment'), comments);
                }
                else
                    WinJS.Utilities.setInnerHTMLUnsafe(document.querySelector('.comment'), '');
            },
            function () {
                WinJS.Utilities.setInnerHTMLUnsafe(document.querySelector('.comment'), 'Error in fetching comments');
            },
            function () {
            }
        );        
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
        var milli = lsPostDateString.substring(17, 19);
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

    function bookmarkClick() {
        var isBookmarked = item.module.checkIsBookmarked(item.id);
        if (!isBookmarked) {
            item.module.addBookmark(item);
            updateButton(true);
        }
        else {
            item.module.removeBookmark(item.id);
            updateButton(false);
        }
    }

    // Show the flyout
    function showCommentFlyout() {
        var commentButton = document.getElementById("commentButton");
        document.getElementById("commentFlyout").winControl.show(commentButton);
        // Clear the results text
        document.getElementById('comments#results').innerText = "";
    }

    // Show errors if any of the text fields are not filled out when the Comment button is clicked
    function submitComment() {
        var error = false;
        
        if (document.getElementById("commentComment").value.trim() === "") {
            document.getElementById("commentCommentError").innerHTML = "Comment is required";
            document.getElementById("commentComment").focus();
            error = true;
        } else {
            document.getElementById("commentCommentError").innerHTML = "";
        }

        if (!error) {
            // I tried to access the Element in the call back method but it keeps returning null
            // probably the form is in another one already.  
            var comment = document.getElementById("commentComment").value.trim();

            // Check to see if an access token is stored 
            var token = ideaPress.getAccessToken();
            if (null == token)
                item.module.submitCommentWithoutToken(function (t, e) {
                    if (e) {
                        document.getElementById('comments#results').innerText = "Error Posting Comment. " + e;
                    }
                    else {
                        document.getElementById("commentFlyout").winControl.hide();
                        submitCommentWithToken(comment, t);
                    }
                });    // ReceiveToken is the function call to invoke when token retrieval is completed.
            else                
                submitCommentWithToken(comment, token);
        }
    }

    function submitCommentWithToken(comment, token) {
        document.getElementById('comments#results').innerText = "Posting comment...";

        item.module.submitCommentWithToken(
            token,
            item.id,
            comment,
            function (result) {
                var data = JSON.parse(result.responseText);
                if (data.status == 'unapproved') {
                    document.getElementById('comments#results').innerText = 'Comment not approved.';
                }
                else if (data.status == 'approved') {
                    // Once it is approved, we will show the comment by fetching the existing data and append to it..
                    var existingComment = document.querySelector('.comment').innerHTML;
                    existingComment += '<div class="item"><div class="wpc-caption-text">';
                    existingComment += data.content + '</div>';
                    existingComment += '<p style="float:right;">Posted by ' + data.author.name + ' ';
                    existingComment += getDateDifference(data.date) + ' ago</p></div>';
                    
                    WinJS.Utilities.setInnerHTMLUnsafe(document.querySelector('.comment'), existingComment);
                    // Clear any progress status
                    document.getElementById('comments#results').innerText = '';
                }
                else if (data.status == 'spam') {
                    document.getElementById('comments#results').innerText = 'Comment marked as spam.';
                }
                else if (data.status == 'trash') {
                    document.getElementById('comments#results').innerText = 'Comment sent to trash.';
                }
                else {
                    document.getElementById('comments#results').innerText = result.responseText;
                }
            },
            function (e) {
                document.getElementById('comments#results').innerText = "Error Posting Comment. " + e;
            },
            function () {                
            }
       );
    }

    // On dismiss of the flyout, reset the fields in the flyout
    function onDismiss() {

        // Clear fields on dismiss
        document.getElementById("commentComment").value = "";
        document.getElementById("commentCommentError").innerHTML = "";
    }

    WinJS.UI.Pages.define("/modules/wordpressCom/pages/wpcom.module.detail.html", {
        ready: ready,
        updateLayout: updateLayout
    });
})();
        