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
  constants,
  fontArray,
  $
*/
/**
 * Weather Icons
 *
 *
 */

action.populateIcons = function () {
    var i,
        img;
    $('.iconList').empty();
    for (i = 0; i < constants.iconList.length; i += 1) {
        img = document.createElement('img');
        img.src = 'weather/' + constants.iconList[i] + '.png';
        img.id = constants.iconList[i];
        $('.iconList').append(img);
    }
    $('.iconList').toggle('display');
};
action.setNewIcon = function (name, val) {
    if (!val) {
        $('.iconList').toggle('display');
    }
    //$('.icon').attr('src', 'http://junesiphone.com/weather/IconSets/'+name+'/39.png');
    $('.icon').attr('src', 'weather/real/' + name + '.png');
    action.savedElements.iconName = name;
    this.saveStorage();
};
