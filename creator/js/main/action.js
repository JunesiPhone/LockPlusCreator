/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/

/*global
  constants,
  confirm,
  alert,
  $,
*/
var tempWall,
    action = {
        savedElements: {}, //object to save elements placed
        movedElements: {}, //elements that are placed and moved
        wallpaper: '',
        uploadSelection: '', //save type of upload selection (overlay or background)
        selectedItem: '',
        selectedItems: [], // Only used for multi-selection
        multiPositioningSystem: 'relative',
        actionQueue: [], //Queue of actions for undo/redo
        queuePosition: -1, //The current position within this ↑ queue, which action was most recently done
        isUndoingRedoing: false, //True while it's either undoing or redoing, prevents more from being added to the stack while it's processing the stack
        blurTimeout: null, //timout on blur action for action_background
        isEditingText: false, // Whether a custom text input is currently focused. Used for delete key stuff
        timeout: '',
        zoomScale: 1.5,
        isScrollingEdit: false,
        lastNotificationTime: false,
        sizeQueueTimeout: {
            timeout: null,
            isTimeoutRunning: false,
            previousCssKey: '',
            previousAction: null,
            initialValue: ''
        },
        createGrid: function (sizeleft, sizetop) {
            var i,
                sel = $('.grids'),
                height = sel.height(),
                width = sel.width(),
                ratioW = Math.floor(width / sizeleft),
                ratioH = Math.floor(height / sizetop);

            for (i = 0; i <= ratioW; i += 1) { // vertical grid lines
                $('<div />').css({
                    'top': 0,
                    'left': i * sizetop,
                    'width': 1,
                    'height': height
                }).addClass('gridlines').appendTo(sel);
            }

            for (i = 0; i <= ratioH; i += 1) { // horizontal grid lines
                $('<div />').css({
                    'top': i * sizeleft,
                    'left': 0,
                    'width': width,
                    'height': 1
                }).addClass('gridlines').appendTo(sel);
            }

            $('.gridlines').show();
        }

    }; //end action
