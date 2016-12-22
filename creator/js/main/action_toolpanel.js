/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/
/*global
  action,
  constants,
  $,
  editSB,
  isWidget,
  alert
*/


/**
 * Toolpanel is the main buttons on the left displayed after main buttons
 * div (class) = toolPanel
 * Loads after action.js as it contains constants and action object
 */

action.delete = function () {
    var i;
    if (action.selectedItems.length > 0) {
        for (i = 0; i < action.selectedItems.length; i += 1) {
            action.removeFromScreen(action.selectedItems[i], true);
        }
        action.selectedItems = [];
    } else {
        action.removeFromScreen(action.selectedItem, true);
    }
};

action.toolPanel = function (evt) { //handle clicks from toolpanel
    var id = evt.target.id;
    action.uploadSelection = id;
    if (id === 'cgOverlay' || id === 'cgBackground') {
        $('#bgInput').click();
    }
    if (id === 'widget') {
        this.showWidgetPanel();
    }
    if (id === 'overlay') {
        this.showIconMenu(constants.overlayArray, -1);
    }
    if (id === 'clearOverlay') {
        $('.screenoverlay').css('background-image', '');
        action.savedElements.overlay = '';
        action.saveStorage();
    }
    if (id === 'background') {
        this.showIconMenu(constants.backgroundArray, -1);
    }
    if (id === 'openBackground') {
        this.openBackground('original');
    }
    if (id === 'backgroundBlur') {
        this.cgSize('backgroundBlur', constants.backgroundArray[2], '', 0, 100, 'backBlur', 'backBlur', action.backgroundBlur, false, false, 'Background Blur');
    }
    if (id === 'openBlurryBackground') {
        this.openBackground('blurry');
    }
    if (id === 'clearBackground') {
        this.setBG('');
    }
    if (id === 'backToTools') {
        this.showIconMenu(constants.toolArray, -1);
    }
    if (id === 'clear') {
        action.clearTheme(-1);
    }
    if (id === 'save') {
        this.saveTheme();
    }
    if (id === 'load') {

        if (editSB) {
            window.open('http://lockplus.us/creator/load/index.php?edit=SB');
            window.close();
        }
        if (isWidget) {
            alert('This feature is not available at this time');
        } else {
            window.open(location.href.replace('#', '') + 'load');
            window.close();
        }

    } //load php stuff
    if (id === 'element') {
        action.elementIconClick();
    }
    if (id === 'size') {
        this.cgSize('fontSize', constants.editArray[0], 'px', 5, 300, 'font-size', 'font-size', action.updateSize);
    }
    if (id === 'width') {
        this.cgSize('widthSize', constants.editArray[1], 'px', 1, $('.screen').width(), 'width', 'width', action.updateSize);
    }
    if (id === 'height') {
        this.cgSize('heightSize', constants.boxEditArray[1], 'px', 1, $('.screen').height(), 'height', 'height', action.updateSize);
    }
    if (id === 'position') {
        this.cgPosition();
    }
    if (id === 'align') {
        this.cgalign(); /*action.setHelpText('Select left, right or center. Requires width to be set.');*/
    }
    if (id === 'fonts') {
        this.cgfont(); /*action.setHelpText('View live preview, tap font to select.');*/
    }
    if (id === 'uppercase') {
        this.cguppercase(); /* action.setHelpText('Choose uppercase, capitalize, or lowercase.');*/
    }
    if (id === 'style') {
        this.cgStyle();
    }
    if (id === 'weight') {
        this.cgweight(); /*action.setHelpText('Press + and - buttons, or choose bold or normal.');*/
    }
    if (id === 'shadow') {
        action.showIconMenu(constants.shadowArray, -1); /*action.setHelpText('New menu opened (shadow menu)');*/
    }
    if (id === 'boxShadow') {
        action.showIconMenu(constants.boxShadowArray, -1); /*action.setHelpText('New menu opened (box-shadow menu)');*/
    }
    if (id === 'hShadow') {
        this.cgSize('hShadow', constants.shadowArray[0], 'px', -100, 100, 'hShadow', 'hShadow', action.updateShadow, false, false, 'Horizontal');
    }
    if (id === 'vShadow') {
        this.cgSize('vShadow', constants.shadowArray[1], 'px', -100, 100, 'vShadow', 'vShadow', action.updateShadow, false, false, 'Vertical');
    }
    if (id === 'blur') {
        this.cgSize('blur', constants.shadowArray[2], 'px', 0, 50, 'blur', 'blur', action.updateShadow, false, false, 'Blur Radius');
    }
    if (id === 'radius') {
        this.cgSize('radiusSize', constants.boxEditArray[3], 'px', 0, $('#' + action.selectedItem).width() / 2, 'border-radius', 'border-radius', action.updateSize, false, false, 'Box Radius');
    }
    if (id === 'transform') {
        action.showIconMenu(constants.transformArray, -1);
    }
    if (id === 'rotation') {
        this.cgSize('rotationAngle', constants.transformArray[0], 'deg', 0, 360, 'rotate', 'rotate', action.updateTransform, false, false, 'Rotation Angle');
    }
    if (id === 'skewX') {
        this.cgSize('skewXAngle', constants.transformArray[1], 'deg', 0, 360, 'skewX', 'skewX', action.updateTransform, false, false, 'X Skew Angle');
    }
    if (id === 'skewY') {
        this.cgSize('skewYAngle', constants.transformArray[2], 'deg', 0, 360, 'skewY', 'skewY', action.updateTransform, false, false, 'Y Skew Angle');
    }
    if (id === 'clearTransform') {
        action.updateTransform('', '', '', '', 'clear');
    }
    if (id === 'shadowColor') {
        this.cgShadowColor();
    }
    if (id === 'clearShadow') {
        this.updateShadow('', '', '', '', 'clear');
    }
    if (id === 'backToEdit') {
        action.showMultiSelectionMenu();
    }
    if (id === 'boxhShadow') {
        this.cgSize('boxhShadow', constants.boxShadowArray[0], 'px', -100, 100, 'boxhShadow', 'boxhShadow', action.updateShadow, false, false, 'Horizontal');
    }
    if (id === 'boxvShadow') {
        this.cgSize('boxvShadow', constants.boxShadowArray[1], 'px', -100, 100, 'boxvShadow', 'boxvShadow', action.updateShadow, false, false, 'Vertical');
    }
    if (id === 'boxblur') {
        this.cgSize('boxblur', constants.boxShadowArray[2], 'px', 0, 50, 'boxblur', 'boxblur', action.updateShadow, false, false, 'Blur Radius');
    }
    if (id === 'boxshadowColor') {
        this.cgShadowColor(true);
    }
    if (id === 'boxclearShadow') {
        this.updateShadow('', '', '', '', 'clear');
    }
    if (id === 'color') {
        this.cgcolor(false, 'color', 'colorDiv');
    }
    if (id === 'boxColor') {
        this.cgcolor(false, 'background-color', 'boxColorDiv');
    }
    if (id === 'customText') {
        this.cgCustomText();
    }
    if (id === 'delete') {
        action.delete();
    }
    if (id === 'iconsize') {
        this.cgSize('iconSize', constants.iconArray[0], 'px', 5, $('.screen').width(), 'width', 'width', action.updateSize);
    }
    if (id === 'changeicon') {
        this.populateIcons();
    }
    if (id === 'affixes') {
        this.showIconMenu(constants.affixArray, -1);
    }
    if (id === 'customPrefix') {
        this.cgAffix('prefix');
    }
    if (id === 'customSuffix') {
        this.cgAffix('suffix');
    }
    if (id === 'clearAffixes') {
        this.cgAffix('clear');
    }
    if (id === 'border') {
        this.showIconMenu(constants.borderArray, -1);
    }
    if (id === 'borderStyle') {
        this.cgBorderStyle();
    }
    if (id === 'borderWidth') {
        this.cgSize('borderWidth', constants.borderArray[1], 'px', 0, 200, 'border-width', 'borderWidth', action.updateSize);
    }
    if (id === 'border-color') {
        this.cgcolor(false, 'border-color', 'border-colorDiv');
    }
    if (id === 'clearBorder') {
        this.setCss(action.selectedItem, 'border', '');
    }
    if (id === 'posSystem') {
        this.cgPosSystem();
    }
    if (id === 'multiPos') {
        this.cgMultiPosition();
    }

    //Gradients
    if (action.selectedItem !== null && id.toLowerCase().match(/gradient/gmi) !== null && document.getElementById(action.selectedItem).style.background.substring(0, 3) !== 'lin' && id !== 'linearGradient' && id !== 'linearBoxGradient' && id !== 'linearTextGradientDiv') {
        action.setCss(action.selectedItem, 'background', 'linear-gradient(rgb(255,0,0),rgb(255,255,0) 50%,rgb(0,0,255) 90%)');
    }
    if (id === 'linearBoxGradient') {
        this.showIconMenu(constants.linearBoxGradientArray, -1);
    }
    if (id === 'linearGradient') {
        this.showIconMenu(constants.linearGradientArray, -1);
    }
    if (id === 'gradientType') {
        this.cgGradientPurpose();
    }
    if (id === 'linearGradientAngle') {
        this.cgSize('rotateLinearGradient', constants.linearGradientArray[1], 'deg', 0, 360, 'rotate', 'rotate', action.updateGradient, false, false, 'Rotate Gradient');
    }
    if (id === 'linearGradientStartColor') {
        this.cgLinearGradientColor(constants.linearGradientArray[2], 'color~0.5');
    }
    if (id === 'linearGradientStopColorOne') {
        this.cgLinearGradientColor(constants.linearGradientArray[3], 'color~1');
        this.cgSize('linGradientStopOnePercent', constants.linearGradientArray[3], '%', 0, 100, 'pos~1', 'pos~1', action.updateGradient, false, false, 'Stop 1 Distance');
    }
    if (id === 'linearGradientStopColorTwo') {
        this.cgLinearGradientColor(constants.linearGradientArray[4], 'color~2');
        this.cgSize('linGradientStopTwoPercent', constants.linearGradientArray[4], '%', 0, 100, 'pos~2', 'pos~2', action.updateGradient, false, false, 'Stop 2 Distance');
    }
    if (id === 'clearGradient') {
        this.updateGradient('', '', '', '', 'clear');
    }
};

$('.toolPanel').on('click', function (event) { //grab clicks from toolpanel
    action.toolPanel(event);
});
