/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/

/*global
  constants,
  confirm,
  alert,
	action,
  $,
*/


action.setEditMenuInputsState = function (state, maxIndex, id) { //state: -2 means show all, -1 means hide all, other numbers means toggle that index
    if (!id) var id = '';
    if (typeof id === 'string')
        var menuArray = action.getProperMenuForId(id)
    else
        var menuArray = id;
    if (!maxIndex) var maxIndex = constants.editArray.length;
    if (state <= -1) {
        for (var i = 0; i < maxIndex && i < menuArray.length; i++) {
            var splitArray = menuArray[i].split("~");

            //Only preloads things that are specified in the whitelist array
            var shouldPreload = (constants.preloadWhitelist[splitArray[0]] === '');

            if (shouldPreload && ((state === -2 && $('#' + splitArray[3]).children().length < 2) || (state === -1 && $('#' + splitArray[3]).children().length > 1))) {
                $('#' + splitArray[0]).trigger('click');
            }
        }
    } else if (state > -1 && state < menuArray.length) {
        $('#' + constants.editArray[0].split("~")[state]).trigger('click');
    } else {
        console.log("That's not a valid index. The state should be between (inclusive) -2 and " + (constants.editArray.length - 1));
    }
};

action.showIconMenu = function (menuArray, indexesToSurround) { //indexesToSurround: -2 means surround none with div, -1 means surround all, otherwise number is index to surround

    $('#icons').empty();
    $('.elementPanel').scrollTop(0);
    $('#logo').attr('title', 'Now Showing: ' + action.getTitleForArray(menuArray)); // Updating the title of the menu
    for (var i = 0; i < menuArray.length; i++) {

      var splitArray = menuArray[i].split('~');
      if (splitArray[0] === "element") {
          if ($('.elementPanel').is(":visible")) {
              //a.title = "Hide Elements Panel"
          } else {
              //a.title = "Show Elements Panel";
          }
      } else {
          //a.title = splitArray[1];
      }
      if(splitArray[0] === "clear" && !isios2){

      }else{
        var div = document.createElement('div');
        div.id = "Test";
        //var a = document.createElement('a');
        var li = document.createElement('li');
        //a.href = 'javascript:void(0)';
        //a.className = 'leftTooltip';
        li.className = splitArray[2];
        li.id = splitArray[0];
        li.title = splitArray[4];
        div.appendChild(li);
        $('#icons').append(div);
        if (indexesToSurround > -2) {
            if (indexesToSurround === -1 || i === indexesToSurround) {
                div.id = splitArray[3];
                //div.appendChild(a);
                //$('#icons').append(div);
            } else {
                //$('#icons').append(a);
            }
        } else {
            //$('#icons').append(a);
        }
      }
    }
    //action.setEditMenuInputsState(-2, false, menuArray);
};

action.getTitleForArray = function (menuArray) { // Any icon menu that's shown needs to be added here to update its title
    switch (menuArray) {
    case constants.toolArray:
        return "Main Menu";
    case constants.editArray:
        return "Element Styles Menu";
    case constants.customTextArray:
        return "Custom Text Menu";
    case constants.shadowArray:
        return "Element Shadow Menu";
    case constants.boxShadowArray:
        return "Box Shadow Menu";
    case constants.boxEditArray:
        return "Box Styles Menu";
    case constants.circleEditArray:
        return "Circle Styles Menu";
    case constants.iconArray:
        return "Icon Styles Menu";
    case constants.linearGradientArray:
        return "Linear Gradient Menu";
    case constants.linearBoxGradientArray:
        return "Linear Box Gradient Menu";
    case constants.backgroundArray:
        return "Background Menu";
    case constants.transformArray:
        return "Transform Menu";
    case constants.affixArray:
        return "Suffix/Prefix Menu";
    case constants.borderArray:
        return "Border Menu";
    }
    if (menuArray.toString() === constants.notSoConstantArray.toString()) {
        return "Custom Combination Menu";
    }
};
action.showMultiSelectionMenu = function () {
    if (action.selectedItems.length > 0) { // Pretty imperative for what we're doing

        var megaMenu = [], // ['editMenu~bla~bla','otherMenu~bla~bla','etcMenu~bla~bla']
            curMenu = action.getProperMenuForId(action.selectedItems[0]),
            i,
            e,
            k;
        for (i = 0; i < curMenu.length; i += 1) { // Go through each menu item for the base selection item
            if (curMenu[i] === constants.editArray[2] && action.multiPositioningSystem === 'relative') {
                megaMenu.push(constants.multiPosition);
            } else {
                megaMenu.push(curMenu[i]); // Add it to the mega array
            }
        }

        for (e = 1; e < action.selectedItems.length; e += 1) { // Go through each of the other selection items
            curMenu = action.getProperMenuForId(action.selectedItems[e]);
            for (k = 0; k < megaMenu.length; k += 1) { // Compare each item of the megaMenu to check if it's in this item's menu
                if (megaMenu[k].split('~')[0].substring(0, 5) !== 'multi' && curMenu.indexOf(megaMenu[k]) === -1) { // If the item's in megaMenu but not in this item's menu
                    megaMenu.splice(k, 1); // Remove the item from megaMenu
                    k -= 1;
                }
            }
        }

        megaMenu.unshift(constants.positioningSystemOption); // Weird function name. Just puts it at the front.

        constants.notSoConstantArray = megaMenu;
        action.showIconMenu(megaMenu, -1);
    } else {
        if (action.selectedItem !== "") {
            action.showProperMenuForId(action.selectedItem);
        } else {
            action.showIconMenu(constants.toolArray, -1);
        }
    }
};
action.showProperMenuForId = function (id) {
    action.showIconMenu(action.getProperMenuForId(id), -1);
};
action.getProperMenuForId = function (id) {
    if (id === 'icon') { // Special case
        return constants.iconArray;
    }
    if (id.substring(0, 4) === 'text') { // Another special case
        return constants.customTextArray;
    }
    if (id.substring(0, 9) === 'boxCircle') {
        return constants.circleEditArray;
    }
    if (id.substring(0, 3) === 'box') {
        return constants.boxEditArray;
    } // Normal element, show edit menu
    return constants.editArray;
};


action.showEditMenu = function () {
    if (action.selectedItem != "") {
        action.showProperMenuForId(action.selectedItem);
    } else {
        action.showIconMenu(constants.toolArray, -1);
    }
};
