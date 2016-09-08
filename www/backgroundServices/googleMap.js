var FILENAME = "googleMap.js:";

gcalarm.service('googleMap', ['$http', '$translate', 'locationService', 'googleLoginService', 'textToSpeech', function($http, $translate, locationService, googleLoginService,  textToSpeech) {
  var OBJECTNAME = "googleEvent:";

  var gcalarmdb = window.openDatabase('gcalarm', '1.0', 'GCAlarm DB', 2 * 1024 * 1024);

  var location       = {home:"",work:""};
  var avoidTolls     = true;
  var avoidHighways  = false;
  var transitOptions = "";
  var drivingOptions = "";

  this.getCommuteTime = function() {
    var METHODNAME = "getCommuteTime:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    var duration = "";
    var homeLocation = locationService.getHomeLocation();
    $.when(homeLocation).done(function (data) {
      if (typeof data != "undefined") {
        location.home = data;
        console.info(FILENAME + OBJECTNAME + METHODNAME + "home location retrieve was successfully");
      }
      var workLocation = locationService.getWorkLocation();
      $.when(workLocation).done(function (data) {
        if (typeof data != "undefined") {
          location.work = data;
          console.info(FILENAME + OBJECTNAME + METHODNAME + "work location retrieve was successfully");
        }
        if (!(location.home).isEmpty() && !(location.work).isEmpty()) {
          var durationData = getDuration();
          $.when(durationData).done(function (data) {
            if (typeof data != "undefined") {
              duration = data;
              console.debug(FILENAME + OBJECTNAME + METHODNAME + "duration:" + duration);
              defer.resolve(duration);
            }
          });
        }
        else {
          if ((location.home).isEmpty()) {
            textToSpeech.playText($translate('location.home.commuteTime.isEmpty'));
          }
          else if ((location.work).isEmpty()) {
            textToSpeech.playText($translate('location.work.commuteTime.isEmpty'));
          }
        }
      });
    });
    return defer.promise();
  };

  function getDuration() {
    var METHODNAME = "getDuration:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    var locale = "es";
    ;
    var http = $http({
      url: 'https://maps.googleapis.com/maps/api/distancematrix/json?',
      method: 'GET',
      params: {
        key: apiKey,
        departure_time: Date.now(),
        language: locale,
        traffic_model: "best_guess",
        origins: location.home,
        destinations: location.work,
        language:$translate("locale.googleApi")
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
    return defer.promise();
  }

  function getDistanceMatrixCallback(response, status) {
    var METHODNAME = "getDistanceMatrixCallback:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    if (status == google.maps.DistanceMatrixStatus.OK) {
      var results = response.rows[0].elements;
      var element = results[0];
      JSON.stringify(element);
      duration = element.duration_in_traffic.text;
      defer.resolve(duration);
    }
    else {
      if (status == google.maps.GeocoderStatus.INVALID_REQUEST)
        console.error(FILENAME + OBJECTNAME + METHODNAME + "INVALID_REQUEST");
      else if (status == google.maps.GeocoderStatus.MAX_ELEMENTS_EXCEEDED) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + "MAX_ELEMENTS_EXCEEDED");
      }
      else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + "OVER_QUERY_LIMIT");
      }
      else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + "REQUEST_DENIED");
      }
      else if (status == google.maps.GeocoderStatus.UNKNOWN_ERROR) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + "UNKNOWN_ERROR");
      }
      defer.resolve(duration);
    }
    return defer.promise();
  }

}]);
