var deleteAllGroupMembers = (function () {
    var deleteAllGroupMembers = {};
    // the facebook ids of the users that will not be removed.
    // IMPORTANT: add your own facebook id here so that the script will not remove yourself!
    var excludedFbIds = ['607236369']; // make sure each id is a string!
    var usersToDeleteQueue = [];
    var scriptEnabled = false;
    var processing = false;
    var count = 0;

    deleteAllGroupMembers.start = function() {
        scriptEnabled = true;
        deleteAll();
    };
    deleteAllGroupMembers.stop = function() {
        scriptEnabled = false;
    };

    function deleteAll() {
        if (scriptEnabled) {
            queueMembersToDelete();
            processQueue();
        }
    }

    function queueMembersToDelete() {
        var adminActions = document.getElementsByClassName('adminActions');
        console.log(excludedFbIds);
        for(var i=0; i<adminActions.length; i++) {

            var fbMemberId = document.getElementsByClassName('adminActions')[i].getElementsByTagName('button')[0].attributes['data-testid'].value.replace('admin_action_menu_button', '');

            if (excludedFbIds.indexOf(fbMemberId) != -1) {
                console.log("SKIPPING "+' ('+fbMemberId+')');
                continue;
            } else {
                usersToDeleteQueue.push({'memberId': fbMemberId, 'gearWheelIconDiv': adminActions[i]});
            }
        }
    }

    function processQueue() {
        if (!scriptEnabled) {
            return;
        }
        if (usersToDeleteQueue.length > 0) {
            removeNext();

            console.log(count);

            setTimeout(function(){
                processQueue();
            },100);
        } else {

            getMore();
        }
    }

    function removeNext() {
        if (!scriptEnabled) {
            return;
        }
        if (usersToDeleteQueue.length > 0) {
            var nextElement = usersToDeleteQueue.shift();
            removeMember(nextElement.memberId, nextElement.gearWheelIconDiv);
        }
    }

    function removeMember(memberId, gearWheelIconDiv) {
        if (processing) {
            return;
        }

        console.log('deleting ' + memberId);

        var gearWheelHref = gearWheelIconDiv.getElementsByTagName('button')[0];
        gearWheelHref.click();
        processing = true;
        setTimeout(function(){

            foo = gearWheelIconDiv;

            var popupID = gearWheelHref.attributes['aria-controls'].value;

            var popupDiv = document.getElementById(popupID);

            var popupLinks = popupDiv.getElementsByTagName('a');

            for(var j=0; j<popupLinks.length; j++) {
            // for(var j=0; j<popupLinks.length; j++) {
                if (popupLinks[j].getAttribute('href').indexOf('remove.php') !== -1) {
                    // this is the remove link

                    console.log('clickingOn ' + popupLinks[j]);

                    popupLinks[j].click();

                    setTimeout(function(){

                        let confirmButtonCount = document.getElementsByClassName('layerConfirm uiOverlayButton').length;

                        // Click any and all confirm buttons
                        for (var x=0; x<confirmButtonCount; x++) {
                            document.getElementsByClassName('layerConfirm uiOverlayButton')[x].click();
                        }

                        count = count + 1;

                        setTimeout(function() {

                            // if there are cancel buttons (like your request has been stopped)
                          if (document.getElementsByClassName('autofocus layerCancel').length) {

                            // Click cancel, and then cancel
                            document.getElementsByClassName('autofocus layerCancel')[0].click();
                            document.getElementsByClassName('layerCancel uiOverlayButton')[0].click();
                          }

                          processing = false;

                        }, (Math.random() * 1000) + 3000);
                    },(Math.random() * 400) + 1000);
                    // continue;
                }
            }
        },(Math.random() * 300) + 500);
    }

    function canClick(el) {
        return (typeof el != 'undefined') && (typeof el.click != 'undefined');
    }

    function getMore() {
        processing = true;
        more = document.getElementsByClassName("pam uiBoxLightblue  uiMorePagerPrimary");
        if (typeof more != 'undefined' && canClick(more[0])) {
            more[0].click();
            setTimeout(function(){
                deleteAll();
                processing = false;
           }, 2000);
        } else {
            deleteAllGroupMembers.stop();
        }
    }

    function getTextFromElement(element) {
        var text = element.textContent;
        return text;
    }

    function getElementByAttribute(attr, value, root) {
        root = root || document.body;
        if(root.hasAttribute(attr) && root.getAttribute(attr) == value) {
            return root;
        }
        var children = root.children,
            element;
        for(var i = children.length; i--; ) {
            element = getElementByAttribute(attr, value, children[i]);
            if(element) {
                return element;
            }
        }
        return null;
    }
    return deleteAllGroupMembers;
})();
deleteAllGroupMembers.start();

// stop the script by entering this in the console: deleteAllGroupMembers.stop();