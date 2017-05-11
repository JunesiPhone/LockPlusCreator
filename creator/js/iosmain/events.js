//TODO cleanup

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

        action.zoomScale = screen.width / 320;
        switch (window.innerWidth) {
        case 375:
            action.zoomScale = 1.18;
            break;
        case 414:
            action.zoomScale = 1.3;
            break;
        case 768:
            action.zoomScale = 1.8;
            break;
        }
    }, 0); //if going to load immediately wait for everything visible to show first.
}

$('.toolPanel').on('click', function (event) { //grab clicks from toolpanel
    action.toolPanel(event);
});
var fontMoving = false;
$('#font').on('touchmove', function () {
    fontMoving = true;
});
$('#font').on('touchend', function (event) {
    if (fontMoving == true) {
        fontMoving = false;
    } else {
        if ($(event.target).is('li')) {
            action.setFont(event.target.title);
        } else {
            action.cgfont();
        }
    }
});
$('.iconList').on('click', function (event) { //grab clicks from toolpanel
    if (event.target.id != "") {
        action.setNewIcon(event.target.id);
    } else {
        $('.iconList').toggle('display');
    }
});

$('.elementPanel').on('click', function (event) { //grab clicks from elementPanel
    if (event.target.id && event.target.tagName === 'H3') { //Clicking to show/hide a panel
        action.elementPanel(event.target.id);
        var elementChildren = $('.elementPanel').children();
        for (var i = 0; i < elementChildren.length; i++) {
            if ($(elementChildren[i]).attr('id') != event.target.id && $(action.getElementPanelIdSelector($(elementChildren[i]).attr('id'))).children().length > 1 && $(action.getElementPanelIdSelector($(elementChildren[i]).attr('id'))).is(':visible'))
                action.elementPanel($(elementChildren[i]).attr('id'));
        }
    } else if ($(event.target).parent().hasClass('subCategory')) {
        var id = $(event.target).attr('data-element');
        if (document.getElementById(id)) {
            action.removeFromScreen(id, false);
        } else {
            action.addtoScreen(id);
        }
    } else if ($(event.target).hasClass('categoryTitle')) {
        if (!$(event.target).hasClass('slick-center')) {
            var div = $(event.target).parent().parent().parent();
            div.slick('slickGoTo', JSON.parse($(event.target).attr('data-slick-index')), false);
            action.setCarouselOpacity(div.attr('id'));
        }
    }
});

$('.screen').click(function (event) {
    if (!action.isScrollingEdit) {
        handleScreenClick(event);
        elPanel.screenClick();
        menu.screenClick(event);
        $('.sidePanel').css('display', 'none');
    }
});

function handleScreenClick(event) { // Had to move everything to this function so it could be manually called
    function deselectElement(item, fullClear) {
        $('#leftSelector').attr('title', 'Main Menu');
        $('#' + item).css('outline', '0px solid transparent'); // Remove the highlight
        if (fullClear) {
            action.showIconMenu(constants.toolArray, -1); // Show the base toolArray
            action.selectedItem = ""; // Clear the selected item

            if ($('#fList').length > 0 && $('#fList').is(':visible')) { // If the font list has been initialized and is showing
                action.cgfont(); // Hide the font list
            }
        }
    }

    if (event.target.id === '' && action.selectedItem != '') { // Clicked on the empty screen
        deselectElement(action.selectedItem, true); //Doesn't hurt to do this once more, to do the full deselect

    } else if (event.target.id != 'screen' && event.target.id != '') { //If you clicked on something...

        if (event.target.id === action.selectedItem) { // If they clicked the currently selected item
            deselectElement(action.selectedItem, true);
        } else { // User either clicked on another element (so highlight it)
            deselectElement(action.selectedItem, false); // Unhighlight the old element

            action.selectedItem = event.target.id; // Set the selected item to the new element
            $('#' + event.target.id).css('outline', '1px solid #fff'); // Highlight new element

            if (action.selectedItem === '') $('.elementPanel').data('prevHiddenState', $('.elementPanel').is(':visible')); // Save the panel's previous state, but only if switching to a new element

        }
    }
    //action.showEditMenu();
}

var scrollLimitForEditMenu = 120; //one place to change incase any more edits

$('#bgInput').on('change', function (e) {
    action.uploadedImage(e);
});


/* grid stuff */
function createGrid(sizeleft, sizetop) {
    var i,
        sel = $('.grids'),
        height = sel.height(),
        width = sel.width(),
        ratioW = Math.floor(width / sizeleft),
        ratioH = Math.floor(height / sizetop);

    for (i = 0; i <= ratioW; i++) { // vertical grid lines
        $('<div />').css({
                'top': 0,
                'left': i * sizetop,
                'width': 1,
                'height': height
            })
            .addClass('gridlines')
            .appendTo(sel);
    }

    for (i = 0; i <= ratioH; i++) { // horizontal grid lines
        $('<div />').css({
                'top': i * sizeleft,
                'left': 0,
                'width': width,
                'height': 1
            })
            .addClass('gridlines')
            .appendTo(sel);
    }

    $('.gridlines').show();
}
//createGrid(constants.gridSizeLeft,constants.gridSizeTop);


/* Top right menu */
$('#gridtips').on('click', function () {
    if ($('.gridlines').css('display') === undefined) {
        $(this).attr('title', 'On');
        createGrid(constants.gridSizeLeft, constants.gridSizeTop);
        localStorage.setItem('gridTips', true);
    } else {
        $('.grids').empty();
        $(this).attr('title', 'Off');
    }
});
$('#snaptips').on('click', function () {
    if (localStorage.snap == 'true') {
        localStorage.snap = 'false';
        $(this).attr('title', 'Off');
        $(".dLine").remove();
    } else {
        localStorage.snap = 'true';
        $(this).attr('title', 'On');
    }
});
if (localStorage.snap == 'true') {
    $('#snaptips').attr('title', 'On');
}
$(".select-menu").click(function () {
    $(this).toggleClass("menu-on");
    $('.menulist').toggle();
    // $('.menulist').toggle('display');
});
/* End Top right menu */
