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
 * Handling of setting text.
 *
 *
 */
action.cgCustomText = function () {
    action.cgText(constants.customTextArray[0], 'Custom Text', 'Text', function (idSelector) {
        $('#' + action.selectedItem).html($(idSelector).val()); // Sets the innerHTML of the element
        var newLength = $(idSelector).val().length * 16; // Calculates new length of the input
        $(idSelector).css("width", newLength > 150 ? newLength : 150); //Actually changes the length, which is then animated by -webkit-transition-property in css
        action.savedElements.placedElements[action.selectedItem].innerHTML = $(idSelector).val(); //Saves to localStorage
        action.saveStorage();
    }, function () {
        return $('#' + action.selectedItem).html();
    });
};

action.cgAffix = function (type) { // either 'prefix' or 'suffix'
    if (type === 'prefix') {
        action.cgText(constants.affixArray[0], 'Custom Prefix', 'Prefix', function (idSelector) {
            action.affixCallbacks(idSelector, 'prefix', 'set');
        }, function (idSelector) {
            return action.affixCallbacks(idSelector, 'prefix', 'get');
        });
    } else if (type === 'suffix') {
        action.cgText(constants.affixArray[1], 'Custom Suffix', 'Suffix', function (idSelector) {
            action.affixCallbacks(idSelector, 'suffix', 'set');
        }, function (idSelector) {
            return action.affixCallbacks(idSelector, 'suffix', 'get');
        });
    } else if (type === 'clear') {
        $('#' + action.selectedItem).html($('#' + action.selectedItem).html().replace($('#' + action.selectedItem).attr('data-prefix'), ''));
        $('#' + action.selectedItem).html($('#' + action.selectedItem).html().replace($('#' + action.selectedItem).attr('data-suffix'), ''));
        $('#' + action.selectedItem).attr('data-prefix', '');
        $('#' + action.selectedItem).attr('data-suffix', '');
        action.savedElements.placedElements[action.selectedItem]['data-suffix'] = '';
        action.savedElements.placedElements[action.selectedItem]['data-prefix'] = '';
        action.saveStorage();
        action.showProperMenuForId(action.selectedItem);
    }
};

action.affixCallbacks = function (idSelector, type, purpose) { //type is 'prefix' or 'suffix'
    var dataString = 'data-' + type;
    if (purpose === 'set') {
        var otherType = type === 'prefix' ? 'suffix' : 'prefix';
        if (type === 'prefix') {
            $('#' + action.selectedItem).html($('#' + action.selectedItem).html().replace($(idSelector).attr('data-last-value'), '')); //Remove the old affix first to get the raw element
            $('#' + action.selectedItem).html($('#' + action.selectedItem).html().replace($('#' + action.selectedItem).attr('data-' + otherType), '')); // Remove the other affix second to prevent issues
            $('#' + action.selectedItem).html($(idSelector).val() + $('#' + action.selectedItem).html()); //Add the new prefix to the element
        } else if (type === 'suffix') {
            $('#' + action.selectedItem).html($('#' + action.selectedItem).html().replace($('#' + action.selectedItem).attr('data-' + otherType), '')); // Remove the other affix first to prevent issues
            $('#' + action.selectedItem).html($('#' + action.selectedItem).html().replace($(idSelector).attr('data-last-value'), '')); //Remove the old affix second to get the raw element
            $('#' + action.selectedItem).html($('#' + action.selectedItem).html() + $(idSelector).val()); //Add the new suffix to the element
        }
        if (typeof $('#' + action.selectedItem).attr('data-' + otherType) != 'undefined') {
            if (otherType === 'prefix') {
                $('#' + action.selectedItem).html($('#' + action.selectedItem).attr('data-' + otherType) + $('#' + action.selectedItem).html()); //Add the other prefix to the element
            } else if (otherType === 'suffix') {
                $('#' + action.selectedItem).html($('#' + action.selectedItem).html() + $('#' + action.selectedItem).attr('data-' + otherType)); //Add the other suffix to the element
            }
        }
        $('#' + action.selectedItem).attr(dataString, $(idSelector).val()); //Save to the element, so when it updates the affix isn't overwritten
        $(idSelector).attr('data-last-value', $(idSelector).val()); // Need for above
        action.savedElements.placedElements[action.selectedItem][dataString] = $(idSelector).val(); //Save to localStorage
        action.saveStorage();
    } else if (purpose === 'get') {
        var initial = $('#' + action.selectedItem).attr(dataString);
        $(idSelector).attr('data-last-value', initial);
        return initial;
    }
};

action.cgText = function (nameString, inputTitle, textID, updateCallback, getInitial) {
    var splitArr = nameString.split("~");
    var inputTopPos = $('#' + splitArr[3]).position().top + 11;
    //var textID = action.selectedItem.substring(0, 1).toUpperCase() + action.selectedItem.substring(1); //capitalizes the selected item's id, for nice camel casing later
    var divSelector = '#custom' + textID + 'DivWrapper';
    var idSelector = '#custom' + textID + 'Input';
    var buttonSelector = '#' + splitArr[0];

    if (!$(divSelector).length) {
        var divWrapper = action.getInputWrapper('custom' + textID, 78, inputTopPos, 0, 0, inputTitle, true); //Gets the actual input
        divWrapper.prependTo('#' + splitArr[3]);

        function updateStuff() {
            var newLength = $(idSelector).val().length * 16; // Calculates new length of the input
            $(idSelector).css("width", newLength > 150 ? newLength : 150); //Actually changes the length, which is then animated by -webkit-transition-property in css
            updateCallback(idSelector);
        }

        $(idSelector).val(getInitial(idSelector));
        var width = $(idSelector).val().length * 16; //Sets initial width of the input
        $(idSelector).css('width', width > 150 ? width : 150); //Doesn't let the width go over 150 initially

        $(idSelector).on("change", function () {
            updateStuff();
        });
        $(idSelector).keydown(function () {
            updateStuff();
        });
        $(idSelector).keyup(function () {
            updateStuff();
        });
        $(idSelector).focusin(function () {
            action.isEditingText = true;
        });
        $(idSelector).focusout(function () {
            action.isEditingText = false;
        });

        $(buttonSelector).parent().toggleClass('leftTooltip'); //Remove the tooltip
        divWrapper.toggle('display'); //Show the input
        $(idSelector).focus(); //Auto focus on the input
    } else {
        $(buttonSelector).parent().toggleClass('leftTooltip'); //enable the toolTip Class again.
        $(divSelector).toggle('display');
    }
};
