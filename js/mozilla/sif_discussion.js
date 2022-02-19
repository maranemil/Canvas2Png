function discussion_setup() {
    if ($('discussioncomment').value == comment_teaser) {
        $('discussioncomment').value = '';
    }
}

function discussion_leave() {
    if ($('discussioncomment').value == '') {
        $('discussioncomment').value = comment_teaser;
    }
}

function discussion_submit_comment() {
    comment = $('discussioncomment').value;
    username = $('discussionname').value;
    useremail = $('discussionemail').value;
    userurl = $('discussionurl').value;
    if (comment != comment_teaser && comment != '' && username != '' && useremail != '') {
        new Request.HTML({
            url: 'store_comment.php',
            method: 'post',
            data: 'topic=' + topic + '&name=' + username + '&email=' + useremail + '&url=' + userurl + '&comment=' + comment,
            update: 'discussionthread',
            evalScripts: true,
            onComplete: function () {
                $('discussioncomment').value = comment_teaser;
                $('discussionerror').set('html', '<span style="color:#88aa88;">Your comment has been saved!</span>');
            }
        }).send();
    } else {
        if (comment == comment_teaser || comment == '') {
            $('discussionerror').set('html', 'Please enter a comment.');
        }
        if (username == '') {
            $('discussionerror').set('html', 'Please enter your name.');
        }
        if (useremail == '') {
            $('discussionerror').set('html', 'Please enter your email address.');
        }
    }
}

function reload_comments() {
    /*new Request.HTML({
        url: 'retrieve_comments.php',
        method: 'post',
        data: 'topic='+topic,
        update: 'discussionthread',
        evalScripts: true,
        onComplete: function(){
            t = setTimeout('reload_comments',15*60*1000);
        }
    }).send();*/
}
