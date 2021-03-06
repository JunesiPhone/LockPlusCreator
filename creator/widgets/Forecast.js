var div = document.createElement("div");
div.id = 'Forecast';


div.style.cssText = 'width:210px;height:80px;position:absolute;top:0;left:0;';

var fCastcount = 4;
var ddarray = ['Mon','Tue','Wed','Thu'];
var tddarray = ['25/30','40/50','60/70','40/50'];
for (var i = 0; i < fCastcount; i++) {
    var d = document.createElement('div');
        d.className = 'fCastImages';
        d.style.cssText = 'position:relative;top:-10;left:0;float:left;margin-left:10px;height:100px;width:40px;color:white;';
    var im = document.createElement('img');
        im.style.cssText = 'position:relative;top:30px;';
    var dy = document.createElement('span');
        dy.style.cssText = 'position:absolute;top:18px;text-align:center;width:100%;font-size:12px;text-transform:uppercase;';
        dy.id = 'forcastDay' + i;
    var temp = document.createElement('span');
        temp.style.cssText = 'position:absolute; bottom:18px;left:0;text-align:center;width:100%;color:white;font-size:12px;';
        temp.id = 'forcastTemp' + i;
        dy.innerHTML = ddarray[i];
        temp.innerHTML = tddarray[i];
        im.id = 'forcastIcon' + i;
        im.src="http://junesiphone.com/weather/IconSets/flt/"+ (30 + i) + ".png";
        im.width = '40';
        d.appendChild(dy);
        d.appendChild(im);
        d.appendChild(temp);
        div.appendChild(d);
}

document.getElementById('screenElements').appendChild(div);

function cvtFs(temp){
    return (temp == "--") ? temp : Math.round(temp * 1.8 + 32);
}

function loadWeatherDetails(){
    for (var i = 0; i < fCastcount; i++) {
        var icon = cycript.getWeather().dayForecasts[i].icon;
        var dlow = cvtFs(cycript.getWeather().dayForecasts[i].low);
        var dhigh = cvtFs(cycript.getWeather().dayForecasts[i].high);
        var dofw = cycript.getWeather().dayForecasts[i].dayOfWeek - 1;
            if(icon == '3200'){
                icon = cycript.getWeather().conditionCode;
            }
        document.getElementById('forcastIcon' + i).src = 'http://junesiphone.com/weather/IconSets/flt/' + icon + '.png';
        document.getElementById('forcastDay' + i).innerHTML = translate[options.languages].sday[dofw];
        document.getElementById('forcastTemp' + i).innerHTML = dhigh + '/' + dlow;
    }
    setTimeout(loadWeatherDetails, 10000);
}

loadWeatherDetails();
