/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/
/*global
  action,
  constants,
  $,
  editSB,
  elementPanel,
  createGrid,
  fontArray
*/


/**
 * Handles many of the events that happen
 * This totally needs cleaned up more than I already did:(
 *
 */

action.isASelectedItem = function (itemName) { // Determines whether an iten with the name itemName is in action.selectedItems already
    var i;
    for (i = 0; i < action.selectedItems.length; i += 1) {
        if (action.selectedItems[i] === itemName) {
            return true;
        }
    }
    return false;
};

action.removeFromMultiSelection = function (itemName) {
    action.selectedItems.forEach(function (item, index) {
        if (item === itemName) {
            action.selectedItems.splice(index, 1);
        }
    });
};


//event listeners
window.onload = function () {
    action.loadFromStorage(); //load elements that are stored
    setTimeout(function () {
        action.showIconMenu(constants.toolArray, -1);
        $('#clockList').toggle('display');
        action.createLI(elementPanel.clockElements, 'clockList');
        $('#weatherList').toggle('display');
        action.createLI(elementPanel.weatherElements, 'weatherList');
        $('#systemList').toggle('display');
        action.createLI(elementPanel.systemElements, 'systemList');
        $('#miscList').toggle('display');
        action.createLI(elementPanel.miscElements, 'miscList');
    }, 0); //if going to load immediately wait for everything visible to show first.
};

action.arrowKey = function (key, capitalizedCssKey, event) {
    var selectedItem = $('#' + action.selectedItem), //The currently selected item
        increment = event.altKey ? 10 : 1, // Move by 10 if the alt key is pressed
        newPos,
        lowercaseCssKey,
        input;
    if (key === 'left') {
        newPos = selectedItem.position().left - increment;
        if (event.shiftKey) {
            newPos = 0; // Forcibly trigger the else statement in the ternary below
            newPos = newPos > 0 ? newPos : 0;
        } // Check to ensure it's still within the screen
    } else if (key === 'right') {
        newPos = selectedItem.position().left + increment;
        if (event.shiftKey) {
            newPos = 320;
            newPos = newPos + selectedItem.width() < 320 ? newPos : 320 - selectedItem.width();
        }
    } else if (key === 'up') {
        newPos = selectedItem.position().top - increment;
        if (event.shiftKey) {
            newPos = 0;
            newPos = newPos > 0 ? newPos : 0;
        }
    } else if (key === 'down') {
        newPos = selectedItem.position().top + increment;
        if (event.shiftKey) {
            newPos = 568;
            newPos = newPos + selectedItem.height() < 568 ? newPos : 568 - selectedItem.height();
        }
    }

    lowercaseCssKey = capitalizedCssKey.toLowerCase();
    action.setCss(action.selectedItem, lowercaseCssKey, newPos); // Actually move the item

    input = $('#pos' + capitalizedCssKey + 'Input');
    if (input.length > 0) { // Verify the relevant input exists
        input.val(newPos); // If it does, update it to reflect the new position
    }
};

$(document).on('keydown', function (event) {
    if (action.selectedItem !== '') {
        switch (event.keyCode) {
        case 37: //Left arrow
            if (!action.isEditingText) {
                action.arrowKey('left', 'Left', event);
            }
            break;
        case 38: //Up arrow
            if (!action.isEditingText) {
                action.arrowKey('up', 'Top', event);
            }
            break;
        case 39: //Right arrow
            if (!action.isEditingText) {
                action.arrowKey('right', 'Left', event);
            }
            break;
        case 40: //Down arrow
            if (!action.isEditingText) {
                action.arrowKey('down', 'Top', event);
            }
            break;
        case 46: //Delete key
            if (!action.isEditingText) {
                action.removeSelectedFromScreen(true);
            }
            break;
        }
    }
    switch (event.keyCode) {
    case 89: //Y
        if (event.ctrlKey) {
            action.redo();
        }
        break;
    case 90: //Z
        if (event.ctrlKey) {
            action.undo();
        }
        break;
    }

});


