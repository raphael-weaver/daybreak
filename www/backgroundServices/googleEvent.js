var FILENAME = "googleEvent.js:";
gcalarm.service('googleEvent',['$http', '$translate', 'googleLoginService', function($http, $translate, googleLoginService) {
  var OBJECTNAME = "googleEvent:";

  var eventList = "";
  var timeRange = {minDateTime:new Date(),maxDateTime:new Date()};
  var googleData = "";

  this.getTodaysEvents = function() {
    var METHODNAME = "getTodaysEvents:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    var minDateTime = new Date();
    minDateTime.setHours(0);
    minDateTime.setMinutes(0);
    minDateTime.setSeconds(0);

    var maxDateTime = new Date();
    maxDateTime.setHours(23);
    maxDateTime.setMinutes(59);
    maxDateTime.setSeconds(59);

    timeRange.minDateTime = minDateTime;
    timeRange.maxDateTime = maxDateTime;

    console.info(FILENAME + OBJECTNAME + METHODNAME + "minimum and maximum time for today's event set");

    eventList = this.getEventList(timeRange);
    $.when(eventList).done(function(data) {
      if(typeof data != "undefined"){
        console.debug(FILENAME + OBJECTNAME + METHODNAME + data);

        defer.resolve(data);
      }
    });
    return defer.promise();
  };

  this.getEvents = function(date) {
    var METHODNAME = "getEvents:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    minDateTime.setMinutes(0);
    minDateTime.setSeconds(0);

    var maxDateTime = date;
    maxDateTime.setHours(23);
    maxDateTime.setMinutes(59);
    maxDateTime.setSeconds(59);

    timeRange.minDateTime = minDateTime;
    timeRange.maxDateTime = maxDateTime;

    console.info(FILENAME + OBJECTNAME + METHODNAME + "minimum and maximum time for today's event set");
    console.info(FILENAME + OBJECTNAME + METHODNAME + "minimum time:" + minDateTime + "and maximum time:" + maxDateTime);

    eventList = this.getEventList(timeRange);
    $.when(eventList).done(function(data) {
      if(typeof data != "undefined"){
        console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(data));

        defer.resolve(data);
      }
    });
    return defer.promise();
  };

  this.getEventList = function (timeRange) {
    var METHODNAME = "getEventList:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    var promise = googleLoginService.authorize();
    promise.then(function (data) {
      googleData = data;
      var http = $http({
        url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        method: 'GET',
        params: {
          access_token: googleData.accessToken,
          key: googleData.apiKey,
          timeMin:timeRange.minDateTime,
          timeMax:timeRange.maxDateTime,
          language:$translate("locale.googleApi")
        }
      });
      http.then(function (data) {
        var eventListData = data.data.items;
        console.debug(FILENAME + OBJECTNAME + METHODNAME + " event data " + JSON.stringify(eventListData));
        defer.resolve(eventListData);
      }, function errorCallback(errorResponse) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(errorResponse));
      });
    }, function (data) {
      googleData = data;
    });
    return defer.promise();
  };

}]);
