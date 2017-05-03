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
 * Handling of setting css values. The hard way.
 *
 *
 */

function isAlreadyInArr(arr, toTest) {
    var i;
    for (i = 0; i < arr.length; i += 1) {
        if (arr[i][0] === toTest) {
            return true;
        }
    }
    return false;
}

//used when moving multiple elements
action.absolutePos = function (elementId, cssKey, cssValue) {
    var i, arr;
    if (typeof elementId === 'string') {
        elementId = [
            [elementId, cssKey, cssValue]
        ];
    }
    for (i = 0; i < action.selectedItems.length; i += 1) {
        if (!isAlreadyInArr(elementId, action.selectedItems[i])) {
            arr = [action.selectedItems[i], elementId[0][1], elementId[0][2]];
            elementId.push(arr);
        }
    }
    return elementId;
};

action.usualCss = function (elementId, cssKey, cssValue) {
    var initialValue,
        newValue,
        currentAction;
    if (cssKey === '-webkit-transform') {
        try {
            initialValue = document.getElementById(elementId).style.webkitTransform;
        } catch (e) {
            alert("Sorry, please use chrome or safari for transforms.");
        }
    } else { // What it'll usually do
        initialValue = document.getElementById(elementId).style[cssKey]; // Woud've used .css, but Jquery's a bitch about some things, returning things it shouldn't and breaking everything
    }
    $('#' + elementId).css(cssKey, cssValue);


    action.savedElements.placedElements[elementId][cssKey] = cssValue;
    action.saveStorage();

    clearTimeout(action.sizeQueueTimeout.timeout); // Always clear the old timeout when trying to override
    if (action.sizeQueueTimeout.initialValue === '') { // If it's empty, that means it's been used and is no longer needed
        action.sizeQueueTimeout.initialValue = initialValue; // So set the new one, because this is a new set
    }
    if (cssKey === '-webkit-transform') {
        try {
            newValue = document.getElementById(elementId).style.webkitTransform;
        } catch (e) {
            alert("Sorry, please use chrome or safari for transforms.");
        }
    } else {
        newValue = document.getElementById(elementId).style[cssKey];
    }
    currentAction = ['setCss', [elementId, cssKey, action.sizeQueueTimeout.initialValue, newValue]]; // The value stored in the actual undo/redo queue
    if (cssKey === action.sizeQueueTimeout.previousCssKey || action.sizeQueueTimeout.previousCssKey === '') { // If we're continuing the setting of the same css key
        action.sizeQueueTimeout.previousAction = currentAction;
    } else { // We've moved on to a differnt css key
        if (action.sizeQueueTimeout.isTimeoutRunning) { // Really should be wasTimeoutRunning
            action.addAction(action.sizeQueueTimeout.previousAction); // Add the old action to the undo/redo queue
            action.sizeQueueTimeout.initialValue = initialValue; // Take after-the-fact action, because the timeout never finished, this was never set to '', therefore the if statement above never ran
        }
        action.sizeQueueTimeout.previousAction = currentAction;
    }
    action.sizeQueueTimeout.timeout = setTimeout(function () { // If this method is called with the same cssKey within the 1.5 seconds, then the timeout is reset
        action.addAction(action.sizeQueueTimeout.previousAction);
        action.sizeQueueTimeout.initialValue = '';
        action.sizeQueueTimeout.isTimeoutRunning = false;
    }, 400);
    action.sizeQueueTimeout.isTimeoutRunning = true;
    action.sizeQueueTimeout.previousCssKey = cssKey;
};

