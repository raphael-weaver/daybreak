var FILENAME = "notificationService.js:";
gcalarm.service('notificationService',['$http', '$translate', '$q', 'bibleVerse', 'horoscope', 'quote', 'googleMap', 'weather', 'googleEvent', function($http, $translate, $q, bibleVerse, horoscope, quote, googleMap, weather, googleEvent) {
  var OBJECTNAME = "notificationService:";


// Triggered on a button click, or some other target
  this.sayBibleVerse = function (isFeatureOn) {
    var METHODNAME = "sayBibleVerse:";
    var deferred = $q.defer();

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    if (isFeatureOn) {
      var bibleVerseData = bibleVerse.getBibleVerse();
      $.when(bibleVerseData).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(data));

          var text = $translate.instant("greeting.bibleVerse") + data.text + " " + data.reference;
          deferred.resolve(text);
        }
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      deferred.resolve(blankTTSCall);
    }
    return deferred.promise;
  };
// Triggered on a button click, or some other target
  this.sayHoroscope = function (horoscopeObject, isFeatureOn) {
    var METHODNAME = "sayHoroscope:";
    var deferred = $q.defer();

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    if (isFeatureOn && horoscopeObject != false) {
      var dailyHoroscope = horoscope.getDailyHoroscope(horoscopeObject);
      $.when(dailyHoroscope).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME + METHODNAME + data);
          var text = $translate.instant("greeting.horoscope") + data;
          deferred.resolve(text);
        }
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      deferred.resolve(blankTTSCall);
    }
    return deferred.promise;
  };
// Triggered on a button click, or some other target
  this.sayCommuteTime = function (isFeatureOn) {
    var METHODNAME = "sayCommuteTime:";
    var deferred = $q.defer();

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    if (isFeatureOn) {
      var commuteTime = googleMap.getCommuteTime();
      $.when(commuteTime).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(data));

          var text = $translate.instant("greeting.commuteTime") + data;
          deferred.resolve(text);
        }
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      deferred.resolve(blankTTSCall);
    }
    return deferred.promise;
  };
// Triggered on a button click, or some other targetS
  this.sayInspirationalQuote = function (isFeatureOn) {
    var METHODNAME = "sayInspirationalQuote:";
    var deferred = $q.defer();

    console.info(FILENAME + OBJECTNAME + METHODNAME);
    if (isFeatureOn) {
      var quoteData = quote.getInspirationalQuote();

      $.when(quoteData).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(data));

          var text = $translate.instant("greeting.inspirationalQuote") + data.quoteText + " by " + data.quoteAuthor;
          deferred.resolve(text);
        }
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      deferred.resolve(blankTTSCall);
    }
    return deferred.promise;
  };
// Triggered on a button click, or some other target
  this.sayWeather = function (isFeatureOn) {
    var METHODNAME = "sayWeather:";
    var deferred = $q.defer();

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    if (isFeatureOn) {
      var weatherStatus = weather.getWeather();
      $.when(weatherStatus).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME + METHODNAME + data);

          var text = $translate.instant("greeting.weather") + data;
          deferred.resolve(text);
        }
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      deferred.resolve(blankTTSCall);
    }
    return deferred.promise;
  };
// Triggered on a button click, or some other target
  this.sayGoogleEvents = function (isFeatureOn) {
    var METHODNAME = "sayGoogleEvents:";
    var deferred = $q.defer();

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    if (isFeatureOn) {
      var googleEventsText = "";
      var eventList = googleEvent.getTodaysEvents();

      $.when(eventList).done(function (data) {
        if (typeof data != "undefined") {
          var googleEventsText = $translate.instant("greeting.googleTask");
          for (var i = 0; i < data.length; i++) {
            var event = data[i];

            var eventStartDatetime = new Date(event.start.dateTime);
            var eventEndDatetime = new Date(event.end.dateTime);

            var eventStart = eventStartDatetime.getTimeAMPMFormat().hour + " " + eventStartDatetime.getTimeAMPMFormat().minute + " " + eventStartDatetime.getTimeAMPMFormat().ampm;
            var eventEnd = eventEndDatetime.getTimeAMPMFormat().hour + " " + eventEndDatetime.getTimeAMPMFormat().minute + " " + eventEndDatetime.getTimeAMPMFormat().ampm;
            if(i+1 < data.length) {
              googleEventsText += event.summary + $translate.instant("googleTask.startSchedule") + eventStart + $translate.instant("googleTask.endSchedule") + eventEnd + $translate.instant("googleTask.nextTask");
            }
            else {
              googleEventsText += event.summary + $translate.instant("googleTask.startSchedule") + eventStart + $translate.instant("googleTask.endSchedule") + eventEnd;
            }
          }
          deferred.resolve(googleEventsText);

          console.debug(FILENAME + OBJECTNAME + METHODNAME + text);

        }
        else {
          console.info(FILENAME + OBJECTNAME + METHODNAME + "send blank tts to speech call");

          var blankTTSCall = " ";
          deferred.resolve(blankTTSCall);
        }
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      deferred.resolve(blankTTSCall);
    }
    return deferred.promise;
  };
}]);
