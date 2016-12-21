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
 * Handling of transforms.
 *
 *
 */

action.updateTransform = function (idSelector, cssKey, unit, jsCssKey, purpose) {
    var currentTransform,
        splitArray,
        index,
        compiledTransform,
        i;
    try {
        currentTransform = document.getElementById(action.selectedItem).style.webkitTransform;
    } catch (e) {
        alert("Sorry, please use chrome or safari for transforms.");
    }
    if (currentTransform !== '') {
        splitArray = currentTransform.replace(/deg/g, '').split(/[()]/);
    } else {
        splitArray = ['rotate', '0', ' skewX', '0', ' skewY', '0'];
    }
    // "rotate(0) skewX(0) skewY(0)"

    index = 0;
    switch (cssKey) {
    case "rotate":
        index = 1;
        break;
    case "skewX":
        index = 3;
        break;
    case "skewY":
        index = 5;
        break;
    }

    if (purpose === 'set') {
        splitArray[index] = $(idSelector).val();

        compiledTransform = '';
        for (i = 0; i < splitArray.length; i += 1) {
            if (splitArray[i] !== '') {
                if (isNaN(splitArray[i])) {
                    splitArray[i] = splitArray[i] + '(';
                } else {
                    splitArray[i] = splitArray[i] + 'deg)';
                }
                compiledTransform += splitArray[i];
            }
        }

        if (compiledTransform === 'rotate(0deg) skewX(0deg) skewY(0deg)') { // Everything's back to the start
            action.updateTransform(idSelector, cssKey, unit, jsCssKey, 'clear'); // So remove transform altogether
        } else {
            action.setCss(action.selectedItem, '-webkit-transform', compiledTransform);
        }
    }
    if (purpose === 'get') {
        return splitArray[index] + unit;
    }
    if (purpose === 'clear') {
        action.setCss(action.selectedItem, '-webkit-transform', '');
    }
};
