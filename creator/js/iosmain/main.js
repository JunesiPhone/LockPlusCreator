var tempWall,
    action = {
        savedElements: {}, //object to save elements placed
        movedElements: {}, //elements that are placed and moved
        wallpaper: '',
        uploadSelection: '', //save type of upload selection (overlay or background)
        selectedItem: '',
        selectedItems: [],
        blurTimeout: null,
        timeout: '',
        lastNotificationTime: false,
        zoomScale: 1.5,
        isScrollingEdit: false,
        actionQueue: [], //Queue of actions for undo/redo
        queuePosition: -1, //The current position within this ↑ queue, which action was most recently done
        isUndoingRedoing: false, //True while it's either undoing or redoing, prevents more from being added to the stack while it's processing the stack
        sizeQueueTimeout: {
            timeout: null,
            isEditingText: false,
            isTimeoutRunning: false,
            previousCssKey: '',
            previousAction: null,
            initialValue: ''
        }
    };


//keep

action.delete = function () {
    if (action.selectedItems.length > 0) {
        for (var i = 0; i < action.selectedItems.length; i++) {
            action.removeFromScreen(action.selectedItems[i], true);
        }
        action.selectedItems = [];
    } else {
        action.removeFromScreen(action.selectedItem, true);
    }
};
action.saveTheme = function () { //saves info to divs and sends form to create plist
    if (action.wallpaper !== null && action.wallpaper !== 'null') {
        $('#wallpaper').hide();




        //$('#Twallpaper').val(file);
        //$('#myform').submit();

        var wallCanvas = document.getElementById('blurcanvas');
        var imageData = wallCanvas.toDataURL();

        if (imageData.length > 7) { //if canvas contains data
            $('.screen').css('background-image', 'url(' + imageData + ')');
            action.wallpaper = imageData;
            action.saveStorage();
        } else { // no data
            $('.screen').css('background-image', 'url(' + action.wallpaper + ')');
        }

        //$('#blurcanvas').remove();
        //$('#wallpaper').remove();
        $('miniWallpaper').remove();
        $('miniBlurCanvas').remove();
    }
    //----End Wallpaper ----//

    $('.toolPanel').css('display', 'none');
    $('.elementPanel').css('display', 'none');
    $('#tips').css('display', 'none');


    //fix for rotated elements

    var children = document.getElementById('screenElements').children;
    for (var i = 0; i < children.length; i++) {
        var transform = $(children[i]).css('transform');
        if (transform !== 'none') {
            //var id = children[i].id;
            var Tp = $(children[i]).css('top').replace(/[^-\d\.]/g, '');
            var Lf = $(children[i]).css('left').replace(/[^-\d\.]/g, '');
            $(children[i]).css({
                'top': Tp - 350 + 'px',
                'left': Lf - 175 + 'px'
            });
        }
    }

    if ($('.newSVG')[0]) {
        var svg = document.querySelector('.newSVG');
        var transform = $(svg.children[0]).css('transform');
        if (transform != "none") {
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
            var ca = document.getElementById('previewCanvas');
            ca.setAttribute('title', "Theme saved, refresh the page");
            ca.className = 'pCanvas';
            ca = ca.children[0];
            //var context = ca.getContext('2d');
            var dataURL = ca.toDataURL();

            $('.phone').css('display', 'none'); //dont hide until html2canvas has rendered it.
            $('#elPanel').css('display', 'none');
            $('#roundmenu').css('display', 'none');
            $('.newSVG').empty(); //remove svg

            //Fixing what html2canvas breaks
            $("body").append('<form id="saveForm"><h3>Enter theme details</h3><label class="flabel">Your Name</label><input type="text" name="fdevname" id="fdevname" placeholder="Your Name"/><label class="flabel">Your Email</label><input type="text" name="femail" id="femail" placeholder="Email@email.com"/><label class="flabel">Theme Name</label><input type="text" name="fthemename" id="fthemename" placeholder="Theme Name"/></br></br><span class="saveNote"><b>Note:</b> If you are testing this theme put the word test somewhere in the theme name. These automatically get deleted after a period of time. I would always use this method unless you are familiar with the creator.</span></br><div class="fsubmit">Submit</div><label class="errorlabel">*must fill in all inputs</label></form>');




            //end fixing what html2canvas broke
            $('.fsubmit').on('click', function () {
                document.getElementById('loader').style.display = 'block';

                var devname = $('#fdevname').val();
                var themename = $('#fthemename').val();
                var email = $('#femail').val();


                try {

                    //if no canvas make one.
                    if (imageData != undefined) {
                        if (imageData.split(',')[1] === '') {
                            stackBlurImage('wallpaper', 'blurcanvas', 0, false); //must add a blur to make canvas show
                        }
                    } else {
                        wallCanvas = document.createElement('canvas');
                    }


                    if (wallCanvas.toBlob) {
                        wallCanvas.toBlob(
                            function (blob) {
                                // Do something with the blob object,
                                // e.g. creating a multipart form for file uploads:
                                var formData = new FormData();
                                formData.append('file', blob, 'test');
                                formData.append('fileName', themename);
                                formData.append('email', email);
                                formData.append('devname', devname);
                                formData.append('Tpreview', dataURL);
                                formData.append('Ticon', action.savedElements.iconName || '');
                                formData.append('Toverlay', (action.savedElements.overlay) ? action.savedElements.overlay : '');
                                formData.append('Telements', JSON.stringify(action.savedElements.placedElements) || '');

                                $.ajax({
                                    url: 'php/exportiOS.php',
                                    data: formData,
                                    processData: false,
                                    contentType: false,
                                    type: 'POST',
                                    success: function (msg) {
                                        //location.href = msg;
                                        if (msg === "Exists") {
                                            alert('The name you used already exists, please try another');
                                        } else if (msg === 'http://lockplus.us/php/dump.php') {
                                            location.href = msg;
                                        } else {
                                            alert("Whoops there was an error, please report to @JunesiPhone " + msg);
                                        }
                                        document.getElementById('loader').style.display = 'none';
                                    }
                                });
                                /* ... */
                            },
                            'image/jpg'
                        );
                    }
                } catch (err) {

                    alert("Whoops there was an error, please report to @JunesiPhone " + err);
                    document.getElementById('loader').style.display = 'none';
                }
            });
        }, 1000);

    });
};
