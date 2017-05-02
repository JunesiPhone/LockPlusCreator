/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/
/*global
  action,
  $,
*/


/**
 * Add/Remove elements from the screen
 *
 *
 */
action.showPanelHelpText = function (list) {
    if ($('#' + list).css('display') === 'none') {
        action.setHelpText('Either scroll, use the arrow buttons, or use the arrow keys to navigate the element menu.');
    }
};

action.animateHelp = function (text, opacity, time) {
    $("#tips").animate({
        opacity: opacity,
        top: 'toggle'
    }, time, function () { // Called when it's done animating
        if (text) {
            action.setHelpText(text); // This is what does the 'queuing effect' kinda
        }
    });
};
action.setHelpText = function (text) {
    var isStillShowing = $('#tips').is(":visible"),
        now;
    clearTimeout(action.timeout);
    if (!$('#tips').is(':animated')) { // Don't do anything if it's animating
        if (isStillShowing) { //If it's already showing, hide the old help text
            if ($('#helpinfo').text() !== text) {
                now = Date.now();
                if (action.lastNotificationTime && now - action.lastNotificationTime > 50) { //If it's a person clicking things, not backend calls
                    action.lastNotificationTime = Date.now(); //Since it's changing the tip shown, update when it was last called, the current time
                    action.animateHelp(text, 1, 300); // Show the new text
                }
            } else { // If it's the same tip, and it's already showing, reset the countdown to hiding the tip
                action.timeout = setTimeout(function () {
                    action.animateHelp(false, 0, 200);
                }, 5000);
            }
        } else { // Show a new tip
            $('#helpinfo').text(text); // Actually set the text
            action.lastNotificationTime = Date.now(); // For spam checking purposes
            action.animateHelp(false, 1, 300); // Show the tip
            action.timeout = setTimeout(function () { // In 5 seconds, hide the tip
                action.animateHelp(false, 0, 200);
            }, 5000);
        }
    }
};
