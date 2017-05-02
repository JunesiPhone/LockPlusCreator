/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true,
  unparam: true
*/
/*global
  action,
  alert,
  handleScreenClick,
  constants,
  $
*/
/**
 * Draggable options for every element
 *
 *
 */
action.addDraggable = function (id) {
    var contain;
    if (id === 'icon') {
        contain = '';
    } else {
        contain = $('.screen');
    }
    /*var startX;
    var startY;*/
    $('#' + id).draggable({
        containment: contain,
        start: function (event, ui) {
            /* if dLine class has title the same as id remove it */
            /* remove it on start to not mess with it's own movement */
            /* it will snap to itself this solves that issue */
            $(".dLine[title='" + id + "']").remove();
            if (action.selectedItem !== id) {
                handleScreenClick(event);
            }

            action.sizeQueueTimeout.initialValue = [$('#' + id).position().top, $('#' + id).position().left]; //Just borrowing it, nothing else will need this while you're moving an element
        },
        stop: function (event, ui) {
            var position = $('#' + id).position(),
                snapper,
                el;
            action.addAction(['setCss', [
                [id, ['top', 'left'], action.sizeQueueTimeout.initialValue, [position.top, position.left]]
            ]]);
            action.sizeQueueTimeout.initialValue = '';

            // Since we're not going through setCss, it's never saved to localStorage. Gotta do it manually
            action.savedElements.placedElements[id].left = position.left;
            action.savedElements.placedElements[id].top = position.top;
            action.saveStorage();

            /* So a random bug popped up, when an item is dragged it sets a height. WHY?
               Which means if you resize the font the bounding box didn't change. This fixes that.
             */
            if ($.inArray(id, constants.widgets) != -1) {
                if (id.substring(0, 3) !== 'box' && id.substring(3, 9) !== 'Circle') { //don't change box //don't change circle
                    $('#' + id).css('height', 'auto');
                }
            }

            /* Create a div around the element which can be used for snapping */
            if (localStorage.snap === 'true') {
                snapper = $('<div>', {
                    'class': 'dLine',
                    'title': id
                });
                el = $('#' + id);
                position = el.position();
                snapper.insertBefore(el);
                snapper.css({
                    top: position.top + 'px',
                    left: position.left + 'px',
                    width: el.width(),
                    height: el.height()
                });
            }
        },
        snap: '.dLine' //snap other items to that div.
    });
};
