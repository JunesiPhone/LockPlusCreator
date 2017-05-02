/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/
/*global
  action,
  $
*/
/**
 * ElementPanel is the main buttons on the left when main buttons are shown
 * div (class) = elementPanel
 * Loads after action.js as it contains constants and action object
 */
action.elementIconClick = function () {
    if (!$('.elementPanel').is(":visible")) {
        action.setHelpText('Choose item from right panel');

        if (!$('.elementPanel').attr('data-shown')) {
            action.toggleAllElementPanels();
            $('.elementPanel').attr('data-shown', 'Congratulations, curious one. You are the millionth visitor!');
        }
    }

    /* show/hide text and smooth animation */
    if ($('.elementPanel').is(":visible")) {
        $('#elementDiv').children('a:first')[0].title = "Show Elements Panel";
        $(".elementPanel").animate({
            opacity: 0,
            marginTop: '-300px'
        }, {
            duration: 200,
            specialEasing: {
                opacity: "linear",
                marginTop: "easeInOutCirc"
            },
            complete: function () {
                $('.elementPanel').toggle();
            }
        });
    } else {
        $('#elementDiv').children('a:first')[0].title = "Hide Elements Panel";
        $('.elementPanel').css({
            opacity: '0',
            //left: '53%',
            marginTop: '-300px'
        });
        $('.elementPanel').toggle();
        $(".elementPanel").animate({
            opacity: 1,
            marginTop: 0
        }, {
            duration: 200,
            specialEasing: {
                opacity: "linear",
                marginTop: "easeInOutCirc"
            },
            complete: function () {
                //do nothing
                return;
            }
        });
    }
};

action.showPanel = function (list) {
    $('#' + list).css('visibility', 'visible'); //new function instead of running createLI again.
};

action.elementPanel = function (id, duration) { //show hide items in element Panel
    var dur = duration !== 'undefined' ? duration : 400;
    if (id === 'cl') {
        $('#clockList').toggle(dur, action.showPanelHelpText('clockList')); /*this.createLI(elementPanel.clockElements, 'clockList');*/
        this.showPanel('clockList');
    }
    if (id === 'wl') {
        $('#weatherList').toggle(dur, action.showPanelHelpText('weatherList')); /*this.createLI(elementPanel.weatherElements, 'weatherList');*/
        this.showPanel('weatherList');
    }
    if (id === 'sl') {
        $('#systemList').toggle(dur, action.showPanelHelpText('systemList')); /*this.createLI(elementPanel.systemElements, 'systemList');*/
        this.showPanel('systemList');
    }
    if (id === 'ml') {
        $('#miscList').toggle(dur, action.showPanelHelpText('miscList')); /*this.createLI(elementPanel.miscElements, 'miscList');*/
        this.showPanel('miscList');
    }
};
action.getElementPanelIdSelector = function (id) { // Sadly I can't put this into that ↑
    var name;
    if (id === 'cl') {
        name = '#clockList';
    } else if (id === 'wl') {
        name = '#weatherList';
    } else if (id === 'sl') {
        name = '#systemList';
    } else if (id === 'ml') {
        name = '#miscList';
    }
    return name;
};
action.toggleAllElementPanels = function () {
    action.elementPanel('cl', 0);
    action.elementPanel('wl', 0);
    action.elementPanel('sl', 0);
    action.elementPanel('ml', 0);
};

action.hideElementPanelElements = function () {
    var elementPanelElements = $('.elementPanel').children(),
        i,
        j,
        subcategoryChildren,
        child;
    for (i = 0; i < elementPanelElements.length; i += 1) {
        if ($(elementPanelElements[i]).is('div')) {
            if ($(elementPanelElements[i]).is(":visible")) {
                $(elementPanelElements[i - 1]).click();
            }

            subcategoryChildren = $($(elementPanelElements[i]).find('div')).find('li');
            for (j = 0; j < subcategoryChildren.length; j += 1) {
                child = $(subcategoryChildren[j]);
                if (child.attr('data-element') !== 'undefined' && child.css('background-color') !== "#54606e" && child.css('background-color') !== "rgb(84, 96, 110)") {
                    child.css('background-color', '#54606e');
                    child.css('border-color', '#54606e');
                }
            }
        }
    }
};
