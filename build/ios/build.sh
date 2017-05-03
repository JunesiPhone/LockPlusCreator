#!/bin/bash

echo "************ Merging CSS ****************"

sh tools/concatCSS.sh

echo "************ Compress CSS ****************"

sh tools/compressCSS.sh main ../../creator/css/iosmain.css


echo "************ Merging/Compress JS iosincludes.min.js ****************"

sh tools/mergeJS.sh ../../creator/js/libraries/jquery-2.1.4.min.js ../../creator/js/libraries/slick.min.js ../../creator/js/libraries/jquery.mousewheel.min.js ../../creator/js/libraries/jquery-ui.js ../../creator/js/libraries/spectrum.js ../../creator/js/libraries/prefixfree.min.js ../../creator/js/libraries/StackBlur.js  ../../creator/js/libraries/html2canvas.js ../../creator/js/libraries/UITouchPunch.js ../../creator/js/libraries/stroll.js  ../../creator/js/libraries/fastclick.js ../../creator/js/libraries/blob.js  ../../creator/js/iosincludes.min.js


echo "************ Merging/Compress ioscompiled.min.js ****************"

sh tools/mergeJS.sh  ../../creator/js/iosmain/constants.js ../../creator/js/main/clock.js ../../creator/js/main/arrays.js ../../creator/js/main/load.js ../../creator/js/iosmain/main.js ../../creator/js/iosmain/events.js ../../creator/js/iosmain/action_gradient.js ../../creator/js/iosmain/action_weight.js ../../creator/js/iosmain/action_undoredo.js ../../creator/js/iosmain/action_cleartheme.js  ../../creator/js/iosmain/action_createLi.js  ../../creator/js/iosmain/action_elementpanel.js  ../../creator/js/iosmain/action_font.js  ../../creator/js/iosmain/action_size.js  ../../creator/js/iosmain/action_setcss.js ../../creator/js/iosmain/action_weathericon.js ../../creator/js/iosmain/action_transform.js  ../../creator/js/iosmain/action_shadow.js ../../creator/js/iosmain/action_text.js  ../../creator/js/iosmain/action_input.js  ../../creator/js/iosmain/action_position.js ../../creator/js/iosmain/action_selection.js  ../../creator/js/iosmain/action_loadsaved.js  ../../creator/js/iosmain/action_draggable.js  ../../creator/js/iosmain/action_addremove.js  ../../creator/js/iosmain/action_styles.js ../../creator/js/iosmain/action_savestorage.js ../../creator/js/iosmain/action_slickcarousel.js  ../../creator/js/iosmain/action_background.js ../../creator/js/iosmain/action_help.js ../../creator/js/iosmain/app.js ../../creator/js/iosmain/toolpanel.js ../../creator/js/iosmain/powerange.js ../../creator/js/iosmain/elementmenu.js ../../creator/js/iosmain/editmenu.js ../../creator/js/iosmain/iconmenu.js ../../creator/js/ioscompiled.min.js
