/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/
/*global
  action,
  alert,
  $
*/
/**
 * Handling of multi selects. Example Left, Right, Center or uppercase, capitalize, lowercase.
 *
 *
 */

action.basicOptionSelected = function (optionSelector, lastSelector, cssKey, setTo) {
    action.setCss(action.selectedItem, cssKey, setTo);
    return action.ultraBasicOptionSelected(optionSelector, lastSelector);
};
action.ultraBasicOptionSelected = function (optionSelector, lastSelector) {
    $(optionSelector).parent().css({
        'background-color': '#21b9b0',
        'border-color': '#21b9b0'
    }).attr('data-selected', 'true');
    if (lastSelector !== optionSelector) {
        $(lastSelector).parent().css({
            'background-color': '#54606e',
            'border-color': '#54606e'
        }).attr('data-selected', 'false');
    }
    lastSelector = optionSelector;
    return lastSelector;
};
action.getBasicOptionElement = function (optionName, style, cssKey) {
    var optionElement = $('<label id="' + optionName + 'Option" style="' + style + ';">' + optionName + '</label>');
    if ($('#' + action.selectedItem).css(cssKey) === optionName) {
        optionElement.attr('data-selected', 'true');
    }
    return optionElement;
};