$('#font').on('click', function (event) {
    if ($(event.target).is('li')) {
        action.setFont(event.target.title);
    } else {
        action.cgfont();
    }
});
$('.iconList').on('click', function (event) { //grab clicks from toolpanel
    if (event.target.id !== "") {
        action.setNewIcon(event.target.id);
    } else {
        $('.iconList').toggle('display');
    }
});

$('.elementPanel').on('click', function (event) { //grab clicks from elementPanel
    var elementChildren,
        i,
        id,
        div;
    if (event.target.id && event.target.tagName === 'H3') { //Clicking to show/hide a panel
        //action.setHelpText('Either scroll, use the arrow buttons, or use the arrow keys to navigate the element menu.');
        action.elementPanel(event.target.id);
        elementChildren = $('.elementPanel').children();
        for (i = 0; i < elementChildren.length; i += 1) {
            if ($(elementChildren[i]).attr('id') !== event.target.id && $(action.getElementPanelIdSelector($(elementChildren[i]).attr('id'))).children().length > 1 && $(action.getElementPanelIdSelector($(elementChildren[i]).attr('id'))).is(':visible')) {
                action.elementPanel($(elementChildren[i]).attr('id'));
            }
        }
    } else if ($(event.target).parent().hasClass('subCategory')) {
        id = $(event.target).attr('data-element');
        if (document.getElementById(id)) {
            action.removeFromScreen(id, false);
        } else {
            action.addtoScreen(id);
        }
    } else if ($(event.target).hasClass('categoryTitle')) {
        if (!$(event.target).hasClass('slick-center')) {
            div = $(event.target).parent().parent().parent();
            div.slick('slickGoTo', JSON.parse($(event.target).attr('data-slick-index')), false);
            action.setCarouselOpacity(div.attr('id'));
        }
    }
});

