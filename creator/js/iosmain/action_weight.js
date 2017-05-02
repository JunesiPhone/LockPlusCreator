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
  $
*/
/**
 * Handling of font weight
 *
 *
 */


action.cgweight = function () {
    var lastSelector,
        selectedFontWeight = $('#' + action.selectedItem).css('font-weight'),
        wrapper,
        elSize,
        fontWeight,
        children,
        incrementButton,
        input,
        decrementButton,
        inputSelector,
        optionElement;
    if (selectedFontWeight !== '') {
        if (isNaN(selectedFontWeight)) {
            lastSelector = '#' + selectedFontWeight + 'Option';
        } else {
            lastSelector = '#boldnessOption';
        }
    }
    this.cgOption('weight', constants.editArray[8], ['boldness', 'bold', 'normal'], 0, true, function (optionSelector) {
        lastSelector = action.basicOptionSelected(optionSelector, lastSelector, 'font-weight',
            optionSelector !== '#boldnessOption' ? $(optionSelector).attr('id').substring(0, $(optionSelector).attr('id').length - 6) : $('#boldnessInput').val());
        if (optionSelector === '#boldOption') {
            $('#boldnessInput').val(700);
        } else if (optionSelector === '#normalOption') {
            $('#boldnessInput').val(400);
        }
    }, function (optionName) {
        if (optionName === 'boldness') {
            wrapper = action.getInputWrapper('boldness', 0, 0, 100, 900, '', false);
            wrapper.css('display', 'block');
            fontWeight = $('#' + action.selectedItem).css('font-weight');
            try {
                elSize = JSON.parse(fontWeight);
            } catch (e) {
                if (fontWeight === 'bold') {
                    elSize = 700;
                } else if (fontWeight === 'normal') {
                    elSize = 400;
                } else {
                    elSize = 100;
                }
            }

            children = $(wrapper).children();
            incrementButton = $(children[0]);
            input = $(children[1]);
            decrementButton = $(children[2]);
            input.val(elSize);
            input.attr('step', 100);
            input.css({
                'border-top-right-radius': 0,
                'border-bottom-right-radius': 0,
                'border-width': 0,
                'border-color': 'rgba(0,0,0,0)',
                'background-color': 'rgba(0,0,0,0)',
                'border-style': ''
            });
            wrapper.css({
                'width': 120,
                'height': 45,
                'background-color': 'rgba(0,0,0,0)',
                'border-width': 0
            });
            incrementButton.css({
                'border-width': 0
            });
            decrementButton.css({
                'border-width': 0
            });

            inputSelector = '#boldnessInput';
            incrementButton.on('click', function (event) {
                action.handleInputButtonEvent(inputSelector, 100, 'font-weight', 'font-weight', '', action.updateSize, event);
            });
            decrementButton.on('click', function (event) {
                action.handleInputButtonEvent(inputSelector, -100, 'font-weight', 'font-weight', '', action.updateSize, event);
            });

            $(input).on('mousewheel', function (event) {
                if (event.deltaY > 0) {
                    $(input).val(Math.round(JSON.parse($(input).val()) + ($(input).val() === $(input).attr('max') ? 0 : 100)));
                } else {
                    $(input).val(Math.round(JSON.parse($(input).val()) - ($(input).val() === $(input).attr('min') ? 0 : 100)));
                }
                event.preventDefault();
            });

            wrapper.attr('id', 'boldnessOption');
            wrapper.appendTo($("#boldnessOptionDiv"));
            wrapper.attr('class', 'noHoverChange');

            if (fontWeight === '400') {
                $('#normalOptionDiv').attr('data-selected', 'true');
                $('#normalOptionDiv').css("background-color", "#21b9b0");
                $('#normalOptionDiv').css("border-color", "#21b9b0");
            } else if (fontWeight === '700') {
                $('#boldOptionDiv').attr('data-selected', 'true');
                $('#boldOptionDiv').css("background-color", "#21b9b0");
                $('#boldOptionDiv').css("border-color", "#21b9b0");
            } else if (fontWeight === $(input).val()) {
                wrapper.parent().attr('data-selected', 'true');
                wrapper.parent().css("background-color", "#21b9b0");
                wrapper.parent().css("border-color", "#21b9b0");
            }

            return wrapper;
        }
        optionElement = $('<label id="' + optionName + 'Option" style="text-align: center; font-weight: ' + optionName + ';">' + optionName + '</label>');
        if ($('#' + action.selectedItem).css('font-weight') === optionName) {
            $('#' + $(optionElement).attr('id') + 'Div').attr('data-selected', 'true');
            $('#' + $(optionElement).attr('id') + 'Div').css("background-color", "#21b9b0");
            $('#' + $(optionElement).attr('id') + 'Div').css("border-color", "#21b9b0");
        }
        return optionElement;

    });
    $('#boldnessOptionDiv').css({
        'height': 29,
        'width': 110
    });
    $('#boldnessOption').css({
        'top': -9,
        'left': -12
    });
    $('#boldnessOption').hover(function () {
        $(this).css({
            'background-color': 'rgba(0,0,0,0)',
            'border-color': 'rgba(0,0,0,0)'
        });
    });
    $('#boldnessOption').on("change", function () {
        action.setCss(action.selectedItem, 'font-weight', $('#boldnessInput').val());
    });
    $('#boldnessOption').on("mousewheel", function () {
        action.setCss(action.selectedItem, 'font-weight', $('#boldnessInput').val());
    });
};
