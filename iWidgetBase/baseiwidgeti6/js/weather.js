/*jslint
  node: true,
  sloppy: true,
  browser: true,
  todo: true
*/

/*global
  IS2W,
  IS2L
*/
/*
        IS2 Weather Calls
        isCelsius, isWindSpeedMph, currentLocation, currentTemperature, currentCondition, currentConditionAsString,
        naturalLanguageDescription, highForCurrentDay, lowForCurrentDay, currentWindSpeed, currentWindDirection,
        currentWindChill, currentDewPoint, currentHumidity, currentVisibilityPercent, currentChanceOfRain, currentlyFeelsLike,
        currentPressure, sunsetTime, sunriseTime, currentLatitude, currentLongitude, hourlyForecastsForCurrentLocation,
        hourlyForecastsForCurrentLocationJSON, dayForecastsForCurrentLocation, dayForecastsForCurrentLocationJSON

*/
function Weather(options) {
    var updateWeather = function () {
            IS2W('updateWeather');
            setTimeout(loadWeather, 0);
        },
        loadWeather = function () {
            var weather = {};
            weather.city = IS2W('currentLocation');
            weather.country = IS2L('countryForCurrentLocation');
            weather.lat = IS2W('currentLatitude');
            weather.long = IS2W('currentLongitude');
            weather.temp = IS2W('currentTemperature');
            weather.dew = IS2W('currentDewPoint');
            weather.feelslike = IS2W('currentlyFeelsLike');
            weather.humid = IS2W('currentHumidity');
            weather.icon = IS2W('currentCondition');
            weather.uv = IS2W('currentVisibilityPercent');
            weather.condition = IS2W('currentConditionAsString');
            weather.winddir = IS2W('currentWindDirection');
            weather.windspd = IS2W('currentWindSpeed');
            weather.high = IS2W('highForCurrentDay');
            weather.low = IS2W('lowForCurrentDay');
            weather.update = IS2W('lastUpdateTime');
            weather.sunrise = IS2W('sunriseTime');
            weather.sunset = IS2W('sunsetTime');
            weather.celsius = IS2W('isCelsius');
            options.success(weather);
            setTimeout(function () {
                updateWeather();
            }, 60000 * 10);
        };
    updateWeather();
}

Weather({
    success: function (w) {
        var weatherArray = ['temp', 'tempdeg', 'tempdegplus', 'high', 'highdeg', 'highdegplus', 'low', 'lowdeg', 'lowdegplus', 'highdashlow', 'highslashlow', 'highdashlowdeg', 'highslashlowdeg', 'city', 'condition', 'humidity', 'windchill', 'wind', 'winddirection', 'visibility', 'rain', 'dewpoint', 'feelslike', 'feelslikedeg', 'sunrise', 'sunset', 'update', 'icon', 'tempcon', 'tempcon1', 'tempcon2', 'windstr'],
            tcf = (w.celsius === true) ? 'c' : 'f',
            spd = (w.celsius === true) ? 'kph' : 'mph',
            i;
        for (i = 0; i < weatherArray.length; i += 1) {
            var div = checkDiv(weatherArray[i]);
            if (div) {
                var value;
                switch (div.id) {
                case 'tempcon':
                    value = w.temp + " " + w.condition;
                    break;
                case 'tempcon1':
                    value = w.temp + "&deg;" + tcf + " " + w.condition;
                    break;
                case 'tempcon2':
                    value = w.temp + "&deg; " + w.condition;
                    break;
                case 'windstr':
                    value = w.windspd + " " + w.winddir;
                    break;
                case 'temp':
                    value = w.temp;
                    break;
                case 'tempdeg':
                    value = w.temp + '&deg;';
                    break;
                case 'tempdegplus':
                    value = w.temp + '&deg;' + tcf;
                    break;
                case 'high':
                    value = w.high;
                    break;
                case 'highdeg':
                    value = w.high + '&deg;';
                    break;
                case 'highdegplus':
                    value = w.high + '&deg;' + tcf;
                    break;
                case 'low':
                    value = w.low;
                    break;
                case 'lowdeg':
                    value = w.low + '&deg;';
                    break;
                case 'lowdegplus':
                    value = w.low + '&deg;' + tcf;
                    break;
                case 'highdashlow':
                    value = w.high + '-' + w.low;
                    break;
                case 'highslashlow':
                    value = w.high + '/' + w.low;
                    break;
                case 'highdashlowdeg':
                    value = w.high + '&deg;-' + w.low + '&deg;';
                    break;
                case 'highslashlowdeg':
                    value = w.high + '&deg;/' + w.low + '&deg;';
                    break;
                case 'city':
                    value = w.city;
                    break;
                case 'condition':
                    value = w.condition;
                    break;
                case 'humidity':
                    value = w.humid;
                    break;
                case 'windchill':
                    value = w.feelslike + '&deg';
                    break;
                case 'wind':
                    value = w.windspd + spd;
                    break;
                case 'winddirection':
                    value = w.winddir;
                    break;
                case 'visibility':
                    value = w.uv;
                    break;
                case 'rain':
                    value = 'na';
                    break;
                case 'dewpoint':
                    value = w.uv + '&deg';
                    break;
                case 'feelslike':
                    value = w.feelslike;
                    break;
                case 'feelslikedeg':
                    value = w.feelslike + '&deg';
                    break;
                case 'sunrise':
                    value = w.sunrise
                    break;
                case 'sunset':
                    value = w.sunset;
                    break;
                case 'update':
                    value = w.update;
                    break;
                case 'icon':
                    var icon = w.icon;
                    value = icon;
                    break;
                }

                if (div.id === 'icon') {
                    if (wIcon === null) {
                        wIcon = 'simply';
                    }
                    if (document.getElementById('iconDiv').src != 'http://junesiphone.com/weather/IconSets/' + wIcon + '/' + icon + '.png') {
                        document.getElementById('iconDiv').src = 'http://junesiphone.com/weather/IconSets/' + wIcon + '/' + icon + '.png';
                    }
                } else {
                    var prefix, suffix;
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


    }
});