function handleScreenClick(event) { // Had to move everything to this function so it could be manually called
    var i,
        e,
        a,
        c,
        itm;

    function deselectElement(item, fullClear) {
        $('#' + item).css('outline', '0px solid transparent'); // Remove the highlight
        action.removeFromMultiSelection(item);
        if (fullClear) {
            action.showIconMenu(constants.toolArray, -1); // Show the base toolArray
            action.selectedItem = ""; // Clear the selected item

            if ($('#fList').length > 0 && $('#fList').is(':visible')) { // If the font list has been initialized and is showing
                action.cgfont(); // Hide the font list
            }
        }
    }

    if (event.target.id === '' && action.selectedItem !== '') { // Clicked on the empty screen
        if (action.selectedItems.length > 0) {
            for (i = 0; i < action.selectedItems.length; i += 1) {
                deselectElement(action.selectedItems[i], false);
                i -= 1;
            }
        }
        deselectElement(action.selectedItem, true); //Doesn't hurt to do this once more, to do the full deselect
        action.setHelpText('Clicking off an element de-selects it. Click back on it to re-select.');
    } else if (event.target.id !== 'screen' && event.target.id !== '') { //If you clicked on something...
        if (event.target.id === action.selectedItem) { // If they clicked the centrally highlighted item
            if (action.selectedItems.length > 0) { // If we should consider multi-selection
                if (event.shiftKey) { // If someone shift-clicked the centrally selected item
                    action.selectedItems.forEach(function (item) { // Deselect the central item, name a new one
                        if (item === action.selectedItem) {
                            deselectElement(item, false); // Automatically removed from multiselection arr

                            if (action.selectedItems.length > 0) { // If there are still some left
                                action.selectedItem = action.selectedItems[0]; // Change the centrally located one
                            }

                            if (action.selectedItems.length === 1) { // The one we just made central is the only one left apparently
                                action.selectedItems.splice(0, 1); // So clear out multi-selection entirely
                            }

                            action.showMultiSelectionMenu();
                        }
                    });
                } else {
                    //console.log(event.type);
                    for (c = 0; c < action.selectedItems.length; c += 1) { // Deselect eveything else, clear multiselection array
                        itm = action.selectedItems[c];
                        if (itm !== action.selectedItem) {
                            deselectElement(itm, false); // Deselect all multi-selected items, except the centrally selected one
                        }
                        action.selectedItems.splice(c, 1); // No matter what, remove this item from multi-selection. We're clearing out
                        i -= 1;
                    }

                    action.showMultiSelectionMenu();
                }

            } else {
                deselectElement(action.selectedItem, true);
            }
        } else if (event.shiftKey && action.isASelectedItem(event.target.id)) { // If the shift-clicked item is an already-highlighted item
            if (action.selectedItems.length > 0) {
                for (e = 0; e < action.selectedItems.length; e += 1) {
                    if (action.selectedItems[e] === event.target.id) {
                        action.selectedItems.splice(e, 1); // Remove the item from selectedItems
                        break;
                    }
                }
                deselectElement(event.target.id, false);
            }

            action.showMultiSelectionMenu();
        } else { // User either clicked on another element, or on a new element to highlight
            if (event.shiftKey && action.selectedItem !== "") {
                if (!action.isASelectedItem(action.selectedItem)) { // Check if the 'centrally selected' item is a part of multi-selection
                    action.selectedItems.push(action.selectedItem); // Add it if it isn't already
                }
                action.selectedItems.push(event.target.id);

                $('#' + event.target.id).css('outline', '1px solid #21b9b0'); // Highlight new element

                action.showMultiSelectionMenu();
            } else {
                if (!(event.type === "dragstart" && action.selectedItems.length > 0)) {
                    deselectElement(action.selectedItem, false); // Unhighlight the old element
                    for (a = 0; a < action.selectedItems.length; a += 1) {
                        deselectElement(action.selectedItems[i], false);
                        a -= 1;
                    }

                    if (event.target.id.substring(0, 3) === 'box' || event.target.id === 'icon') { //show different text for box and icon
                        action.setHelpText('Pick a style adjustment from the left menu.');
                    } else {
                        action.setHelpText('Pick a style adjustment from the left menu, scroll for more options.');
                    }

                    action.selectedItem = event.target.id; // Set the selected item to the new element
                    $('#' + event.target.id).css('outline', '1px solid #21b9b0'); // Highlight new element

                    if (action.selectedItem === '') {
                        $('.elementPanel').data('prevHiddenState', $('.elementPanel').is(':visible')); // Save the panel's previous state, but only if switching to a new element
                    }
                    action.showMultiSelectionMenu();
                }
            }
        }
    }
}

$('.screen').click(function (event) {
    handleScreenClick(event);
});

