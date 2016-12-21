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
        lastNotificationTime: false,
        sizeQueueTimeout: {
            timeout: null,
            isTimeoutRunning: false,
            previousCssKey: '',
            previousAction: null,
            initialValue: ''
        },
        autoCenter: function () {
            action.setCss(action.selectedItem, 'left', '0');
            action.setCss(action.selectedItem, 'width', '320');
        },
        cgcolor: function (color, cssKey, div) {
            if (color) {
                action.setCss(action.selectedItem, cssKey, color);
            } else {
                $("#" + div).spectrum({
                    showInitial: true,
                    maxSelectionSize: 66,
                    localStorageKey: 'spectrum',
                    showAlpha: true,
                    showInput: true,
                    preferredFormat: "rgba",
                    showPalette: true,
                    color: $('#' + this.selectedItem).css(cssKey),
                    palette: [
                        ["black", "white", "#0074d9", "#2c3e50", "#27ae60", "#e74c3c", "#393939", "#3498db", "#2980b9", "#2ecc71", "#66cc99", "#019875", "#96281b", "#96281b", "#f64747", "#e26a6a", "#f5ab35", "#f39c12", "#f89406", "#f27935", "#6c7a89", "#95a5a6", "#bdc3c7", "#bfbfbf", "#674172", "#663399", "#8e44ad", "#9b59b6", "#db0a5b", "#d2527f", "#f62459", "#16a085", "#d2d7d3", "#4183d7", "#59abe3", "#3a539b"]
                    ]
                });
                setTimeout(function () {
                    $('#' + div).spectrum('show');
                }, 0); //give it time to load.
                $("#" + div).on('hide.spectrum', function (e, tinycolor) {
                    action.cgcolor(tinycolor.toRgbString(), cssKey, div);
                });
                $("#" + div).on('move.spectrum', function (e, tinycolor) {
                    action.cgcolor(tinycolor.toRgbString(), cssKey, div);
                });
            }
        },
        cgStyle: function () {
            var lastSelector = '#' + $('#' + action.selectedItem).css('font-style') + 'Option';
            this.cgOption('style', constants.editArray[9], ['italic', 'oblique', 'initial'], 0, true, function (optionSelector) {
                lastSelector = action.basicOptionSelected(optionSelector, lastSelector, 'font-style', $(optionSelector).attr('id').substring(0, $(optionSelector).attr('id').length - 6));
            }, function (optionName) {
                return action.getBasicOptionElement(optionName, 'text-align: center; font-style: ' + optionName, 'font-style');
            });
        },
        cgBorderStyle: function () {
            var lastSelector = '#' + $('#' + action.selectedItem).css('border-style') + 'Option';
            this.cgOption('borderStyle', constants.borderArray[0], ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'], 20, true, function (optionSelector) {
                lastSelector = action.basicOptionSelected(optionSelector, lastSelector, 'border-style', $(optionSelector).attr('id').substring(0, $(optionSelector).attr('id').length - 6));
            }, function (optionName) {
                return action.getBasicOptionElement(optionName, 'text-align:center; font-size:15px;', 'border-style');
            });
        },
        saveStorage: function (specialPurpose) { //save savedElements object to localStorage
            if (specialPurpose === 'wallpaper') {
                localStorage.setItem('wallpaper', action.wallpaper);
            } else {
                localStorage.setItem('placedElements', JSON.stringify(action.savedElements));
            }
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
