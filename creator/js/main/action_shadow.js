/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/
/*global
  action,
  alert,
  isMobile,
  $
*/
/**
 * Handling of setting shadows.
 *
 *
 */
action.cgShadowColor = function (isForBox) {
    var selector = isForBox ? '#boxshadowColorDiv' : '#shadowColorDiv';
    if (isMobile) {
        selector = isForBox;
    }
    $(selector).spectrum({
        showInitial: true,
        maxSelectionSize: 66,
        localStorageKey: 'spectrum',
        showAlpha: true,
        showInput: true,
        preferredFormat: "rgb",
        showPalette: true,
        color: action.updateShadow('', '', '', '', 'get'),
        palette: [
            ["black", "white", "#0074d9", "#2c3e50", "#27ae60", "#e74c3c", "#393939", "#3498db", "#2980b9", "#2ecc71", "#66cc99", "#019875", "#96281b", "#96281b", "#f64747", "#e26a6a", "#f5ab35", "#f39c12", "#f89406", "#f27935", "#6c7a89", "#95a5a6", "#bdc3c7", "#bfbfbf", "#674172", "#663399", "#8e44ad", "#9b59b6", "#db0a5b", "#d2527f", "#f62459", "#16a085", "#d2d7d3", "#4183d7", "#59abe3", "#3a539b"]
        ]
    });
    setTimeout(function () {
        $(selector).spectrum('show');
    }, 0); //give it time to load.
    $(selector).on('move.spectrum', function (e, tinycolor) {
        action.updateShadow(isForBox ? 'box' : '', tinycolor.toRgbString(), 'px', 'color', 'set'); //Added special case to updateShadow for this
    });
    $(selector).on('hide.spectrum', function (e, tinycolor) {
        $(selector).spectrum("destroy");
    });
};

action.updateShadow = function (idSelector, cssKey, unit, jsCssKey, purpose) {
    var isForBox,
        currentShadow,
        splitShadow,
        index = 0,
        newShadow;
    isForBox = action.selectedItem.indexOf("box") > -1;
    currentShadow = !isForBox ? $('#' + action.selectedItem).css('text-shadow') : $('#' + action.selectedItem).css('box-shadow');
    if (currentShadow !== 'none') {
        splitShadow = currentShadow.split(' ');
    } else {
        splitShadow = ['#ffffff', '0px', '0px', '0px'];
    }

    //Dealing with stupid browser reordering
    if (!splitShadow[0].indexOf('px') > -1 && splitShadow[0].indexOf("rgb") > -1) { //If the first splitShadow index doesn't contain 'px' and does contain 'rgb'
        if (splitShadow[0].indexOf('rgba') > -1) {
            splitShadow[0] = splitShadow[0] + splitShadow[1] + splitShadow[2] + splitShadow[3];
            splitShadow[1] = splitShadow[4];
            splitShadow[2] = splitShadow[5];
            splitShadow[3] = splitShadow[6];
        } else {
            splitShadow[0] = splitShadow[0] + splitShadow[1] + splitShadow[2];
            splitShadow[1] = splitShadow[3];
            splitShadow[2] = splitShadow[4];
            splitShadow[3] = splitShadow[5];
        }
    }

    if (jsCssKey === (!isForBox ? 'hShadow' : 'boxhShadow')) {
        index = 1;
    } else if (jsCssKey === (!isForBox ? 'vShadow' : 'boxvShadow')) {
        index = 2;
    } else if (jsCssKey === (!isForBox ? 'blur' : 'boxblur')) {
        index = 3;
    } else if (jsCssKey === (!isForBox ? 'color' : 'boxcolor')) {
        index = 0;
    }

    if (purpose === 'set') {
        newShadow = '';

        if (idSelector.charAt(0) === '#') {
            splitShadow[index] = $(idSelector).val() + unit;
        } else {
            splitShadow[index] = cssKey;
        }

        newShadow = splitShadow[0] + ' ' + splitShadow[1] + ' ' + splitShadow[2] + ' ' + splitShadow[3]; // Parse into correct format for css. Could've done a loop, but that's not necessary
        if (!isForBox) {
            action.setCss(action.selectedItem, 'text-shadow', newShadow);
        } else {
            action.setCss(action.selectedItem, 'box-shadow', newShadow);
        }
    }
    if (purpose === 'get') {
        return splitShadow[index];
    }
    if (purpose === 'clear') {
        if (isForBox) {
            action.setCss(action.selectedItem, 'box-shadow', 'none');
        } else {
            action.setCss(action.selectedItem, 'text-shadow', 'none');
        }
    }
};
