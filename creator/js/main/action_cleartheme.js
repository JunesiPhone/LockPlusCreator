/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/
/*global
  action,
  alert,
  constants,
  isMobile,
  $
*/
/**
 * Clears entire theme
 *
 *
 */
action.hideClearLabel = function () { //clear theme
    $('.noClear').remove();
    $('.yesClear').remove();
    $('.clearLabel').remove();
    $('#clear').parent().attr('class', 'leftTooltip');
};

action.clearTheme = function (code) { // -1 is to check, 0 doesn't clear theme, 1 clears theme
    var label,
        button;
    if (code === -1) { // check what to do
        if ($('.yesClear').length || $('.noClear').length || $('.clearLabel').length) { // Check to make confirmation isn't alreay showing
            action.clearTheme(0);
        } else {
            if (isMobile) {
                label = $('#clearDiv').position().top + 10; //auto align clear label
                button = label + 4;
                $('#clear').parent().attr('class', ' '); //Hide tooltip
                $('<button style="top:' + button + 'px; left:180px; background-color:#343434;" type="button" class="noClear">No</button>').prependTo('#clearDiv');
                $('<button style="top:' + button + 'px; left:120px; background-color:#343434;" type="button" class="yesClear">Yes</button>').prependTo('#clearDiv');
                $('<label style="top:' + label + 'px; left:200px; display:none;" class="clearLabel">Clear Theme?</label>').prependTo('#clearDiv');
            } else {
                label = $('#clearDiv').position().top + 13; //auto align clear label
                button = label + 4;
                $('#clear').parent().attr('class', ' '); //Hide tooltip
                $('<button style="top:' + button + 'px" type="button" class="noClear">No</button>').prependTo('#clearDiv');
                $('<button style="top:' + button + 'px" type="button" class="yesClear">Yes</button>').prependTo('#clearDiv');
                $('<label style="top:' + label + 'px" class="clearLabel">Clear Theme?</label>').prependTo('#clearDiv');
            }


            $('.yesClear').click(function () {
                action.clearTheme(1);
            });
            $('.noClear').click(function () {
                action.clearTheme(0);
            });
        }
    } else if (code === 0) { // hide confirmation
        action.hideClearLabel();
        action.setHelpText('Not cleared, click to edit elements. (Also delete)');
    } else if (code === 1) { // definitely clear the theme
        localStorage.removeItem('placedElements');
        action.savedElements = {};
        action.movedElements = {};
        action.selectedItem = '';
        $('#screenElements').empty();
        $('.newSVG').remove();
        $(".svg").remove();
        action.hideClearLabel(); // Avoid showing the help text for not clearing the label, just hiding it
        action.hideElementPanelElements();
        action.setBG(''); //culprit to object is undefined when placed
        $('.screenoverlay').css('background-image', '');
        $('.screen').prepend('<img class="svg"/>');

        //Clear undo/redo stuff
        action.actionQueue = [];
        action.queuePosition = -1;
        action.isUndoingRedoing = false;
        action.sizeQueueTimeout = {
            timeout: null,
            isTimeoutRunning: false,
            previousCssKey: '',
            previousAction: null,
            initialValue: ''
        };

        action.setHelpText('Cleared. Click "Show Elements Panel" to place elements.');
    }
};
