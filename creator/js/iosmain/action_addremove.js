/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/
/*global
  action,
  constants,
  loadClock,
  weatherdivs,
  systemdivs,
  miscDivs,
  $,
*/


/**
 * Add/Remove elements from the screen
 *
 *
 */

action.addtoScreen = function (id) { //when item is clicked from add panel
    action.setHelpText('Click element to adjust style. (Also delete)');
    var div = document.createElement('div'),
        divSelected,
        leftPos,
        rightPos,
        newLeftPos;
    div.id = id;
    if (id.substring(0, 3) === 'box') {
        div.style.width = '50px';
        div.style.height = '50px';
        div.style.backgroundColor = 'red';
        //div.style.display = 'gray';
        div.style.zIndex = 1;
        div.style.borderColor = 'red';
        div.style.borderStyle = 'solid';
        div.style.borderWidth = '0px';
        if (id.substring(3, 9) === 'Circle') {
            div.style.borderRadius = '999px';
        }
    } else {
        div.style.zIndex = 2;
    }
    document.getElementById('screenElements').appendChild(div);
    this.addDraggable(id);
    this.movedElements[id] = {};
    this.savedElements.placedElements = this.movedElements;
    $('#' + id).css('position', 'absolute'); //fix for html2canvas
    $('#' + id).css('font-size', '30px'); //fix for html2canvas
    $('#' + id).css('color', 'white'); //fix for html2canvas
    $('#' + id).css('font-family', 'helvetica');
    if (id.substring(0, 3) === 'box') {
        this.savedElements.placedElements[id].width = '50px';
        this.savedElements.placedElements[id].height = '50px';
        this.savedElements.placedElements[id]['background-color'] = 'red';
        //this.savedElements.placedElements[id].display = 'gray';
        this.savedElements.placedElements[id]['z-index'] = 1;
        this.savedElements.placedElements[id]['border-color'] = 'red';
        this.savedElements.placedElements[id]['border-style'] = 'solid';
        this.savedElements.placedElements[id]['border-width'] = '0px';
        this.savedElements.placedElements[id].position = 'absolute';
        this.savedElements.placedElements[id].top = '248px';
        this.savedElements.placedElements[id].left = '130px';
        if (id.substring(3, 9) === 'Circle') {
            this.savedElements.placedElements[id]['border-radius'] = '999px';
        }
    } else {
        if (id === 'icon') {
            this.savedElements.placedElements[id].position = 'absolute';
            this.savedElements.placedElements[id].top = '248px';
            this.savedElements.placedElements[id].left = '130px';
            this.savedElements.placedElements[id].width = '40px';
            //this.savedElements.placedElements[id]['height'] = '40px';
            //$('#'+id).css('height','40px');
            $('#' + id).css('width', '40px');

        } else {
            this.savedElements.placedElements[id]['z-index'] = 2;
            this.savedElements.placedElements[id].color = 'white';
            this.savedElements.placedElements[id]['font-family'] = 'helvetica';
            this.savedElements.placedElements[id].position = 'absolute';
            this.savedElements.placedElements[id]['font-size'] = '30px';
            this.savedElements.placedElements[id].top = '248px';
            this.savedElements.placedElements[id].left = '130px';
        }
    }
    loadClock(); //in clock.js
    weatherdivs();
    systemdivs();
    miscDivs();

    //For elements that are too long
    divSelected = $(div);
    leftPos = divSelected.position().left;
    rightPos = leftPos + divSelected.width();
    if (rightPos > 320) {
        newLeftPos = leftPos - (rightPos - 320);
        divSelected.css('left', newLeftPos > 0 ? newLeftPos : 0);
        this.savedElements.placedElements[id].left = newLeftPos > 0 ? newLeftPos : 0;
    }
    this.saveStorage();

    if (!action.isUndoingRedoing) {
        action.addAction(['addElement', [id]]);
    }

    document.getElementById(id + 'Picker').style.backgroundColor = "#21b9b0"; //Add colored background to list element
    document.getElementById(id + 'Picker').style.borderColor = "#21b9b0";
};
action.removeFromScreen = function (id) { //when trash for item is clicked or item is re-clicked in element menu
    if (action.selectedItems.length === 0) { // If it >0, then removeSelectedFromScreen handles the queueing
        if (!action.isUndoingRedoing) {
            action.addAction(['removeElement', [id, action.savedElements.placedElements[id]]]);
        } else {
            action.actionQueue[action.queuePosition][1] = [id, action.savedElements.placedElements[id]];
        }
    }

    var parent = document.getElementById('screenElements'),
        div = document.getElementById(id);
    parent.removeChild(div); //remove element from dom
    delete this.movedElements[id];
    this.savedElements.placedElements = this.movedElements; //since the element was removed from movedElements, this also removes from placedElements
    this.saveStorage(); //save localStorage
    this.showIconMenu(constants.toolArray, -1);
    if (document.getElementById(id + 'Picker')) {
        document.getElementById(id + 'Picker').style.backgroundColor = "#54606e"; //Remove colored background from list element
        document.getElementById(id + 'Picker').style.borderColor = "#54606e";
    }
    action.selectedItem = '';
};
action.removeSelectedFromScreen = function (toggleElementPanel) {
    var actionArr,
        i;
    if (action.selectedItems.length === 0) {
        action.removeFromScreen(action.selectedItem, toggleElementPanel);
    } else {
        actionArr = ['removeElement', []];
        for (i = 0; i < action.selectedItems.length; i += 1) {
            actionArr[1].push([action.selectedItems[i], action.savedElements.placedElements[action.selectedItems[i]]]);
            action.removeFromScreen(action.selectedItems[i], i === action.selectedItems.length - 1); // Only toggle elPanel if we're on the last item
        }
        action.addAction(actionArr);
    }
};
