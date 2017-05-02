/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true,
  unparam: true
*/
/*global
  action,
  alert,
  loadClock,
  weatherdivs,
  systemdivs,
  miscDivs,
  constants,
  $
*/
/**
 * Load saved theme
 *
 *
 */

action.remakeDIV = function (id) {
    var div = document.createElement('div');

    div.id = id;
    div.style.position = 'absolute';
    document.getElementById('screenElements').appendChild(div);
    this.addDraggable(id);
    loadClock(); //in clock.js
    weatherdivs();
    systemdivs();
    miscDivs();

};
var addedWidget = [];
action.replaceElements = function () {
    Object.keys(this.savedElements.placedElements).forEach(function (key) {
        action.remakeDIV(key); //loop object and place items
        var value = action.savedElements.placedElements[key];
        if ($.inArray(key, constants.widgets) !== -1) {
            action.addToPage(key, true);
        }
        Object.keys(value).forEach(function (skey) { //loop styles on the object
            var styleVal = value[skey];
            if (skey === 'fontSize') {
                skey = 'font-size';
            } else if (skey === 'textAlign') {
                skey = 'text-align';
            }

            if (key === 'icon') { //#icon has an inner img element, it also needs height/width changed.
                $('#icon').css(skey, styleVal);
                if (skey === 'width' || skey === 'height') {
                    $('.icon').css(skey, styleVal);
                }
            } else if (key.substring(0, 4) === 'text' && skey === 'innerHTML') {
                $('#' + key).html(styleVal);
            } else if (skey === 'data-prefix') {
                $('#' + key).attr('data-prefix', styleVal);
                $('#' + key).html(styleVal + $('#' + key).html());
            } else if (skey === 'data-suffix') {
                $('#' + key).attr('data-suffix', styleVal);
                $('#' + key).html($('#' + key).html() + styleVal);
            } else {
                $('#' + key).css(skey, styleVal);
            }
            console.log(key + 'is');
            //Widgets
            if ($.inArray(key, constants.widgets) === -1) {
                //console.log('setting widget styles');
                console.log("yes");
                try{
                  if($.inArray(key, addedWidget)){
                    addToPage(key);
                    addedWidget.push(key);
                  }
              }catch(err){
                console.log(err);
              }
                setTimeout(function () {
                    $('#' + key).css(skey, styleVal);
                }, 1000);
            }
        });
    });
};
action.loadFromStorage = function () { //reload elements onload
    if (localStorage.placedElements) {
        if (localStorage.placedElements.length > 2) { //maybe it was set to a string of {} and it breaks everything
            action.setHelpText('Click elements to adjust styles.');
            this.savedElements = JSON.parse(localStorage.placedElements);
            this.movedElements = this.savedElements.placedElements; //keep moved elements up to date too
            if (this.savedElements.overlay) { //set overlay
                this.setOverlay(this.savedElements.overlay);
            }
            if (this.savedElements.placedElements) {
                this.replaceElements(); //put items back on screen
            }
            if (this.savedElements.iconName) {
                this.setNewIcon(this.savedElements.iconName, 1); //if second paramenter dont show list
            }
        } else {
            action.setHelpText('Select Add elements to place elements.');
        }
    }
    try {
        //fix for if a theme is loaded
        if (this.savedElements.wallpaper && this.savedElements.wallpaper.length > 10) { //if theme is loaded
            try {
                localStorage.setItem('wallpaper', this.savedElements.wallpaper); //transfer to storage
                this.savedElements.wallpaper = ''; //clear here for performance
            } catch (err) {
                alert('Wallpaper was too big to load:(');
            }
        }
        action.wallpaper = localStorage.getItem('wallpaper');
        if (action.wallpaper !== '' && action.wallpaper !== null && action.wallpaper !== "null") { //set wallpaper
            this.setBG(action.wallpaper);
        }
    } catch (err) {
        alert('Error in loading wallpaper' + err);
    }
};
