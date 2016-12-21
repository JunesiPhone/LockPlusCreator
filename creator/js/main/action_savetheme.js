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
  isInEditMode,
  html2canvas,
  isWidget,
  $
*/
/**
 * Saving theme
 *
 *
 */
//TODO fix this
action.saveTheme = function () { //saves info to divs and sends form to create plist
    //----Wallpaper stuff----//
    var canvas,
        imageData,
        children,
        i,
        transform,
        Tp,
        Lf,
        svg;
    if (action.wallpaper !== null && action.wallpaper !== 'null') {
        $('#wallpaper').hide();
        canvas = document.getElementById('blurcanvas');
        canvas.style.display = 'none';
        canvas.className = '';
        imageData = canvas.toDataURL();
        if (imageData.length > 7) { //if canvas contains data
            $('.screen').css('background-image', 'url(' + imageData + ')');
            action.wallpaper = imageData;
            action.saveStorage();
        } else { // no data
            $('.screen').css('background-image', 'url(' + action.wallpaper + ')');
        }

        $('#blurcanvas').remove();
        $('#wallpaper').remove();
        $('miniWallpaper').remove();
        $('miniBlurCanvas').remove();
    }
    //----End Wallpaper ----//

    $('.toolPanel').css('display', 'none');
    $('.elementPanel').css('display', 'none');
    $('#tips').css('display', 'none');


    //fix for rotated elements

    children = document.getElementById('screenElements').children;
    for (i = 0; i < children.length; i += 1) {
        transform = $(children[i]).css('transform');
        if (transform !== 'none') {
            //var id = children[i].id;
            Tp = $(children[i]).css('top').replace(/[^\-\d\.]/g, '');
            Lf = $(children[i]).css('left').replace(/[^\-\d\.]/g, '');
            $(children[i]).css({
                'top': Tp - 350 + 'px',
                'left': Lf - 175 + 'px'
            });
        }
    }

    if ($('.newSVG')[0]) {
        svg = document.querySelector('.newSVG');
        transform = $(svg.children[0]).css('transform');
        if (transform !== "none") {
            $(svg.children[0]).css({
                'position': 'absolute',
                'top': '-350px',
                'left': '-170px'
            });
            //console.log('LockPlus changed svg position for save.');
        }
    }
    //end fix rotated elements

    html2canvas(document.querySelector('.screen')).then(function (canvas) {
        document.getElementById('previewCanvas').appendChild(canvas);
        setTimeout(function () {
            var ca = document.getElementById('previewCanvas'),
                dataURL,
                devname,
                themename,
                email,
                emTest;
            ca.setAttribute('title', "Theme saved, refresh the page");
            ca.className = 'pCanvas';
            ca = ca.children[0];
            //var context = ca.getContext('2d');
            dataURL = ca.toDataURL();
            $('.phone').css('display', 'none'); //dont hide until html2canvas has rendered it.
            $('.newSVG').empty(); //remove svg

            if (isInEditMode === false) {
                //Fixing what html2canvas breaks
                if (isWidget) {
                    $("body").append('<form id="saveForm"><h3>Enter theme details</h3><label class="flabel">Your Name</label><input type="text" name="fdevname" id="fdevname" placeholder="Your Name"/><label class="flabel">Your Email</label><input type="text" name="femail" id="femail" placeholder="Email@email.com"/><label class="flabel">Theme Name</label><input type="text" name="fthemename" id="fthemename" placeholder="Theme Name"/><div class="fsubmit">Submit</div><label class="errorlabel">*must fill in all inputs</label><input type="radio" name="themeSize" value="baseiwidgeti5"> iPhone 5<br><input type="radio" name="themeSize" value="baseiwidgeti6" checked> iPhone 6<br><input type="radio" name="themeSize" value="baseiwidget6+"> iPhone 6+<hr></form>');
                } else {
                    $("body").append('<form id="saveForm"><h3>Enter theme details</h3><label class="flabel">Your Name</label><input type="text" name="fdevname" id="fdevname" placeholder="Your Name"/><label class="flabel">Your Email</label><input type="text" name="femail" id="femail" placeholder="Email@email.com"/><label class="flabel">Theme Name</label><input type="text" name="fthemename" id="fthemename" placeholder="Theme Name"/></br></br><span class="saveNote"><b>Note:</b> If you are testing this theme put the word test somewhere in the theme name. These automatically get deleted after a period of time. I would always use this method unless you are familiar with the creator.</span></br><div class="fsubmit">Submit</div><label class="errorlabel">*must fill in all inputs</label></form>');
                }
                //end fixing what html2canvas broke
                $('.fsubmit').on('click', function () {
                    devname = $('#fdevname').val();
                    themename = $('#fthemename').val();
                    email = $('#femail').val();
                    emTest = /\S+@\S+\.\S+/.test(email);
                    if (emTest !== true) {
                        document.querySelector('.errorlabel').innerHTML = "* Enter a valid Email";
                        $('.errorlabel').css('display', 'block');
                    } else {
                        //if (themename !== '' && devname !== '' && /^[a-zA-Z0-9- ]*$/.test(themename) == true && /^[a-zA-Z0-9- ]*$/.test(devname) && devname !== 'Frank') {
                        if (themename !== '' && devname !== '' && /^[a-zA-Z0-9- ]*$/.test(devname) && devname !== 'Frank') {
                            // if (!/\d/.test(themename)) {
                            $('#fileName').val(themename);
                            $('#email').val(email);
                            try {
                                //for iWidget.html
                                $('#themeType').val(document.querySelector('input[name="themeSize"]:checked').value);
                            } catch (err) {
                                console.log(err);
                            }
                            $('#devname').val(devname);
                            $('#Tpreview').val(dataURL);
                            $('#Ticon').val(action.savedElements.iconName || '');
                            $('#Twallpaper').val(action.wallpaper || '');
                            $('#Toverlay').val(action.savedElements.overlay || '');
                            $('#Telements').val(JSON.stringify(action.savedElements.placedElements) || '');
                            $('#myform').submit();
                            $('#saveForm').css('display', 'none');
                            $('.loader').toggle('display');
                            //  } else {
                            //    $('.errorlabel').css('display', 'block');
                            //  document.querySelector('.errorlabel').innerHTML = "* Numbers are not allowed.If you want to EDIT or DELETE your theme name create an account here. <a href='http://www.lockplus.us/login/' target='_blank' style='color:black;'>LockPlus Members</a> or let us know here <a target='_blank' style='color:black;' href='http://lockplus.info/forum/index/topic/deleting-themes/'>LockPlus Forum</a>";
                            //alert('Numbers are not allowed due to people spamming v1, v2, v3, etc. Name your theme with test somewhere in the title. Example myTest or TestJune (these get purged from the server automatically). Then when you get it as you want, name it the name intented. If a theme needs deleted/changed let us know on http://LockPlus.info/forum');
                            //}


                        } else {
                            if (/^[a-zA-Z0-9- ]*$/.test(themename) === false) {
                                document.querySelector('.errorlabel').innerHTML = "* Please remove symbols from theme name.";
                            }
                            if (/^[a-zA-Z0-9- ]*$/.test(devname) === false) {
                                document.querySelector('.errorlabel').innerHTML = "* Please remove symbols from dev name.";
                            }
                            if (devname === 'Frank') {
                                document.querySelector('.errorlabel').innerHTML = "* PORN is not allowed Frank!!";
                            }
                            $('.errorlabel').css('display', 'block');
                        }
                    }
                });
            } else {
                $('#Tpreview').val(dataURL);
                $('#Ticon').val(action.savedElements.iconName || '');
                $('#Twallpaper').val(action.wallpaper || '');
                $('#Toverlay').val(action.savedElements.overlay || '');
                $('#Telements').val(JSON.stringify(action.savedElements.placedElements) || '');
                $('#myform').submit();
                $('#saveForm').css('display', 'none');
                $('.loader').toggle('display');
            }
        }, 1000);
    });

};
