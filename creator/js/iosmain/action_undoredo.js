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
action.undo = function () {
    action.isUndoingRedoing = true;
    if (action.queuePosition > -1) { // False when array's either empty or the queue is at the beginning, nothing left to undo
        var editorAction = action.actionQueue[action.queuePosition];
        action.runOppositeAction(editorAction[0], editorAction[1]);
        action.queuePosition -= 1;
    } else {
        action.setHelpText("Nothing left to undo.");
    }
    action.isUndoingRedoing = false;
    //console.log('Queue Position: ' + action.queuePosition + ' / ' + (action.actionQueue.length - 1));
};
action.redo = function () {
    var editorAction;
    action.isUndoingRedoing = true;
    if (action.queuePosition < action.actionQueue.length - 1) { // False when array's either empty or at the end, nothing more to redo
        action.queuePosition += 1;
        editorAction = action.actionQueue[action.queuePosition];
        action.runAction(editorAction[0], editorAction[1]);
    } else {
        action.setHelpText("Nothing left to redo.");
    }
    action.isUndoingRedoing = false;
    //console.log('Queue Position: ' + action.queuePosition + ' / ' + (action.actionQueue.length - 1));
};
action.addAction = function (editorAction) {
    action.actionQueue.length = action.queuePosition + 1;
    action.actionQueue.push(editorAction);
    action.queuePosition = action.actionQueue.length - 1;
    //console.log('Queue Position: ' + action.queuePosition + ' / ' + (action.actionQueue.length - 1));
};
action.runOppositeAction = function (actionName, actionInfo) {
    var i,
        k;
    switch (actionName) {
    case 'addElement':
        if (typeof actionInfo[0] === 'string') {
            action.removeFromScreen(actionInfo[0], false);
        } else if (typeof actionInfo[0] === 'object') {
            for (i = 0; i < actionInfo.length; i += 1) {
                action.removeFromScreen(actionInfo[i][0], false);
            }
        }
        break;
    case 'removeElement':
        action.runAction('addElement', actionInfo);
        break;
    case 'setCss':
        if (typeof actionInfo[0] === 'string') {
            $('#' + actionInfo[0]).css(actionInfo[1], actionInfo[2]);
            action.savedElements.placedElements[actionInfo[0]][actionInfo[1]] = actionInfo[2];
        } else {
            for (i = 0; i < actionInfo.length; i += 1) {
                if (typeof actionInfo[i][1] === 'string') {
                    $('#' + actionInfo[i][0]).css(actionInfo[i][1], actionInfo[i][2]);
                    action.savedElements.placedElements[actionInfo[i][0]][actionInfo[i][1]] = actionInfo[i][2];
                } else {
                    for (k = 0; k < actionInfo[i][1].length; k += 1) {
                        $('#' + actionInfo[i][0]).css(actionInfo[i][1][k], actionInfo[i][2][k]);
                        if (typeof action.savedElements.placedElements[actionInfo[i][0]] !== 'undefined') {
                            action.savedElements.placedElements[actionInfo[i][0]][actionInfo[i][1][k]] = actionInfo[i][2][k];
                        }
                    }
                }
            }
        }
        action.saveStorage();
        break;
    }
};

action.addEl = function (elementId, cssVals) { // Adds given element with css values to screen
    if ($('#' + elementId + 'Picker').length) {
        $('#' + elementId + 'Picker').css('background-color', '#21B9B0'); //Set the colored background of the relevant list element
        $('#' + elementId + 'Picker').css('border-color', '#21B9B0');
    }
    action.savedElements.placedElements[elementId] = cssVals;
};

action.runAction = function (actionName, actionInfo) { // [actionName, actionInfo]
    var i,
        k;
    switch (actionName) {
    case 'addElement': // ['addElement',[elementID,[color:'', font-family:'', etc]]] OR ['addElement',[[elementID,[color:'', font-family:'', etc]],[elementID,[color:'', font-family:'', etc]],...]]
        if (typeof actionInfo[0] === 'string') {
            action.addEl(actionInfo[0], actionInfo[1]);
        } else if (typeof actionInfo[0] === 'object') {
            for (i = 0; i < actionInfo.length; i += 1) {
                action.addEl(actionInfo[i][0], actionInfo[i][1]);
            }
        }
        $('#screenElements').empty(); // This is VERY important. Without this, replaceElements recreates each of the other elements, but they're these crappy little non-filled things. They cause issues.
        action.replaceElements(); // Refresh the screen elements from the savedElements array
        action.saveStorage();
        break;
    case 'removeElement': // ['removeElement',[elementID,[color:'', font-family:'', etc]]] OR ['removeElement',[[elementID,[color:'', font-family:'', etc]],[elementID,[color:'', font-family:'', etc]],...]]
        action.runOppositeAction('addElement', actionInfo); // Does the opposite of adding an element, removing the element
        break;
    case 'setCss': // ['setCss', [elementID, cssKey, oldValue, newValue]]
        if (typeof actionInfo[0] === 'string') {
            $('#' + actionInfo[0]).css(actionInfo[1], actionInfo[3]);
            action.savedElements.placedElements[actionInfo[0]][actionInfo[1]] = actionInfo[3];
        } else {
            for (i = 0; i < actionInfo.length; i += 1) {
                if (typeof actionInfo[i][1] === 'string') {
                    $('#' + actionInfo[i][0]).css(actionInfo[i][1], actionInfo[i][3]);
                    action.savedElements.placedElements[actionInfo[i][0]][actionInfo[i][1]] = actionInfo[i][3];
                } else {
                    for (k = 0; k < actionInfo[i][1].length; k += 1) {
                        $('#' + actionInfo[i][0]).css(actionInfo[i][1][k], actionInfo[i][3][k]);
                        if (typeof action.savedElements.placedElements[actionInfo[i][0]] !== 'undefined') {
                            action.savedElements.placedElements[actionInfo[i][0]][actionInfo[i][1][k]] = actionInfo[i][3][k];
                        }
                    }
                }
            }
        }
        action.saveStorage();
        break;
    }
};
