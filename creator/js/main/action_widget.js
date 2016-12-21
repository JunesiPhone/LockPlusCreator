/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/
/*global
  action,
  constants,
  $
*/

/**
 * Add widgets to the screen
 * Shows widgets to user then injects file into the screen of the phone
 * Loads after action.js as it contains constants and action object
 */
var replaceWidget, loadexjsfile;
action.replaceWidget = function (key) {
    var value = action.savedElements.placedElements[key];
    Object.keys(value).forEach(function (skey) { //loop styles on the object
        var styleVal = value[skey];
        $('#' + key).css(skey, styleVal);
    });
};
action.loadexjsfile = function (id, over) {
    var link, fileref, num;
    link = 'http://lockplus.us/creator/widgets/images/' + id + '.js';
    fileref = document.createElement('script');
    num = Math.floor((Math.random() * 10) + 1);
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute('title', 'widgetScript');
    fileref.setAttribute("src", link + '?00' + num);
    fileref.async = true;
    if (fileref !== "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
    fileref.onload = function () {
        if (over) {
            action.addDraggable(id);
            action.replaceWidget(id);
        } else {
            action.movedElements[id] = {
                type: 'widget'
            };
            action.savedElements.placedElements = action.movedElements;
            action.addDraggable(id);

            $('#' + id).css('top', '200');
        }
    };
};

action.addToPage = function (id, replace) {
    if (!document.getElementById(id)) { //check to see if it don't already exist.
        $('#widgetlist').remove();
        action.loadexjsfile(id, false);
    } else {
        $('#' + id).remove();
        $('#widgetlist').remove();
        action.loadexjsfile(id, false);
    }
    if (!replace) {
        localStorage.setItem('placedElements', JSON.stringify(action.savedElements));
    }
};

action.fillWidgetPanel = function () { // TODO apply with DocumentFragment
    var div = document.createElement("div"),
        divimg,
        imgs,
        i;
    div.id = 'widgetlist';
    div.className = 'widgetPanel';
    document.body.appendChild(div);
    $('#widgetlist').on('click', function (event) {
        action.addToPage(event.target.title);
    });
    for (i = 0; i < constants.widgets.length; i += 1) {
        divimg = document.createElement('div');
        divimg.className = 'divimg';
        imgs = document.createElement('img');
        imgs.src = 'http://lockplus.us/creator/widgets/images/' + constants.widgets[i] + '.jpg';
        imgs.title = constants.widgets[i];
        divimg.appendChild(imgs);
        div.appendChild(divimg);
    }
};

action.showWidgetPanel = function () {
    this.fillWidgetPanel();
};
