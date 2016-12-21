/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/
/*global
  action,
  constants,
  editSB,
  alert,
  FileReader,
  tempWall:true,
  stackBlurImage,
  showSVG,
  $
*/
/**
 * Detects when a user uploads a wall
 * Sets background
 * Loads after action.js as it contains constants and action object
 */
action.openBackground = function (purpose) { // either 'original' or 'blurry'
    var newWindow,
        newCanvas,
        imageData,
        image;
    if ($('#wallpaper').attr('src') !== 'none') {
        newWindow = window.open('');
        if (purpose === 'blurry') {
            newCanvas = document.getElementById('blurcanvas').cloneNode();
            newCanvas.className = '';
            //newCanvas.getContext('2d').drawImage(document.getElementById('blurcanvas'),0,0);
            stackBlurImage('wallpaper', newCanvas, localStorage.getItem('wallpaperBlur'), false);
            imageData = newCanvas.toDataURL();
            image = document.createElement('img');
            image.src = imageData;
            image.style.display = 'block';
        } else if (purpose === 'original') {
            image = $('#wallpaper').clone();
            image.attr('style', '');
            image.attr('width', '');
            image.attr('height', '');
        }
        $('body', newWindow.document).append(image);
        $('head', newWindow.document).append($('<title>Wallpaper</title>'));

    } else {
        action.setHelpText('No wallpaper set. Click "Change Background" above to set one.');
    }
};

action.setOverlay = function (img) { //apply overlay to screenoverlay
    document.querySelector('.svg').src = img;
    $('.screenoverlay').css('background-image', 'url(' + img + ')');
    action.savedElements.overlay = img;
    if (img.split('+')[0] === 'data:image/svg') {
        setTimeout(function () {
            showSVG('.svg', true);
            setTimeout(function () {
                var inner = document.querySelector('.newSVG').innerHTML,
                    div = document.createElement('div');
                $('.newSVG').empty();
                div.className = 'newSVG';
                div.innerHTML = inner;
                document.querySelector('.screen').appendChild(div);
            }, 0);
        }, 0);
    }
    action.saveStorage();
};

action.backgroundBlur = function (idSelector, cssKey, unit, jsCssKey, purpose) {
    var min,
        max,
        blur;
    if (purpose === 'set') {
        max = JSON.parse($(idSelector).attr('max'));
        min = JSON.parse($(idSelector).attr('min'));
        if (JSON.parse($(idSelector).val()) >= JSON.parse(max)) {
            $(idSelector).val(max);
        }
        if (JSON.parse($(idSelector).val()) <= JSON.parse(min)) {
            $(idSelector).val(min);
        }

        $('#miniBlurCanvas').show();
        stackBlurImage('miniWallpaper', 'miniBlurCanvas', $(idSelector).val(), false);
        if (action.blurTimeout !== null) {
            clearTimeout(action.blurTimeout);
        }
        action.blurTimeout = setTimeout(function () {
            //$('#miniBlurCanvas').hide();
            $('#miniBlurCanvas').removeClass('miniBlur');
            $('#miniBlurCanvas').animate({
                opacity: 0.25,
                width: 320,
                height: 568
            }, 1000, function () {
                $('#miniBlurCanvas').hide();
                $('#miniBlurCanvas').addClass('miniBlur');
                $('#miniBlurCanvas').css('opacity', '1');
            });
            stackBlurImage('wallpaper', 'blurcanvas', $(idSelector).val(), false);
            localStorage.setItem('wallpaperBlur', $(idSelector).val());
        }, 400);
    } else if (purpose === 'get') {
        blur = localStorage.getItem('wallpaperBlur');
        if (blur !== null && blur !== '0') {
            return blur;
        }
    }
};

action.setBG = function (img) { //apply background to screen
    var blur,
        wallpaper,
        canvas;
    if (img !== '') {
        $('#wallpaper').attr('src', img);
        $('#wallpaper').css('display', 'initial');
        action.wallpaper = img;

        blur = localStorage.getItem('wallpaperBlur');
        if (blur === null || blur === '' || blur === 'null') {
            blur = 0;
        }
        stackBlurImage('wallpaper', 'blurcanvas', blur, false);
        //action.isBlurred = true;

        wallpaper = document.getElementById('wallpaper');
        canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        canvas.width = wallpaper.width / 2;
        canvas.height = wallpaper.height / 2;
        canvas.getContext('2d').drawImage(wallpaper, 0, 0, wallpaper.width / 2, wallpaper.height / 2);

        $('#miniWallpaper').attr('src', canvas.toDataURL());
    } else {
        $('#wallpaper').attr('src', '');
        $('#wallpaper').hide();
        canvas = document.getElementById('blurcanvas');
        if (canvas) {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }
        action.wallpaper = null;
        localStorage.setItem('wallpaperBlur', '0');
        action.showIconMenu(constants.toolArray, -1);
        $('#bgInput').after($('#bgInput').clone(true)).remove();
    }
    action.saveStorage('wallpaper'); //we only need to set the wallpaper action.saveStorage would save everything.
};


action.uploadedImage = function (e) {
    if (editSB) {
        alert("When creating SB themes upload a screenshot of your homescreen to create your widget around them. Wallpapers are not used!");
    }
    var tw = e.target.files,
        rd;
    rd = new FileReader();
    rd.onload = (function () {
        return function (e) {
            if (action.uploadSelection === 'cgBackground') {
                $('#wallSelector').css('display', 'block');
                tempWall = e.target.result;
            } else if (action.uploadSelection === 'cgOverlay') {
                action.setOverlay(e.target.result);
            }
        };
    }(tw[0]));
    rd.readAsDataURL(tw[0]);
};

action.resizeWall = function (img, width, height) {
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL();
};


action.chooseWallSize = function (size) {
    var iPhone = size,
        newWidth,
        newHeight,
        img;

    switch (iPhone) {
    case 'i5':
        newWidth = 640;
        newHeight = 1136;
        break;
    case 'i6':
        newWidth = 750;
        newHeight = 1334;
        break;
    case '6Plus':
        newWidth = 1080;
        newHeight = 1920;
        break;
    }
    img = new Image();
    img.onload = resize;
    img.src = tempWall;

    function resize() {
        var newWall = action.resizeWall(this, newWidth, newHeight);
        localStorage.setItem('wallpaperBlur', null);
        try {
            action.setBG(newWall);
        } catch (err) {
            alert("Wallpaper too big! This file will not save to the theme! Please compress this wallpaper. Browser " + err);
        }
        $('#wallSelector').css('display', 'none');
    }
};
