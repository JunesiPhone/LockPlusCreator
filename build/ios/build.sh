#!/bin/bash

echo "************ Merging CSS ****************"

sh tools/concatCSS.sh

echo "************ Compress CSS ****************"

sh tools/compressCSS.sh main ../../creator/css/iosmain.css


echo "************ Merging/Compress JS iosincludes.min.js ****************"

sh tools/mergeJS.sh ../../creator/js/libraries/jquery-2.1.4.min.js ../../creator/js/libraries/slick.min.js ../../creator/js/libraries/jquery.mousewheel.min.js ../../creator/js/libraries/jquery-ui.js ../../creator/js/libraries/spectrum.js ../../creator/js/libraries/prefixfree.min.js ../../creator/js/libraries/StackBlur.js  ../../creator/js/libraries/html2canvas.js ../../creator/js/libraries/UITouchPunch.js ../../creator/js/libraries/stroll.js  ../../creator/js/libraries/fastclick.js ../../creator/js/libraries/blob.js  ../../creator/js/iosincludes.min.js


echo "************ Merging/Compress ioscompiled.min.js ****************"

sh tools/mergeJS.sh  ../../creator/js/iosmain/constants.js ../../creator/js/main/clock.js ../../creator/js/main/arrays.js ../../creator/js/main/load.js ../../creator/js/iosmain/main.js ../../creator/js/iosmain/events.js ../../creator/js/main/action_gradient.js ../../creator/js/main/action_weight.js ../../creator/js/main/action_undoredo.js ../../creator/js/main/action_cleartheme.js  ../../creator/js/main/action_createLi.js  ../../creator/js/main/action_elementpanel.js  ../../creator/js/main/action_font.js  ../../creator/js/main/action_size.js  ../../creator/js/main/action_setcss.js ../../creator/js/main/action_weathericon.js ../../creator/js/main/action_transform.js  ../../creator/js/main/action_shadow.js ../../creator/js/main/action_text.js  ../../creator/js/main/action_input.js  ../../creator/js/main/action_position.js ../../creator/js/main/action_selection.js  ../../creator/js/main/action_loadsaved.js  ../../creator/js/main/action_draggable.js  ../../creator/js/main/action_addremove.js  ../../creator/js/main/action_styles.js ../../creator/js/main/action_savestorage.js ../../creator/js/main/action_slickcarousel.js  ../../creator/js/main/action_background.js ../../creator/js/main/action_help.js ../../creator/js/iosmain/app.js ../../creator/js/iosmain/widget.js ../../creator/js/iosmain/toolpanel.js ../../creator/js/iosmain/powerange.js ../../creator/js/iosmain/elementmenu.js ../../creator/js/iosmain/editmenu.js ../../creator/js/iosmain/iconmenu.js ../../creator/js/ioscompiled.min.js
