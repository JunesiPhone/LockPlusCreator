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
 * -----Parameters-----
 * key: The prefix for all elements in this input. Ex: 'fontSize'
 * nameString: The relevant string, seperated by "~", properly formatted, from constants. Ex: constants.editArray[0]
 * unit: The css unit for what you're editing. Ex: 'px'
 * min: The minimum value for the number input. Inclusive. Ex: 0
 * max: The maximum value for the number input. Inclusive. Ex: 50
 * cssKey: The string for the css property to set. Ex:"font-size"
 * jsCssKey: The string for the css property, as referenced from javascript. Ex:"fontSize"
 * updateCallback: The function to call when the input is updated. Must accept the parameters
 *                idSelector, cssKey, unit, jsCssKey, and 'get' versus 'set' to either get the
 *                current value to set the value. Ex: action.updateSize
 * inputTopPos: Optional. The top position of the input. Ex: 120
 * inputRightPos: Optional. The right position of the input. Ex: 70
 * inputTitle: Optional. The text to show above the input. Ex: "Font Size"
 * intendedNumberOfInputs: Optional(ish). Necessary if multiple inputs are going to be shown. Ex: 2
 */

action.handleInputButtonEvent = function (idSelector, toMultiplyBy, cssKey, jsCssKey, unit, updateCallback, event) {
    var max,
        min;
    action.setHelpText('Shift+click to set to max/min. Alt+click to change by 10.');
    event.preventDefault();
    max = JSON.parse($(idSelector).attr('max'));
    min = JSON.parse($(idSelector).attr('min'));
    if (event.shiftKey) {
        action.sizeControl(idSelector, (toMultiplyBy > 0 ? max : min) - JSON.parse($(idSelector).val()));
    } else if (event.altKey) {
        action.sizeControl(idSelector, toMultiplyBy * 10);
    } else {
        action.sizeControl(idSelector, toMultiplyBy);
    }
    updateCallback(idSelector, cssKey, unit, jsCssKey, 'set');
};
action.getInputWrapper = function (key, inputRightPos, inputTopPos, min, max, inputTitle, isForText) {
    var divSelector = $('<div id="' + key + 'DivWrapper" style="display: none;"></div>'),
        decrementButton,
        incrementButton;
    if (!isForText) {
        decrementButton = $('<div id="' + key + 'Decrement" class="sizeControl" style="top: ' + (JSON.parse(inputTopPos) + 15) + '; right: ' + (JSON.parse(inputRightPos) + 93) + ';"></div>');
        $('<a href="#" class="fa fa-minus-circle" title="Try shift+clicking and alt+clicking!"></a>').appendTo(decrementButton);
        decrementButton.prependTo(divSelector);
        $('<input type="number" id="' + key + 'Input" min="' + min + '" max="' + max + '" title="Try using the scroll wheel!" style="top: ' + JSON.parse(inputTopPos) + '; right: ' + JSON.parse(inputRightPos) + '">').prependTo(divSelector);
        incrementButton = $('<div id="' + key + 'Increment" class="sizeControl inputLabel" data-title="' + inputTitle + '" style="top:' + (JSON.parse(inputTopPos) + 15) + '; right: ' + (JSON.parse(inputRightPos) + 11) + ';"></div>');
        $('<a href="#" class="fa fa-plus-circle" title="Try shift+clicking and alt+clicking!"></a>').appendTo(incrementButton);
        incrementButton.prependTo(divSelector);
    } else {
        $('<input type="text" id="' + key + 'Input" style="top: ' + JSON.parse(inputTopPos) + '; right: ' + JSON.parse(inputRightPos) + '">').prependTo(divSelector);
    }
    return divSelector;
};

/**
 * -----Parameters-----
 * key: The prefix for all elements in this input. Ex: 'align'
 * nameString: The relevant string, seperated by "~", properly formatted, from constants. Ex: constants.editArray[3]
 * options: An array of the names of the options. Ex: ['left', 'center', 'right']
 * optionsTop: The top position of the options. Ex: 10
 * adjustWidth: Manually set the width of the options I think? Ex: false
 * optionSelectedCallback: The function to call when an option has been selected. Must take id as a parameter.
 * getOptionElement: The function to call to create the actual element contained in the option div. Must take take optionName.
 */
action.cgOption = function (key, nameString, options, optionsTop, adjustWidth, optionSelectedCallback, getOptionElement) {
    var splitArr = nameString.split("~"),
        divSelector = '#' + key + 'DivWrapper',
        buttonSelector = '#' + splitArr[0], //The icon button
        right,
        margin,
        i,
        optionDivSelector,
        optionSelector,
        optionElement;
    if (optionsTop === 0 || !optionsTop) {
        optionsTop = $('#' + splitArr[3]).position().top + 11;
    }
    if (!$(divSelector).length) { //If the options haven't been created yet
        $('<div id="' + key + 'DivWrapper" style="display: block;" class="options"></div>').prependTo('#' + splitArr[3]);

        right = 80;
        margin = 0;
        for (i = options.length - 1; i >= 0; i -= 1) {
            optionDivSelector = '#' + options[i] + 'OptionDiv';
            optionSelector = '#' + options[i] + 'Option';
            $('<div id="' + options[i] + 'OptionDiv" style="top: ' + optionsTop + 'px;"></div>').appendTo($(divSelector));
            optionElement = getOptionElement(options[i]);
            optionElement.appendTo($('#' + options[i] + 'OptionDiv'));
            $(optionDivSelector).css({
                'right': right,
                'width': $('#' + options[i] + 'Option').width() + 10,
                'height': $('#' + options[i] + 'Option').height() + 2
            });
            if (typeof optionElement.attr('data-selected') !== 'undefined' && JSON.parse(optionElement.attr('data-selected'))) {
                optionElement.parent().attr('data-selected', 'true');
                optionElement.parent().css("background-color", "#21b9b0");
                optionElement.parent().css("border-color", "#21b9b0");
            }
            if (adjustWidth) {
                $(optionSelector).css({
                    'width': $('#' + options[i] + 'OptionDiv').css('width')
                });
            }
            if (i === 0) {
                $(optionDivSelector).attr('class', 'firstOption');
            } else if (i === options.length - 1) {
                $(optionDivSelector).attr('class', 'lastOption');
                right += JSON.parse($(optionDivSelector).css('border-right-width').replace(/\D+$/g, "")) * 2; //Hooray for regexes
            }
            right += ($(optionSelector).width() + margin);

            (function (index) {
                $(optionDivSelector).click(function () {
                    optionSelectedCallback('#' + options[index] + 'Option');
                });
            }(i));
            $(optionDivSelector).mouseover(function () {
                $(this).css("background-color", "#21b9b0");
                $(this).css("border-color", "#21b9b0");
            }).mouseout(function () {
                if ($(this).attr('data-selected') === 'false' || typeof $(this).attr('data-selected') === 'undefined') {
                    $(this).css("background-color", "#54606e");
                    $(this).css("border-color", "#54606e");
                }
            });
        }

        $(buttonSelector).parent().attr('class', ' '); //instead of removing the title, just remove class. hide toolTip
        $(divSelector).css('display', 'none'); // Have to have display set to block before this because sizing depends on the displayed width ↑
        $(divSelector).toggle('display');
    } else { //If the options already exists
        $(divSelector).is(':visible') ? $(buttonSelector).parent().attr('class', 'leftTooltip') : $(buttonSelector).parent().attr('class', ''); //If it's currently visible it will be hidden
    }
};
