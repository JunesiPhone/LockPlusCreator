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
 * Creates element menu clock, weather, system, misc
 *
 *
 */

action.createLI = function (type, div) { //create add menu
    var numSlides = 0,
        padding = '69px',
        numDivChildren,
        dummyLiOne,
        dummyLiTwo,
        startSlide,
        prevButton,
        nextButton;
    $('#' + div).empty();
    action.parseElementsArray(type, '#' + div);
    if ($('#' + div).attr('class') === "" || typeof $('#' + div).attr('class') === typeof undefined) {
        numSlides = 0;
        padding = '69px';
        numDivChildren = $('#' + div).children().length;
        if (numDivChildren > 5) { // This is specifically for "System Elements"
            numSlides = 5;
            dummyLiOne = $('<li id="dummyOne"><a title=""><label></label></a></li>');
            dummyLiTwo = $('<li id="dummyTwo"><a title=""><label></label></a></li>');
            $('#' + div).append(dummyLiOne);
            $('#' + div).append(dummyLiTwo);
        } else {
            numSlides = numDivChildren - 1;
            padding = '28px';
        }

        startSlide = 0;
        $('#' + div).slick({
            centerMode: true,
            centerPadding: padding,
            infinite: false,
            arrows: true,
            slide: 'li',
            speed: 100,
            vertical: true,
            initialSlide: startSlide,
            slidesToShow: numSlides,
            verticalSwiping: false
        });

        $($('#' + div).find('[aria-live=polite]')).css('width', '500px');
        $('.slick-slide').css('float', 'none');

        prevButton = $('<button class="slick-arrow slickNext fa fa-arrow-down" style="display: block;"></button>'); //Create a new button that's not related to the old one at all
        $($('#' + div).find('.slick-next')[0]).remove(); // Remove the old, slick-made button. It does things we don't want
        $(prevButton).html('');
        $(prevButton).click(function () {
            action.slickProgress('next', div);
        }); // Send it through our own custom handler
        $('#' + div).append(prevButton); // Actually add the new button

        nextButton = $('<button class="slick-arrow slickPrev fa fa-arrow-up" style="display: block;"></button>');
        $($('#' + div).find('.slick-prev')[0]).remove();
        $(nextButton).html('');
        $(nextButton).click(function () {
            action.slickProgress('prev', div);
        });
        $('#' + div).append(nextButton);

        if (numDivChildren <= 5) {
            $($('#' + div).find('[aria-live=polite]')).attr('style', 'height: 126px!important; padding: 28px 0px;');
        }

        action.setCarouselOpacity(div);
    } else {
        $('#' + div).attr('class', '');
    }
    $('#' + div).on('mousewheel', function (e) {
        if (e.deltaY > 0) {
            $('#' + div).slick('slickPrev');
            action.setCarouselOpacity(div);
        } else {
            if (action.shouldSlickProgress(div)) {
                $('#' + div).slick('slickNext');
                action.setCarouselOpacity(div);
            }
        }
        e.preventDefault();
    });
    $('#' + div).hover(function () {
        $(document).keyup(function () {
            if (event.keyCode === 38) {
                $('#' + div).slick('slickPrev');
            } else if (event.keyCode === 40) {
                if (action.shouldSlickProgress(div)) {
                    $('#' + div).slick('slickNext');
                }
            }
            action.setCarouselOpacity(div);
        });
    }, function () {
        $(document).unbind("keyup");
    });
    if ($('#' + div + ":hover").length) {
        $('#' + div).mouseenter();
    } // Check if the mouse is already hovering over it when it loads
};
