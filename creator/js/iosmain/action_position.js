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
  constants,
  $
*/
/**
 * Handling of setting position.
 *
 *
 */

action.cgPosition = function () {
    this.cgSize('posLeft', constants.editArray[2], 'px', 0, $('.screen').width() - $('#' + action.selectedItem).width(), 'left', 'left', action.updateSize, '', '80', 'Left', 2);
    this.cgSize('posTop', constants.editArray[2], 'px', 0, $('.screen').height() - $('#' + action.selectedItem).height(), 'top', 'top', action.updateSize, '', '208', 'Top', 2);

    $('#' + action.selectedItem).on('drag', function () {
        $('#posLeftInput').val(Math.round(JSON.parse($('#' + action.selectedItem).position().left)));
        $('#posTopInput').val(Math.round(JSON.parse($('#' + action.selectedItem).position().top)));
    });
    $('#' + action.selectedItem).resize(function () {
        alert("test");
        $('#posLeftInput').attr('max', $('.screen').width() - $('#' + action.selectedItem).width());
    });
};

action.cgMultiPosition = function () {
    var i,
        e,
        curInputSelector,
        leftChange,
        topChange,
        initialPos;
    this.cgSize('multiPosLeft', constants.multiPosition, 'px', 0, 0, 'left', 'left', action.updateMultiPosition, '', '80', 'Left', 2);
    this.cgSize('multiPosTop', constants.multiPosition, 'px', 0, 0, 'top', 'top', action.updateMultiPosition, '', '208', 'Top', 2);

    //cgSize automatically initializes the inputs with values, but in relative mode, we want everything to start at 0
    for (i = 0; i < 2; i += 1) {
        curInputSelector = (i === 0 ? '#multiPosLeftInput' : '#multiPosTopInput');
        if (!$(curInputSelector).attr('initialized')) {
            $(curInputSelector).val(0);
            $(curInputSelector).attr('initialized', 'partial');
            $(curInputSelector).attr('lastVal', 0);
        }
    }

    // Since they were initialized weith maxes/mins of 0, they need to be updated
    action.updateMultiPosInputExtrema();

    $('#' + action.selectedItem).on('drag', function (ignore, ui) {
        //$('#posLeftInput').val(Math.round(JSON.parse($('#' + action.selectedItem).position().left)));
        //$('#posTopInput').val(Math.round(JSON.parse($('#' + action.selectedItem).position().top)));
        if (!$(ui.helper).attr('lastLeft')) {
            $(ui.helper).attr('lastLeft', ui.position.left);
        }
        if (!$(ui.helper).attr('lastTop')) {
            $(ui.helper).attr('lastTop', ui.position.top);
        }

        leftChange = ui.position.left - JSON.parse($(ui.helper).attr('lastLeft'));
        topChange = ui.position.top - JSON.parse($(ui.helper).attr('lastTop'));
        for (e = 0; e < action.selectedItems.length; e += 1) {
            initialPos = $('#' + action.selectedItems[e]).position();
            $('#' + action.selectedItems[e]).css('left', initialPos.left + leftChange);
            $('#' + action.selectedItems[e]).css('top', initialPos.top + topChange);
        }

        $(ui.helper).attr('lastLeft', ui.position.left);
        $(ui.helper).attr('lastTop', ui.position.top);
    });
};

// Sets the maxes and mins for the multipos inputs
action.updateMultiPosInputExtrema = function () {
    var maxLeft = 0,
        minLeft = 0,
        maxTop = 0,
        minTop = 0,
        elName,
        i,
        curMaxLeft,
        curMaxTop,
        curMinLeft,
        curMinTop;
    for (i = 0; i < action.selectedItems.length; i += 1) { // Go through each selected item and establish the farthest any single one could travel in a direction
        elName = '#' + action.selectedItems[i];


        curMaxLeft = action.getElementExtreme(elName, 'maxleft', 'rel');
        if (curMaxLeft > maxLeft) {
            maxLeft = curMaxLeft;
        }

        curMaxTop = action.getElementExtreme(elName, 'maxtop', 'rel');
        if (curMaxTop > maxTop) {
            maxTop = curMaxTop;
        }

        curMinLeft = action.getElementExtreme(elName, 'minleft', 'rel');
        if (curMinLeft < minLeft) {
            minLeft = curMinLeft;
        }

        curMinTop = action.getElementExtreme(elName, 'mintop', 'rel');
        if (curMinTop < minTop) {
            minTop = curMinTop;
        }
    }

    $('#multiPosLeftInput').attr('max', maxLeft).attr('min', minLeft);
    $('#multiPosTopInput').attr('max', maxTop).attr('min', minTop);
};

/**
 * Gets a max/min that a relative movement input is allowed to go to
 * extreme : 'maxleft', 'minleft', 'maxtop', 'mintop'
 * mode : 'rel' for relative or 'abs' for absolute
 */
action.getElementExtreme = function (elName, extreme, mode) {
    if (!elName.includes('#')) {
        elName = '#' + elName;
    }
    var pos = $(elName).position();
    switch (extreme) {
    case 'maxleft':
        if (mode === 'rel') {
            return JSON.parse($('#multiPosLeftInput').val()) + ($('.screen').width() - $(elName).width() - pos.left);
        }
        return $('.screen').width() - $(elName).width();
    case 'minleft':
        if (mode === 'rel') {
            return JSON.parse($('#multiPosLeftInput').val()) + (-1 * pos.left);
        }
        return 0;
    case 'maxtop':
        if (mode === 'rel') {
            return JSON.parse($('#multiPosTopInput').val()) + ($('.screen').height() - $(elName).height() - pos.top);
        }
        return $('.screen').height() - $(elName).height();
    case 'mintop':
        if (mode === 'rel') {
            return JSON.parse($('#multiPosTopInput').val()) + (-1 * pos.top);
        }
        return 0;
    default:
        return 0;
    }
};