$('.screen').on('mousewheel', function (event) {
    var selected = $('#' + action.selectedItem),
        increment,
        newHeight,
        newWidth,
        iconChild,
        input,
        inputTwo,
        oldSize,
        newSize;
    if (selected.length > 0 && $('#' + action.selectedItem + ':hover').length > 0) { // Tried using .is(':hover'), but it always returned false. This works
        if (event.deltaY > 0) {
            increment = event.altKey ? 10 : 1;
        } else {
            increment = event.altKey ? -10 : -1;
        }

        if (action.selectedItem.substring(0, 3) === 'box' || action.selectedItem === 'icon') { // Special case for boxes and circles (also icons), change both height and width
            newHeight = selected.height() + increment;
            newHeight = newHeight > 0 ? newHeight : 1; // Floor at 1
            //newHeight = newHeight < 568 ? newHeight : 568; // Ceiling at 568 (height of screen)
            newWidth = selected.width() + increment;
            newWidth = newWidth > 0 ? newWidth : 1; // Floor at 1
            //newWidth = newWidth < 320 ? newWidth : 320; // Ceiling at 320 (width of screen)
            action.setCss([
                [action.selectedItem, ['height', 'width'],
                    [newHeight + 'px', newWidth + 'px']
                ]
            ]);

            if (action.selectedItem === 'icon') {
                //Special case for icons. It's child img's height and width must also be updated
                iconChild = $(selected.children()[0]);
                iconChild.css('height', newHeight).css('width', newHeight); // Icons should always be squares

                input = $('#iconSizeInput');
                if (input.length > 0) { // Verify the relevant input exists
                    input.val(newHeight); // If it does, update it to reflect the new position
                }
            } else { // It's either a box or a circle
                input = $('#widthSizeInput'); // Both boxes and circles need their width updated
                if (input.length > 0) {
                    input.val(newWidth);
                }
                if (action.selectedItem.substring(3, 9) !== 'Circle') { // Only boxes, not circles, have height to be updated
                    inputTwo = $('#heightSizeInput');
                    if (inputTwo.length > 0) {
                        inputTwo.val(newHeight);
                    }
                }
            }
        } else { // Otherwise, it's normal text, change font size
            oldSize = selected.css('font-size');
            oldSize = JSON.parse(oldSize.substring(0, oldSize.length - 2)); // Remove the 'px' from the end, turn it into a number
            newSize = oldSize + increment;
            newSize = newSize > 5 ? newSize : 5; // Set a floor at 5
            action.setCss(action.selectedItem, 'font-size', newSize + 'px');

            // Update the font size input
            input = $('#fontSizeInput');
            if (input.length > 0) {
                input.val(newSize);
            }
        }
        action.saveStorage();
        event.preventDefault();
    }
});


//notification hover
$('#tips').mouseenter(function () {
    clearInterval(action.timeout);
});
$('#tips').mouseleave(function () {
    action.timeout = setTimeout(function () {
        $('#tips').hide('slide', {
            direction: 'up'
        });
    }, 1250);
});


/* Top right menu */
$('#menutips').on('click', function () {
    if ($('#tips').css('top') === "-300px") {
        $('#tips').css('top', '100px');
        localStorage.setItem('hideTips', false);
        $(this).attr('title', 'On');
    } else {
        $('#tips').css('top', '-300px');
        localStorage.setItem('hideTips', true);
        $(this).attr('title', 'Off');
    }
});
$('#gridtips').on('click', function () {
    if ($('.gridlines').css('display') === undefined) {
        $(this).attr('title', 'On');
        action.createGrid(constants.gridSizeLeft, constants.gridSizeTop);
        localStorage.setItem('gridTips', true);
    } else {
        $('.grids').empty();
        $(this).attr('title', 'Off');
    }
});
$('#snaptips').on('click', function () {
    if (localStorage.snap === 'true') {
        localStorage.snap = 'false';
        $(this).attr('title', 'Off');
        $(".dLine").remove();
    } else {
        localStorage.snap = 'true';
        $(this).attr('title', 'On');
    }
});
if (localStorage.snap === 'true') {
    $('#snaptips').attr('title', 'On');
}

if (localStorage.hideTips === 'true') {
    $('#tips').css('top', '-300px');
    $('#menutips').attr('title', 'Off');
}
$(".select-menu").click(function () {
    $(this).toggleClass("menu-on");
    $('.menulist').toggle();
    // $('.menulist').toggle('display');
});
/* End Top right menu */

/* background */
$('#bgInput').on('change', action.uploadedImage);

$(window).load(function () {
    var fpre = document.querySelector('.font_preload'),
        fragment = document.createDocumentFragment(),
        i,
        f;
    for (i = 0; i < fontArray.length; i += 1) {
        f = document.createElement('SPAN');
        f.setAttribute('style', 'font-family:' + fontArray[i] + ';');
        f.innerHTML = "test";
        fragment.appendChild(f);
    }
    fpre.appendChild(fragment);
});
