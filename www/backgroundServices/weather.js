var FILENAME = "weather.js:";
gcalarm.service('weather', ['$http', '$q', '$translate', 'locationService', 'localization', 'textToSpeech', function ($http, $q, $translate, locationService, localization, textToSpeech) {
  var OBJECTNAME = "weather:";

  var homeLocationLatLong = {latitude: "", longitude: ""};
  var weather;

  this.getWeatherByDate = function (date) {
    var METHODNAME = "getWeatherByDate:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    var weatherStatus = getWeatherByDate(date);
    $.when(weatherStatus).done(function (data) {
      if (typeof data != "undefined") {
        console.info(FILENAME + OBJECTNAME + METHODNAME + "retrieved weather data successfully");
        weather = data;
        defer.resolve(weather);
      }
    });
    return defer.promise();
  };

  this.getWeather = function () {
    var METHODNAME = "getWeather:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    var weatherStatus = getWeatherByDate(new Date(Date.now()));
    $.when(weatherStatus).done(function (data) {
      if (typeof data != "undefined") {
        console.info(FILENAME + OBJECTNAME + METHODNAME + "retrieved weather data successfully");
        weather = data;
        defer.resolve(weather);
      }
    });
    return defer.promise();
  };

  function getWeatherByDate(date) {
    var METHODNAME = "getWeatherByDate:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    var minDateTime = new Date(date);
    minDateTime.setHours(0);
    minDateTime.setMinutes(0);
    minDateTime.setSeconds(0);

    var maxDateTime = new Date(date);
    maxDateTime.setHours(23);
    maxDateTime.setMinutes(59);
    maxDateTime.setSeconds(59);

    var homeLatLong = locationService.getHomeLatLongCoordinates();
    $.when(homeLatLong).done(function(data) {
      if(typeof data != "undefined") {
        homeLocationLatLong = data;
        console.info(FILENAME + OBJECTNAME + METHODNAME + "minimum and maximum time for today's event set");

        var promise = localization.isLocaleEnglish();
        promise.then(function (isLocaleEnglish) {
          if (!isLocaleEnglish) {
            var weatherSummary = callLocaleWeatherApi(homeLocationLatLong);
          }
          else {
            var weatherSummary = callWeatherApi(homeLocationLatLong);
          }
          $.when(weatherSummary).done(function (data) {
            if (typeof data != "undefined") {
              weatherSummary = data;
              defer.resolve(weatherSummary);
            }
          });
        });
      }
    });

    return defer.promise();
  }

  function callWeatherApi(homeLocationLatLongParam) {
    var METHODNAME = "callWeatherApi:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    var http = $http({
      url: "http://forecast.weather.gov/MapClick.php",
      method: 'GET',
      params: {
        lat: homeLocationLatLongParam.latitude,
        lon: homeLocationLatLongParam.longitude,
        FcstType: "json"
      }
    });
    http.then(function (data) {
      console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(data));

      defer.resolve(data.data.data.text[0]);
    }, function errorCallback(errorResponse) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(errorResponse));
    });

    return defer.promise();
  }

  function callLocaleWeatherApi(homeLocationLatLongParam) {
    var METHODNAME = "callLocaleWeatherApi:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    var wundergroundApiKey = "a0bd0ef3222acea4";
    var url = "http://api.wunderground.com/api/" + wundergroundApiKey + "/forecast/lang:" + $translate.instant("locale.weather") + "/q/" + homeLocationLatLongParam.latitude + "," + homeLocationLatLongParam.longitude + ".json?";

    var http = $http({
      url: url,
      method: 'GET'
    });
    http.then(function (data) {
      console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(data));

      var forecast = data.data.forecast.txt_forecast;

      console.info(FILENAME + OBJECTNAME + METHODNAME + "getting specific forecast data from json string return");

      var weatherForecast = forecast.forecastday[0].fcttext + " " + " Tonight " + forecast.forecastday[1].fcttext;
      defer.resolve(weatherForecast);
    }, function errorCallback(errorResponse) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(errorResponse));
    });

    return defer.promise();
  }


}]);
