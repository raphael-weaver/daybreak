var FILENAME = "googleMap.js:";

gcalarm.service('googleMap', ['$http', '$translate', 'locationService', 'googleLoginService', 'textToSpeech', function ($http, $translate, locationService, googleLoginService, textToSpeech) {
  var OBJECTNAME = "googleEvent:";

  var gcalarmdb = window.openDatabase('gcalarm', '1.0', 'GCAlarm DB', 2 * 1024 * 1024);

  var location = {home: "", work: ""};
  var avoidTolls = true;
  var avoidHighways = false;
  var transitOptions = "";
  var drivingOptions = "";

  this.getCommuteTime = function () {
    var METHODNAME = "getCommuteTime:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    var duration = "";
    var durationData = getDuration();
    $.when(durationData).done(function (data) {
      if (typeof data != "undefined") {
        duration = data;
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "duration:" + duration);
        defer.resolve(duration);
      }
    });

    return defer.promise();
  };

  function getDuration() {
    var METHODNAME = "getDuration:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    var homeLocation = locationService.getHomeLocation();
    $.when(homeLocation).done(function (data) {
      if (typeof data != "undefined") {
        console.info(FILENAME + OBJECTNAME);
        console.debug(FILENAME + OBJECTNAME + JSON.stringify(data));

        location.home = data;


        var workLocation = locationService.getWorkLocation();
        $.when(workLocation).done(function (data) {
          if (typeof data != "undefined") {
            console.info(FILENAME + OBJECTNAME);
            console.debug(FILENAME + OBJECTNAME + JSON.stringify(data));

            location.work = data;

            var http = $http({
              url: 'https://maps.googleapis.com/maps/api/distancematrix/json?',
              method: 'GET',
              params: {
                key: apiKey,
                departure_time: Date.now(),
                traffic_model: "best_guess",
                origins: location.home,
                destinations: location.work,
                language: $translate.instant("locale.googleApi")
              }
            });
            http.then(function (data) {

              var results = data.data.rows[0].elements;
              var element = results[0];
              duration = element.duration_in_traffic.text;

              console.debug(FILENAME + OBJECTNAME + METHODNAME + "element:" + JSON.stringify(duration));

              defer.resolve(duration);
            }, function errorCallback(errorResponse) {

              console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(errorResponse));
            });
          }
        });
      }
    });
    return defer.promise();
  }
}]);