action.objectCss = function (elementId) {
    var initialValue = [], // [initialValue, [initialValue, initialValue], initialValue]
        currentAction = ['setCss', []], // ['setCss', [elementName, cssKey, previousCssValue, newCssValue], [elementName, [cssKey, cssKey], [previousCssValue, previousCssValue], [newCssValue, newCssValue]]]
        allCssKeys = [], //[cssKey, [cssKey, cssKey]]
        innerInitial,
        cssKeys,
        cssValues,
        i,
        k,
        c,
        a;
    for (i = 0; i < elementId.length; i += 1) {
        if (typeof elementId[i][1] === 'string') { // We're only setting one cssKey here
            initialValue.push(document.getElementById(elementId[i][0]).style[elementId[i][1]]); // Push the element's current value to the array of initialValues
            allCssKeys.push(elementId[i][1]); // Push the current cssKey to the array of all cssKeys

            // 0 = elementName, 1 = cssKey, 2 = cssValue
            $('#' + elementId[i][0]).css(elementId[i][1], elementId[i][2]);
            action.savedElements.placedElements[elementId[i][0]][elementId[i][1]] = elementId[i][2];

            currentAction[1].push([elementId[i][0], elementId[i][1], '', elementId[i][2]]);
        } else { // We're gonna assume the cssKeys are an array. There are multiple to set for this element
            innerInitial = [];
            cssKeys = [];
            cssValues = [];
            for (k = 0; k < elementId[i][1].length; k += 1) {
                innerInitial.push(document.getElementById(elementId[i][0]).style[elementId[i][1][k]]);

                // elementId[i][0] = elementName, elementId[i][1][k] = cssKey, elementId[i][2][k] = cssValue
                $('#' + elementId[i][0]).css(elementId[i][1][k], elementId[i][2][k]);
                if (action.savedElements.placedElements[elementId[i][0]] !== 'undefined') { // Necessary check to prevent errors, primarily for the weather icon, iconImg isn't actually in placedElements
                    action.savedElements.placedElements[elementId[i][0]][elementId[i][1][k]] = elementId[i][2][k];
                }

                cssKeys.push(elementId[i][1][k]);
                cssValues.push(elementId[i][2][k]);
            }
            initialValue.push(innerInitial);
            allCssKeys.push(cssKeys);

            currentAction[1].push([elementId[i][0], cssKeys, '', cssValues]);
        }
        action.saveStorage();
    }
    // See comments above for other part of if, it's basically the same functionality, just modified slightly
    clearTimeout(action.sizeQueueTimeout.timeout);
    if (action.sizeQueueTimeout.initialValue === '') {
        action.sizeQueueTimeout.initialValue = initialValue;
    }
    // Fill in the currentAction with the initialValue(s)
    for (c = 0; c < currentAction[1].length; c += 1) {
        for (a = 1; a < currentAction[1][c].length; a += 1) {
            if (currentAction[1][c][a] === '') {
                currentAction[1][c][a] = action.sizeQueueTimeout.initialValue[c];
            }
        }
    }
    if (allCssKeys.toString() === action.sizeQueueTimeout.previousCssKey.toString() || action.sizeQueueTimeout.previousCssKey === '') {
        action.sizeQueueTimeout.previousAction = currentAction;
    } else {
        if (action.sizeQueueTimeout.isTimeoutRunning) {
            action.addAction(action.sizeQueueTimeout.previousAction);
            action.sizeQueueTimeout.initialValue = initialValue;
        }
        action.sizeQueueTimeout.previousAction = currentAction;
    }

    action.sizeQueueTimeout.timeout = setTimeout(function () {
        action.addAction(action.sizeQueueTimeout.previousAction);
        action.sizeQueueTimeout.initialValue = '';
        action.sizeQueueTimeout.isTimeoutRunning = false;
    }, 400);
    action.sizeQueueTimeout.isTimeoutRunning = true;
    action.sizeQueueTimeout.previousCssKey = allCssKeys;
};

action.setCss = function (elementId, cssKey, cssValue) { //[[elementName, cssKey, cssValue], [elementName, [cssKey, cssKey], [cssValue, cssValue]]]
    //used when calling multiple elements
    if (action.selectedItems.length > 0 && !(action.multiPositioningSystem === 'relative' && (cssKey === 'left' || cssKey === 'top'))) {
        elementId = action.absolutePos(elementId, cssKey, cssValue);
    }
    if (typeof elementId === 'string') {
        action.usualCss(elementId, cssKey, cssValue);
    } else if (typeof elementId === 'object') { // We're dealing with an array here. [[elementName, cssKey, cssValue], [elementName, [cssKey, cssKey], [cssValue, cssValue]]]
        action.objectCss(elementId);
    }
};
