/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/

/*global
  $,
*/
action.saveStorage = function (specialPurpose) { //save savedElements object to localStorage
    if (specialPurpose === 'wallpaper') {
        localStorage.setItem('wallpaper', action.wallpaper);
    } else {
        localStorage.setItem('placedElements', JSON.stringify(action.savedElements));
    }
};
