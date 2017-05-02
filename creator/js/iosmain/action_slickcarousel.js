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
 * Controls element scroller
 *
 *
 */
action.slickProgress = function (key, div) {
    switch (key) {
    case 'prev':
        $('#' + div).slick('slickPrev');
        action.setCarouselOpacity(div);
        break;
    case 'next':
        if (action.shouldSlickProgress(div)) {
            $('#' + div).slick('slickNext');
        }
        break;
    }
    action.setCarouselOpacity(div);
};
action.parseElementsArray = function (array, divSelector) {
    var baseName,
        parentId,
        subCategoryId,
        subCategorySelector;
    Object.keys(array).forEach(function (key) {
        if (array[key].constructor === Object) { // if this is another array
            action.parseElementsArray(array[key], divSelector);
        } else if (key === 'title') { // Create the parent category li item
            baseName = array[key].toLowerCase().replace(/\s/g, ''); //Lowercase and remove spaces
            parentId = baseName + 'Category';
            subCategoryId = baseName + 'SubCategory';
            $('<li id="' + parentId + '" class="categoryTitle">' + array[key] + '</li>').appendTo($(divSelector));
            $('<ul style="display: none" id="' + subCategoryId + '" class="subCategory"></ul>').appendTo('#' + parentId);
        } else { //It's an item in the subcategory
            subCategorySelector = '#' + array.title.toLowerCase().replace(/\s/g, '') + 'SubCategory';
            $('<li id="' + key + 'Picker" data-element="' + key + '">' + array[key] + '</li>').appendTo($(subCategorySelector));
            if ($('#' + key).length) { //It's already been added to the screen
                $('#' + key + 'Picker').css('background-color', '#21b9b0');
                $('#' + key + 'Picker').css('border-color', '#21b9b0');
            }
        }
    });
};
action.setCarouselOpacity = function (div) {
    var centerIndex = $('#' + div).find('.slick-center').attr('data-slick-index'),
        lastEl = $('#' + div).find('[data-slick-index=' + (JSON.parse(centerIndex) - 1) + ']'),
        centerEl = $('#' + div).find('[data-slick-index=' + (JSON.parse(centerIndex)) + ']'),
        nextEl = $('#' + div).find('[data-slick-index=' + (JSON.parse(centerIndex) + 1) + ']'),
        centerUl,
        text;
    $('#' + div).find('[data-slick-index=' + (JSON.parse(centerIndex) - 2) + ']').css({
        'opacity': 0.07,
        'font-size': '16px',
        'height': 'auto',
        'border': '1px solid transparent'
    });
    $(lastEl).css({
        'opacity': 0.5,
        'font-size': '16px',
        'height': 'auto',
        'border': '1px solid transparent'
    });
    $(lastEl).removeClass("elementPanelPreview");
    $(centerEl).css({
        'opacity': 1,
        'pointer-events': 'auto',
        'font-size': '30px',
        'border': '2px solid #21b9b0'
    });
    $(centerEl).addClass("elementPanelPreview");
    $(nextEl).css({
        'opacity': 0.5,
        'font-size': '16px',
        'height': 'auto',
        'border': '1px solid transparent'
    });
    $(nextEl).removeClass("elementPanelPreview");
    $('#' + div).find('[data-slick-index=' + (JSON.parse(centerIndex) + 2) + ']').css({
        'opacity': 0.07,
        'font-size': '16px',
        'height': 'auto',
        'border': '1px solid transparent'
    });

    // Subcategory showing/hiding //
    $('#' + div).find('[data-slick-index=' + (JSON.parse(centerIndex) - 2) + ']').find('ul').first().hide();
    lastEl.find('ul').first().hide(); // Make sure the other ones are hidden

    centerUl = $(centerEl).find('ul').first();
    //centerUl.css('top', '-' + (((numLis * 32 + (5*(numLis - 1))) / 2) - 13) + 'px');
    centerUl.show(); // Show the subcategory for the center ul

    nextEl.find('ul').first().hide(); // Make sure the other ones are hidden
    $('#' + div).find('[data-slick-index=' + (JSON.parse(centerIndex) + 2) + ']').find('ul').first().hide();
    // ---- //

    text = centerEl.clone().children().remove().end().text(); // Hooray for StackOverflow
    // clone the element, select the children, remove all children, go back to selected element, get text
    if (text.length >= 10) {
        $(centerEl).css('height', 34); // Make sure the height doesn't change when font size is decreased
        if (text.length > 14) {
            $(centerEl).css("font-size", 17);
        } else {
            $(centerEl).css("font-size", 20);
        }
    }
};

action.shouldSlickProgress = function (div) {
    // This nastiness is to check whether or not we want to go to the next thing. So it's either if it's got less than or equal to 5 items in the list
    //      or if the next element in the list isn't dummyOne
    return $($('#' + div).find('.slick-track')[0]).children().length <= 5 || $($('#' + div).find("[data-slick-index=" + (JSON.parse($('#' + div).find('.slick-center').attr('data-slick-index')) + 1) + "]")[0]).attr('id') !== 'dummyOne';
};
