/*jslint
  node: true,
  sloppy: true,
  browser: true
*/
/*global
  $,
  fontArray
*/

/**
 * pre-loads fonts
 * DocumentFragment to reduce draws
 * Loads after arrays.js as it contains fontArray
*/

$(window).load(function () {
    var fpre = document.querySelector('.font_preload'),
        i,
        f,
        fragment = document.createDocumentFragment();
    for (i = 0; i < fontArray.length; i += 1) {
        f = document.createElement('SPAN');
        f.setAttribute('style', 'font-family:' + fontArray[i] + ';');
        f.innerHTML = "test";
        fragment.appendChild(f);
    }
    fpre.appendChild(fragment);
});