action.cgPosSystem = function () {
    var lastSelector = '#' + action.multiPositioningSystem + 'Option';
    this.cgOption('posSystem', constants.positioningSystemOption, ['relative', 'absolute'], 0, true, function (optionSelector) {
        lastSelector = action.posSystemSelected(optionSelector, lastSelector);
    }, function (optionName) {
        var el = $('<label id="' + optionName + 'Option">' + optionName + '</label>');
        if (optionName === 'relative') {
            el.attr('data-selected', 'true');
        }
        return el;
    });
};

action.posSystemSelected = function (optionSelector, lastSelector) {
    action.multiPositioningSystem = $(optionSelector).attr('id').substring(0, $(optionSelector).attr('id').length - 6);
    action.showMultiSelectionMenu(); // Update the menu. Changes the positioning inputs
    return action.ultraBasicOptionSelected(optionSelector, lastSelector);
};

action.updateMultiPosition = function (idSelector, cssKey, unit, jsCssKey, purpose) {
    var max,
        min,
        originalDelta,
        i,
        initial,
        elSelector,
        e,
        newValue,
        curMax,
        curMin,
        pos,
        delta;
    if (purpose === 'set') {
        max = JSON.parse($(idSelector).attr('max'));
        min = JSON.parse($(idSelector).attr('min'));
        originalDelta = JSON.parse($(idSelector).val()) - JSON.parse($(idSelector).attr('lastVal'));
        if (JSON.parse($(idSelector).val()) >= max) {
            $(idSelector).val(max);
        }
        if (JSON.parse($(idSelector).val()) <= min) {
            $(idSelector).val(min);
        }
        for (i = 0; i < action.selectedItems.length; i += 1) { // Save the initial values for each selectedItem
            if ($(idSelector).attr('initialized') === 'partial') { // If this is the first time the element's been moved
                $('#' + action.selectedItems[i]).attr("initial" + cssKey, $('#' + action.selectedItems[i]).css(cssKey));
                if (i === action.selectedItems.length - 1) {
                    $(idSelector).attr('initialized', 'full');
                }
            }
        }
        //Now we're actually setting things
        initial = 0;
        for (e = 0; e < action.selectedItems.length; e += 1) {
            elSelector = '#' + action.selectedItems[e];
            initial = $(elSelector).attr('initial' + cssKey);

            initial = initial.substring(0, initial.length - unit.length); // Remove 'px' from the end
            initial = JSON.parse(initial); // Convert it to a number

            newValue = initial + JSON.parse($(idSelector).val());
            if (cssKey === 'left') {
                curMax = action.getElementExtreme(elSelector, 'maxleft', 'abs');
                curMin = action.getElementExtreme(elSelector, 'minleft', 'abs');
            } else if (cssKey === 'top') {
                curMax = action.getElementExtreme(elSelector, 'maxtop', 'abs');
                curMin = action.getElementExtreme(elSelector, 'mintop', 'abs');
            } else { // Something's gone wrong
                curMax = 1000;
                curMin = -1000;
            }
            pos = $(elSelector).position()[cssKey];
            delta = $(idSelector).val() - JSON.parse($(idSelector).attr('lastVal'));
            if (newValue < curMax && newValue > curMin) {
                if ((pos === curMax - 1 || pos === curMax) && originalDelta > 0) { // If it's at or near the max
                    action.setCss(action.selectedItems[e], cssKey, curMax); // Set it to the max
                    //console.log("SettinG To " + curMax);
                } else if ((pos === curMin + 1 || pos === curMin) && originalDelta < 0) { // f it's at or near the min
                    action.setCss(action.selectedItems[e], cssKey, curMin); // Set it to the min
                    //console.log("SeTting To " + curMin);
                } else {
                    action.setCss(action.selectedItems[e], cssKey, newValue);
                    //console.log("Setting to " + newValue);
                }
            } else { // The stuff below makes it so that when you run into an edge, when later going the opposite direction, their relative positions to each other update
                if (newValue >= curMax && delta > 0) {
                    if (curMax - pos !== 0) {
                        delta -= curMax - pos; // This fixes a bug with elements getting off from each other when hitting edges then leaving it
                        action.setCss(action.selectedItems[e], cssKey, curMax);
                    }
                    initial -= delta;
                    //console.log("decrementing initial" + cssKey + ' of ' + action.selectedItems[i] + ' by ' + delta);
                    //console.log("Setting To " + curMax);
                } else if (newValue <= curMin && delta < 0) {
                    if (curMin - pos !== 0) {
                        delta -= curMin - pos;
                        action.setCss(action.selectedItems[e], cssKey, curMin);
                    }
                    initial -= delta;
                    //console.log("incrementing initial" + cssKey + ' of ' + action.selectedItems[i] + ' by ' + delta);
                    //console.log("SEtting to " + curMin);
                }
                action.updateMultiPosInputExtrema();
                $(elSelector).attr('initial' + cssKey, initial + unit);
            }
        }

        $(idSelector).attr('lastVal', $(idSelector).val());

        action.saveStorage();
    } else if (purpose === 'get') {
        return $('#' + action.selectedItem).css(cssKey);
    }
};
