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
 * Handling of mutliple styles
 *
 *
 */

action.autoCenter = function () {
    action.setCss(action.selectedItem, 'left', '0');
    action.setCss(action.selectedItem, 'width', '320');
};
action.cgcolor = function (color, cssKey, div) {
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
        $("#" + div).on('hide.spectrum', function (e, tinycolor) {
            $("#" + div).spectrum("destroy");
        });
    }
};
action.cgStyle = function () {
    var lastSelector = '#' + $('#' + action.selectedItem).css('font-style') + 'Option';
    this.cgOption('style', constants.editArray[9], ['italic', 'oblique', 'initial'], 0, true, function (optionSelector) {
        lastSelector = action.basicOptionSelected(optionSelector, lastSelector, 'font-style', $(optionSelector).attr('id').substring(0, $(optionSelector).attr('id').length - 6));
    }, function (optionName) {
        return action.getBasicOptionElement(optionName, 'text-align: center; font-style: ' + optionName, 'font-style');
    });
};
action.cgBorderStyle = function () {
    var lastSelector = '#' + $('#' + action.selectedItem).css('border-style') + 'Option';
    this.cgOption('borderStyle', constants.borderArray[0], ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'], 20, true, function (optionSelector) {
        lastSelector = action.basicOptionSelected(optionSelector, lastSelector, 'border-style', $(optionSelector).attr('id').substring(0, $(optionSelector).attr('id').length - 6));
    }, function (optionName) {
        return action.getBasicOptionElement(optionName, 'text-align:center; font-size:15px;', 'border-style');
    });
};
