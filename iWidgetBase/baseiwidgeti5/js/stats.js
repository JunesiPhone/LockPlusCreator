/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/

/*global
  IS2W,
  IS2L,
  IS2T,
  IS2S,
  checkDiv

*/

function batteryStats(options) {
    var updateBattery = function () {
        var info = {};
        info.percent = IS2S('batteryPercent');
        info.name = IS2S('deviceName');
        info.charging = IS2S('batteryState');
        info.phonesignal = IS2T('phoneSignalBars');
        info.wifi = IS2T('wifiSignalBars');
        info.ramFree = IS2S('ramFree');
        info.ramUsed = IS2S('ramUsed');
        info.ramAvailable = IS2S('ramAvailable');
        info.deviceModel = IS2S('deviceModelHumanReadable');
        options.success(info);
        setTimeout(function () {
            updateBattery();
        }, 6000);
    };
    updateBattery();
}

batteryStats({
    success: function (info) {
        var sysArray = ['name', 'firmware', 'battery', 'batterypercent', 'chargingtxt', 'chargingstate', 'unlock', 'signal', 'signalpercent', 'alarm24', 'alarm', 'alarmpm', 'wifi', 'wifipercent', 'notifymail', 'notifysms', 'notifyphone', 'notifywhats', 'notifytelegram', 'ramFree', 'ramUsed', 'ramAvailable', 'ramFreeMB', 'ramUsedMB', 'ramAvailableMB'],
            signalArray = ["0%", "20%", "40%", "60%", "80%", "100%"],
            wifiArray = ['0%', "30%", "70%", "100%"],
            i,
            div,
            value,
            prefix,
            suffix;
        for (i = 0; i < sysArray.length; i += 1) {
            div = checkDiv(sysArray[i]);
            if (div) {
                switch (div.id) {
                case 'name':
                    value = info.name;
                    break;
                case 'firmware':
                    value = info.deviceModel;
                    break;
                case 'battery':
                    value = info.percent;
                    break;
                case 'batterypercent':
                    value = info.percent + "%";
                    break;
                case 'chargingtxt':
                    value = info.charging;
                    break;
                case 'chargingstate':
                    value = info.charging;
                    break;
                case 'unlock':
                    value = " ";
                    break;
                case 'signal':
                    value = info.phonesignal;
                    break;
                case 'signalpercent':
                    value = signalArray[Number(info.phonesignal)];
                    break;
                case 'alarm24':
                    value = ' ';
                    break;
                case 'alarm':
                    value = ' ';
                    break;
                case 'alarmpm':
                    value = ' ';
                    break;
                case 'wifi':
                    value = info.wifi;
                    break;
                case 'wifipercent':
                    value = wifiArray[Number(info.wifi)];
                    break;
                case 'notifymail':
                    value = ' ';
                    break;
                case 'notifysms':
                    value = ' ';
                    break;
                case 'notifyphone':
                    value = ' ';
                    break;
                case 'notifywhats':
                    value = ' ';
                    break;
                case 'notifytelegram':
                    value = ' ';
                    break;
                case 'ramFree':
                    value = info.ramFree;
                    break;
                case 'ramUsed':
                    value = info.ramUsed;
                    break;
                case 'ramAvailable':
                    value = info.ramAvailable;
                    break;
                case 'ramFreeMB':
                    value = info.ramFree + "MB";
                    break;
                case 'ramUsedMB':
                    value = info.ramUsed + "MB";
                    break;
                case 'ramAvailableMB':
                    value = info.ramAvailable + "MB";
                    break;
                }
                if (div.getAttribute('data-prefix') !== null) {
                    prefix = div.getAttribute('data-prefix');
                } else {
                    prefix = '';
                }
                if (div.getAttribute('data-suffix') !== null) {
                    suffix = div.getAttribute('data-suffix');
                } else {
                    suffix = '';
                }
                div.innerHTML = prefix + value + suffix;

            }
        }
    }
});
