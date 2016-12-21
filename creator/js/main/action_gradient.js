/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true,
  regexp: true
*/
/*global
  action,
  alert,
  constants,
  $
*/
/**
 * Handling of gradients
 *
 *
 */
action.updateGradient = function (idSelector, cssKey, unit, jsCssKey, purpose) {
    var currentGradient,
        gradPieces,
        splitArray,
        i,
        e,
        index,
        keyArr,
        max,
        min,
        compiledGradient;
    if (purpose === 'clear') {
        if (action.selectedItem.indexOf("box") > -1) {
            action.setCss([[action.selectedItem, ['background', 'background-color'], ['', 'red']]]);
        } else {
            action.setCss([[action.selectedItem, ['background', '-webkit-background-clip', '-webkit-text-fill-color'], ['', '', '']]]);
        }
        return 'nothing';
    }

    currentGradient = document.getElementById(action.selectedItem).style.background;

    if (currentGradient !== '') {
        //Some browsers convert to rgb, but that messes with the splitting done below. So replace rgb with hex.
        currentGradient = currentGradient.replace(/(rgba?\([^)]+\))/gmi, function (match) {
            return match.replace(/[\/(]/g, '{').replace(/[,]/g, '!').replace(/[\/)]/g, '}').replace(/[ ]/g, '');
        });

        gradPieces = currentGradient.split('(');
        if (isNaN(gradPieces[1].substring(0, 1))) {
            currentGradient = gradPieces[0] + '(180deg,' + gradPieces[1];
        }
        splitArray = currentGradient.replace(/deg/g, '').replace(/[%]/g, '').split(/[(), ]/);
    } else {
        splitArray = ['linear-gradient', '179', 'rgb(255,0,0)', 'rgb(255,255,0)', '50', 'rgb(0,0,255)', '90'];
    }
    // "linear-gradient(179deg,red,yellow 50%,blue 90%)"

    for (i = 0; i < splitArray.length; i += 1) {
        if (splitArray[i] === '') {
            splitArray.splice(i, 1);
            i -= 1;
        } else if (splitArray[i].match(/[!]/g) !== null) {
            splitArray[i] = splitArray[i].replace(/[{]/g, '(').replace(/[!]/g, ',').replace(/[}]/g, ')');
        }
    }

    index = 0;
    keyArr = cssKey.split("~");

    if ((keyArr[0] === 'pos' || cssKey === 'rotate') && purpose === 'set') {
        max = JSON.parse($(idSelector).attr('max'));
        min = JSON.parse($(idSelector).attr('min'));
        if (JSON.parse($(idSelector).val()) >= JSON.parse(max)) {
            $(idSelector).val(max);
        }
        if (JSON.parse($(idSelector).val()) <= JSON.parse(min)) {
            $(idSelector).val(min);
        }
    }

    if (cssKey === 'rotate') {
        index = 1;
    } else {
        if (JSON.parse(keyArr[1]) * 2 + 1 >= splitArray.length) {
            if (purpose === 'set') {
                if (keyArr[0] === 'pos') {
                    index = splitArray.length - 1;
                } else {
                    splitArray.push("rgb(0,0,255)");
                    splitArray.push("100");
                    index = splitArray.length - 2;
                }
            } else if (purpose === 'get') {
                splitArray.push("rgb(0,0,255)");
                splitArray.push("100");

                if (keyArr[0] === 'color') {
                    index = splitArray.length - 2;
                } else if (keyArr[0] === 'pos') {
                    index = splitArray.length - 1;
                }
            }
        } else {
            if (keyArr[0] === 'color') {
                index = JSON.parse(keyArr[1]) * 2 + 1;
            } else if (keyArr[0] === 'pos') {
                index = JSON.parse(keyArr[1]) * 2 + 2;
            }
        }
    }

    if (purpose === 'set') {
        if (index <= 1 || keyArr[0] === 'pos') {
            splitArray[index] = $(idSelector).val();
        } else if (keyArr[0] === 'color') {
            splitArray[index] = jsCssKey;
        }

        compiledGradient = '';
        for (e = 0; e < splitArray.length; e += 1) {
            if (!isNaN(splitArray[e])) {
                if (e === 1) {
                    splitArray[e] = splitArray[e] + 'deg';
                } else {
                    splitArray[e] = splitArray[e] + '%';
                }

                if (e === splitArray.length - 1 || ((e + 1 === splitArray.length - 1) && splitArray[e + 1] === '')) {
                    splitArray[e] = splitArray[e] + ')';
                } else {
                    splitArray[e] = splitArray[e] + ',';
                }
            } else if (e === 0) {
                splitArray[e] = splitArray[e] + '(';
            } else if (e === 2) {
                splitArray[e] = splitArray[e] + ',';
            } else if (e > 2) {
                splitArray[e] = splitArray[e] + ' ';
            }
            compiledGradient += splitArray[e];
        }
        $('#' + action.selectedItem).css('background-image', 'red');
        action.setCss(action.selectedItem, 'background', compiledGradient);
        action.saveStorage();
    } else if (purpose === 'get') {
        return splitArray[index] + unit;
    }
};

//TODO automatically choose background on menu (gradient menu)
action.cgGradientPurpose = function () {
    var lastSelector;
    this.cgOption('gradientType', constants.linearGradientArray[0], ['background', 'text'], 14, true, function (optionSelector) {
        if (optionSelector === '#backgroundOption') {
            action.setCss([[action.selectedItem, ['-webkit-background-clip', '-webkit-text-fill-color'], ['', '']]]);
        } else if (optionSelector === '#textOption') {
            action.setCss([
                [action.selectedItem, ['-webkit-background-clip', '-webkit-text-fill-color'], ['text', 'transparent']]]);
        }
        action.saveStorage();

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
    }, function (optionName) {
        return $('<label id="' + optionName + 'Option" style="text-align: ' + optionName + ';">' + optionName + '</label>');
    });
};

action.cgLinearGradientColor = function (gradientString, cssKey) {
    var splitArray = gradientString.split("~"),
        selector = '#' + splitArray[3];

    $(selector).spectrum({
        showInitial: true,
        maxSelectionSize: 66,
        localStorageKey: 'spectrum',
        showAlpha: true,
        showInput: true,
        preferredFormat: "rgb",
        showPalette: true,
        color: action.updateGradient('', cssKey, '', '', 'get'),
        palette: [
            ["black", "white", "#0074d9", "#2c3e50", "#27ae60", "#e74c3c", "#393939", "#3498db", "#2980b9", "#2ecc71", "#66cc99", "#019875", "#96281b", "#96281b", "#f64747", "#e26a6a", "#f5ab35", "#f39c12", "#f89406", "#f27935", "#6c7a89", "#95a5a6", "#bdc3c7", "#bfbfbf", "#674172", "#663399", "#8e44ad", "#9b59b6", "#db0a5b", "#d2527f", "#f62459", "#16a085", "#d2d7d3", "#4183d7", "#59abe3", "#3a539b"]
        ]
    });
    setTimeout(function () {
        $(selector).spectrum('show');
    }, 0);

    $(selector).on('move.spectrum', function (ignore, tinycolor) {
        action.updateGradient('', cssKey, '', tinycolor.toRgbString(), 'set');
    });
};
