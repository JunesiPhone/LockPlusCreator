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
  fontArray,
  $
*/
/**
 * Handling of sizes.
 *
 *
 */

action.cgSize = function (key, nameString, unit, min, max, cssKey, jsCssKey, updateCallback, inputTopPos, inputRightPos, inputTitle, intendedNumberOfInputs) {
    var splitArr = nameString.split("~"),
        divSelector = '#' + key + 'DivWrapper',
        idSelector = '#' + key + 'Input',
        buttonSelector = '#' + splitArr[0],
        elSize;
    if (inputTopPos === undefined || !inputTopPos) {
        inputTopPos = $('#' + splitArr[3]).position().top + 11;
    }
    if (inputRightPos === undefined || !inputRightPos) {
        inputRightPos = 80;
    }
    if (inputTitle === undefined || !inputTitle) {
        inputTitle = splitArr[1].substring(6, splitArr[1].length);
    }
    if (intendedNumberOfInputs === undefined || !intendedNumberOfInputs) {
        intendedNumberOfInputs = 1;
    }
    if (!$(divSelector).length) { //If the input hasn't been created yet
        action.getInputWrapper(key, inputRightPos, inputTopPos, min, max, inputTitle, false).prependTo('#' + splitArr[3]);

        $('#' + key + 'Decrement').on('click', function (event) {
            action.handleInputButtonEvent(idSelector, -1, cssKey, jsCssKey, unit, updateCallback, event);
        });
        $('#' + key + 'Increment').on('click', function (event) {
            action.handleInputButtonEvent(idSelector, 1, cssKey, jsCssKey, unit, updateCallback, event);
        });

        elSize = updateCallback(idSelector, cssKey, unit, jsCssKey, 'get');
        try {
            $(idSelector).val(Math.round(JSON.parse(elSize.substring(0, elSize.length - unit.length))));
        } catch (e) {
            console.log("There was an issue with setting the value of the input with idSelector:" + idSelector);
        }
        $(idSelector).on("focus", function () {
            action.setHelpText('Try scrolling while hovering over the input text!');
        });
        $(idSelector).on("change", function () {
            updateCallback(idSelector, cssKey, unit, jsCssKey, 'set');
        });
        $(idSelector).on("mousewheel", function (event) {
            var increment = 0;
            if (event.deltaY > 0 && !event.shiftKey) {
                increment = event.altKey ? 10 : 1;
            } else if (event.deltaY < 0 && !event.shiftKey) {
                increment = event.altKey ? -10 : -1;
            } else if (event.deltaX > 0 && event.shiftKey) {
                increment = JSON.parse($(idSelector).attr('min')) - $(idSelector).val();
            } else if (event.deltaX < 0 && event.shiftKey) {
                increment = JSON.parse($(idSelector).attr('max')) - $(idSelector).val();
            }
            $(idSelector).val(Math.round(JSON.parse($(idSelector).val()) + increment));
            updateCallback(idSelector, cssKey, unit, jsCssKey, 'set');
            event.preventDefault();
        });
        $(idSelector).focusin(function () {
            action.isEditingText = true;
        });
        $(idSelector).focusout(function () {
            action.isEditingText = false;
        });

        $(buttonSelector).parent().attr('class', ''); //just disable the leftToolTip Class? hide tooltip
        $(divSelector).toggle('display');
    } else { //If the input already exists
        if ($(divSelector).is(':visible')) {
            $(buttonSelector).parent().attr('class', 'leftTooltip');
        } else {
            $(buttonSelector).parent().attr('class', '');
        }
        $(divSelector).toggle('display');
    }
};

action.sizeControl = function (inputSelector, valueToAdd) {
    $(inputSelector).val(JSON.parse($(inputSelector).val()) + valueToAdd);
};
action.updateSize = function (idSelector, cssKey, unit, jsCssKey, purpose) {
    var max,
        min,
        elWidth,
        elPos,
        elDiff,
        valuesArr;
    if (purpose === 'set') {
        max = JSON.parse($(idSelector).attr('max'));
        min = JSON.parse($(idSelector).attr('min'));
        if (JSON.parse($(idSelector).val()) >= JSON.parse(max)) {
            $(idSelector).val(max);
        }
        if (JSON.parse($(idSelector).val()) <= JSON.parse(min)) {
            $(idSelector).val(min);
        }

        if (jsCssKey === 'width') {
            /* Check to see if setting width overflows screen */
            /* While changing the width, and the element bounds goes out of screen, move item left to stop overflow */

            elWidth = Math.round($(idSelector).val()); //current set width
            elPos = Math.round($('#' + action.selectedItem).position().left); //element position from the left
            elDiff = Math.round(elWidth - ($('.screen').width() - elPos)); //check difference in screen width compared to element position + set width

            if (elDiff > 0) {
                //action.setCss(action.selectedItem, 'left', (elPos - elDiff) +'px'); //make adjustments to the element
                elPos = (elPos - elDiff) + 'px';
            }

            $('#posLeftInput').attr('max', $('.screen').width() - $('#' + action.selectedItem).width());
            $('#posTopInput').attr('max', $('.screen').height() - $('#' + action.selectedItem).height());

            if (action.selectedItem.substring(3, 9) === 'Circle') { // Special for circles
                action.setCss([
                    [action.selectedItem, ['height', 'width', 'left'],
                        [$(idSelector).val() + unit, $(idSelector).val() + unit, elPos]
                    ]
                ]);
            } else if (idSelector === '#iconSizeInput') { // Special for icon
                valuesArr = [$(idSelector).val() + unit, elPos];
                action.setCss([
                    ['icon', ['width', 'left'], valuesArr],
                    ['iconImg', ['width', 'left'], valuesArr]
                ]);
            } else {
                action.setCss([
                    [action.selectedItem, [cssKey, 'left'],
                        [$(idSelector).val() + unit, elPos]
                    ]
                ]);
            }
        } else {
            action.setCss(action.selectedItem, cssKey, $(idSelector).val() + unit);
        }

        action.saveStorage();
    } else if (purpose === 'get') {
        return $('#' + action.selectedItem).css(cssKey);
    }
};
