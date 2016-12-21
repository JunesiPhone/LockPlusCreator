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
 * Handling of fonts.
 * Note that preload of fonts is done in load.js
 *
 */
action.setFont = function (fontName) {
    action.setCss(action.selectedItem, 'font-family', fontName);
    $('#fList').toggle('display');
};

action.cgfont = function () {
    var i,
        li;
    $('#fList').empty();
    $('#fList').append('<li>Helvetica</li>');
    for (i = 0; i < fontArray.length; i += 1) {
        li = document.createElement('li');
        if (fontArray[i] === 'NEW FONTS') {
            li.innerHTML = fontArray[i];
            li.style.cssText += 'background-color:white; color:black;';
        } else {
            li.innerHTML = $('#' + action.selectedItem).text() + '-' + fontArray[i];
        }
        li.style.fontFamily = fontArray[i];
        li.title = fontArray[i];
        $('#fList').append(li);
    }
    $('#fList').toggle('display');
    setTimeout(function () {
        stroll.bind('#font ul');
    }, 1000);
};

action.cguppercase = function () {
    var lastSelector = '#' + $('#' + action.selectedItem).css('text-transform') + 'Option';
    this.cgOption('uppercase', constants.editArray[7], ['uppercase', 'capitalize', 'lowercase'], 0, true, function (optionSelector) {
        lastSelector = action.basicOptionSelected(optionSelector, lastSelector, 'text-transform', $(optionSelector).attr('id').substring(0, $(optionSelector).attr('id').length - 6));
    }, function (optionName) {
        //return $('<label id="' + optionName + 'Option" style="text-align: center; text-transform: ' + optionName + ';">' + optionName + '</label>');
        return action.getBasicOptionElement(optionName, 'text-align: center; text-transform: ' + optionName, 'text-transform');
    });
};

action.cgalign = function () {
    var lastSelector = '#' + $('#' + action.selectedItem).css('text-align') + 'Option';
    this.cgOption('align', constants.editArray[4], ['left', 'center', 'right'], 0, true, function (optionSelector) {
        if (optionSelector === '#centerOption') {
            var prmpt = confirm('Do you want this centered on the screen?\nIf you want it centered by a defined width press cancel.');
            if (prmpt === true) {
                action.autoCenter();
            }
        }
        lastSelector = action.basicOptionSelected(optionSelector, lastSelector, 'text-align', $(optionSelector).attr('id').substring(0, $(optionSelector).attr('id').length - 6));
    }, function (optionName) {
        return action.getBasicOptionElement(optionName, 'text-align: ' + optionName, 'text-align');
    });
};
