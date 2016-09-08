var FILENAME = "notificationController.js:";
gcalarm.controller('notificationController', ['$scope', '$rootScope', '$ionicPlatform', '$localStorage', '$cordovaLocalNotification', '$translate', 'statusService', 'settingsService', 'googleMap', 'googleEvent', 'weather', 'textToSpeech', 'bibleVerse', 'horoscope', 'quote', function ($scope, $rootScope, $ionicPlatform, $localStorage, $cordovaLocalNotification, $translate, statusService, settingsService, googleMap, googleEvent, weather, textToSpeech, bibleVerse, horoscope, quote) {
  var OBJECTNAME = "notificationController:";

  var notifications = [];

  $ionicPlatform.ready(function () {

    console.info(FILENAME + OBJECTNAME + "setting code for a broadcast of value setNotifications");
    $scope.$on("setNotifications", function () {
      $scope.setNotifications();
    });

    $scope.setNotifications = function () {
      var METHODNAME = "setNotifications:";

      var defer = $.Deferred();

      if (device.platform === "iOS") {
        $cordovaLocalNotification.promptForPermission();
      }

      navigator.plugins.alarm.cancel(
        function (response) {
          console.debug(FILENAME + OBJECTNAME + METHODNAME + "navigator.plugins.alarm.cancel" + JSON.stringify(response));
        },
        function (error) {
          console.error(FILENAME + OBJECTNAME + METHODNAME + "navigator.plugins.alarm.cancel" + JSON.stringify(error));
        }
      );
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "calling $cordovaLocalNotification.cancelAll method");
      $cordovaLocalNotification.cancelAll().then(function () {

      });

      var name = "";
      if ($localStorage["name"]) {
        name = $localStorage["name"];
      }

      var settingsWeekdayList, settingsWeekendList;

      console.info(FILENAME + OBJECTNAME  + METHODNAME + "starting to retrieve all data for notification");
      var settingsDayListData = settingsService.getDaySettings(settingsWeekdayList, settingsWeekendList);
      $.when(settingsDayListData).done(function (settingsDayList) {
        var notificationTimeData = statusService.getNotificationTime();
        $.when(notificationTimeData).done(function (notificationTime) {
          var otherSettingsBuzzWeekdayData = settingsService.getOtherSettingsBuzzWeekday();
          $.when(otherSettingsBuzzWeekdayData).done(function (otherSettingsBuzzWeekday) {
            var otherSettingsBuzzWeekendData = settingsService.getOtherSettingsBuzzWeekend();
            $.when(otherSettingsBuzzWeekendData).done(function (otherSettingsBuzzWeekend) {
              console.info(FILENAME + OBJECTNAME  + METHODNAME + "ending to retrieve all data for notification");
              var dateTime = new Date(notificationTime.weekdayNotification * 1000);
              for (var counter = 0; counter < settingsDayList.settingsWeekdayList.length; counter++) {
                var day = getFullDayName(settingsDayList.settingsWeekdayList[counter].text);

                var nextDay = setNextDay(new Date(Date.now()), day.intValue);
                nextDay.setMinutes(dateTime.getMinutes());
                nextDay.setHours(dateTime.getHours());

                var isDayOn = settingsDayList.settingsWeekdayList[counter].checked;

                if (isDayOn) {
                  var notificationId = (Math.floor(Math.random() * 1000000));
                  //var _20_sec_from_now = new Date(Date.now() + 10 + 1000);
                  console.info(FILENAME + OBJECTNAME  + METHODNAME + "calling $cordovaLocalNotification.add method");
                  $cordovaLocalNotification.add({
                    id: notificationId,
                    firstAt: nextDay,
                    message: "Hello " + name,
                    title: "Your Daily Briefing....",
                    every: "minute",
                    sound: otherSettingsBuzzWeekday ? 'file://audio/loudBuzzer.mp3' : ''
                  }).then(function () {
                    console.info(FILENAME + OBJECTNAME  + METHODNAME + "cordovaLocalNotifications set");
                    });
                }
              }
              var isDayOn = settingsDayList.settingsWeekdayList[counter].checked;
              for (var counter = 0; counter < settingsDayList.settingsWeekendList.length; counter++) {
                var day = getFullDayName(settingsDayList.settingsWeekendList[counter].text);

                var nextDay = setNextDay(new Date(Date.now()), day.intValue);
                nextDay.setMinutes(dateTime.getMinutes());
                nextDay.setHours(dateTime.getHours());

                var isDayOn = settingsDayList.settingsWeekendList[counter].checked;

                if (isDayOn) {
                  var notificationId = (Math.floor(Math.random() * 1000000));
                  var _20_sec_from_now = new Date(Date.now() + 10 + 1000);
                  console.info(FILENAME + OBJECTNAME  + METHODNAME + "calling $cordovaLocalNotification.add method");
                  $cordovaLocalNotification.add({
                    id: notificationId,
                    firstAt: _20_sec_from_now,
                    message: "Hello " + name,
                    title: "Your Daily Briefing....",
                    every: "minute",
                    sound: otherSettingsBuzzWeekend ? 'file://audio/loudBuzzer.mp3' : ''
                  }).then(function () {
                    console.info(FILENAME + OBJECTNAME  + METHODNAME + "cordovaLocalNotifications set");
                  });
                }
              }
              navigator.plugins.alarm.set(
                function (response) {
                  console.debug(FILENAME + OBJECTNAME  + METHODNAME + JSON.stringify(response));
                  console.info(FILENAME + OBJECTNAME  + METHODNAME + "navigator.plugins.alarm set");
                },
                function (errorResponse) {
                  console.error(FILENAME + OBJECTNAME  + METHODNAME + JSON.stringify(errorResponse));
                }
              );
            });
          });
        });
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "setting code for cordovaLocalNotification:click");
      $scope.$on("$cordovaLocalNotification:click", function (id, state, json) {
        var settingsWeekdayFeaturesList, settingsWeekendFeaturesList, horoscopeList;
        var settingsWeekdayFeaturesData = settingsService.getWeekdayFeatureSettings(settingsWeekdayFeaturesList);
        console.info(FILENAME + OBJECTNAME  + METHODNAME + "starting get all features");
        $.when(settingsWeekdayFeaturesData).done(function (settingsWeekdayFeatures) {
          var settingsWeekendFeaturesData = settingsService.getWeekendFeatureSettings(settingsWeekendFeaturesList);
          $.when(settingsWeekendFeaturesData).done(function (settingsWeekendFeatures) {
            var otherSettingsHoroscopeListData = settingsService.getOtherSettingsHoroscopeList(horoscopeList);
            $.when(otherSettingsHoroscopeListData).done(function (otherSettingsHoroscopeList) {
              console.info(FILENAME + OBJECTNAME  + METHODNAME + "ending get all features");
              runWeekdayNotifications(settingsWeekdayFeatures, otherSettingsHoroscopeList);
              runWeekendNotifications(settingsWeekendFeatures, otherSettingsHoroscopeList);
            });
          });
        });
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "setting code for cordovaLocalNotification:trigger");
      $scope.$on("$cordovaLocalNotification:trigger", function (id, state, json) {
        var settingsWeekdayFeaturesList, settingsWeekendFeaturesList, horoscopeList;
        console.info(FILENAME + OBJECTNAME  + METHODNAME + "starting get all features");
        var settingsWeekdayFeaturesData = settingsService.getWeekdayFeatureSettings(settingsWeekdayFeaturesList);
        $.when(settingsWeekdayFeaturesData).done(function (settingsWeekdayFeatures) {
          var settingsWeekendFeaturesData = settingsService.getWeekendFeatureSettings(settingsWeekendFeaturesList);
          $.when(settingsWeekendFeaturesData).done(function (settingsWeekendFeatures) {
            var otherSettingsHoroscopeListData = settingsService.getOtherSettingsHoroscopeList(horoscopeList);
            $.when(otherSettingsHoroscopeListData).done(function (otherSettingsHoroscopeList) {
              console.info(FILENAME + OBJECTNAME  + METHODNAME + "ending get all features");
              runWeekdayNotifications(settingsWeekdayFeatures, otherSettingsHoroscopeList);
              runWeekendNotifications(settingsWeekendFeatures, otherSettingsHoroscopeList);
            });
          });
        });
      });

      return defer.promise();
    };

    function getHoroscopeObject(horoscopeList) {
      var METHODNAME = "getHoroscopeObject:";

      console.info(FILENAME + OBJECTNAME  + METHODNAME);
      for (var i = 0; i < horoscopeList.length; i++) {
        if (horoscopeList[i].selected) {
          return horoscopeList[i];
        }
      }
    }
    function getFullDayName(day) {
      var METHODNAME = "getFullDayName:";

      console.info(FILENAME + OBJECTNAME  + METHODNAME);

      var weekdayList = [
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[1], fullName: "monday", intValue:1},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[2], fullName: "tuesday", intValue:2},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[3], fullName: "wednesday", intValue:3},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[4], fullName: "thursday", intValue:4},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[5], fullName: "friday", intValue:5},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[6], fullName: "saturday", intValue:6},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[0], fullName: "sunday", intValue:0}
      ];
      for (var i = 0; i < weekdayList.length; i++) {
        if (weekdayList[i].shortName === day) {
          return weekdayList[i];
        }
      }
    }
    function getHourandAMPM(daysTime) {
      var METHODNAME = "getHourandAMPM:";

      console.info(FILENAME + OBJECTNAME  + METHODNAME);

      var time = {hour: "", ampm: ""};
      var hour = daysTime.getHours();
      time.ampm = hour >= 12 ? 'pm' : 'am';
      if (hour > 12) {
        time.hour = hour - 12;
      }
      else {
        time.hour = hour;
      }

      console.debug(FILENAME + OBJECTNAME  + METHODNAME + JSON.stringify(time));
      return time;
    }
    function setNextDay(date, dayOfWeek) {
      var METHODNAME = "setNextDay:";

      console.info(FILENAME + OBJECTNAME  + METHODNAME);

      var date = new Date(date.getTime());
      date.setDate(date.getDate() + ((dayOfWeek + 7 - date.getDay()) % 7));

      console.debug(FILENAME + OBJECTNAME  + METHODNAME + JSON.stringify(time));
      return date;
    }

    function runWeekdayNotifications(settingsWeekdayFeatures, otherSettingsHoroscopeList) {
      var METHODNAME = "runWeekdayNotifications:";

      console.info(FILENAME + OBJECTNAME  + METHODNAME);

      var isGoogleEventsFeatureOn = settingsWeekdayFeatures[0].checked;
      var isWeatherFeatureOn = settingsWeekdayFeatures[1].checked;
      var isCommuteTimeFeatureOn = settingsWeekdayFeatures[2].checked;
      var isHoroscopeFeatureOn = settingsWeekdayFeatures[3].checked;
      var isInspirationalQuoteOn = settingsWeekdayFeatures[4].checked;
      var isBibleVerseOn = settingsWeekdayFeatures[5].checked;

      console.info(FILENAME + OBJECTNAME  + METHODNAME + "sending message Google Events");
      lsbridge.send('Google Events', {message: ''});

      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Google Events");
      lsbridge.subscribe('Google Events', function (data) {
        $scope.sayGoogleEvents('Weather', isGoogleEventsFeatureOn);
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Weather");
      lsbridge.subscribe('Weather', function (data) {
        $scope.sayWeather('Commute Time', isWeatherFeatureOn);
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Commute Time");
      lsbridge.subscribe('Commute Time', function (data) {
        $scope.sayCommuteTime('Horoscope', isCommuteTimeFeatureOn);
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Horoscope");
      lsbridge.subscribe('Horoscope', function (data) {
        var horoscopeObject = getHoroscopeObject(otherSettingsHoroscopeList);
        $scope.sayHoroscope('Inspirational Quote', horoscopeObject, isHoroscopeFeatureOn);
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Inspirational Quote");
      lsbridge.subscribe('Inspirational Quote', function (data) {
        $scope.sayInspirationalQuote('Bible Verse', isInspirationalQuoteOn);
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Bible Verse");
      lsbridge.subscribe('Bible Verse', function (data) {
        $scope.sayBibleVerse('NOMESSAGE', isBibleVerseOn);
      });
    }
    function runWeekendNotifications(settingsWeekendFeatures, otherSettingsHoroscopeList){
      var METHODNAME = "runWeekendNotifications:";

      console.info(FILENAME + OBJECTNAME  + METHODNAME);

      var isGoogleEventsFeatureOn = settingsWeekendFeatures[0].checked;
      var isWeatherFeatureOn = settingsWeekendFeatures[1].checked;
      var isCommuteTimeFeatureOn = settingsWeekendFeatures[2].checked;
      var isHoroscopeFeatureOn = settingsWeekendFeatures[3].checked;
      var isInspirationalQuoteOn = settingsWeekendFeatures[4].checked;
      var isBibleVerseOn = settingsWeekendFeatures[5].checked;

      console.info(FILENAME + OBJECTNAME  + METHODNAME + "sending message Google Events");
      lsbridge.send('Google Events', {message: ''});

      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Google Events");
      lsbridge.subscribe('Google Events', function (data) {
        $scope.sayGoogleEvents('Weather', isGoogleEventsFeatureOn);
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Weather");
      lsbridge.subscribe('Weather', function (data) {
        $scope.sayWeather('Commute Time', isWeatherFeatureOn);
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Commute Time");
      lsbridge.subscribe('Commute Time', function (data) {
        $scope.sayCommuteTime('Horoscope', isCommuteTimeFeatureOn);
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Horoscope");
      lsbridge.subscribe('Horoscope', function (data) {
        var horoscopeObject = getHoroscopeObject(otherSettingsHoroscopeList);
        $scope.sayHoroscope('Inspirational Quote', horoscopeObject, isHoroscopeFeatureOn);
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Inspirational Quote");
      lsbridge.subscribe('Inspirational Quote', function (data) {
        $scope.sayInspirationalQuote('Bible Verse', isInspirationalQuoteOn);
      });
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "subscribing to message Bible Verse");
      lsbridge.subscribe('Bible Verse', function (data) {
        $scope.sayBibleVerse('NOMESSAGE', isBibleVerseOn);
      });
    }
  });

  // Triggered on a button click, or some other target
  $scope.sayBibleVerse = function (nextFeatureCall, isFeatureOn) {
    var METHODNAME = "sayBibleVerse:";

    console.info(FILENAME + OBJECTNAME  + METHODNAME);

    if (isFeatureOn) {
      var bibleVerseData = bibleVerse.getBibleVerse();
      $.when(bibleVerseData).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME  + METHODNAME + JSON.stringify(data));
          var text = "Your bible verse for today is " + data.text + " " + data.reference;
          textToSpeech.playTextThenNextFeature(nextFeatureCall, text);
        }
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      textToSpeech.playTextThenNextFeature(nextFeatureCall, blankTTSCall);
    }
  };
  // Triggered on a button click, or some other target
  $scope.sayHoroscope = function (nextFeatureCall, horoscopeObject, isFeatureOn) {
    var METHODNAME = "sayHoroscope:";

    console.info(FILENAME + OBJECTNAME  + METHODNAME);

    if (isFeatureOn) {
      var dailyHoroscope = horoscope.getDailyHoroscope(horoscopeObject);
      $.when(dailyHoroscope).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME  + METHODNAME + data);
          var text = $translate("greeting.horoscope") + data;
          textToSpeech.playTextThenNextFeature(nextFeatureCall, text);
        }
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      textToSpeech.playTextThenNextFeature(nextFeatureCall, blankTTSCall);
    }
  };
  // Triggered on a button click, or some other target
  $scope.sayCommuteTime = function (nextFeatureCall, isFeatureOn) {
    var METHODNAME = "sayCommuteTime:";

    console.info(FILENAME + OBJECTNAME  + METHODNAME);

    if (isFeatureOn) {
      var commuteTime = googleMap.getCommuteTime();
      $.when(commuteTime).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME  + METHODNAME + data);

          var text = $translate("greeting.commuteTime") + data;
          textToSpeech.playTextThenNextFeature(nextFeatureCall, text);
        }
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      textToSpeech.playTextThenNextFeature(nextFeatureCall, blankTTSCall);
    }
  };
  // Triggered on a button click, or some other target
  $scope.sayInspirationalQuote = function (nextFeatureCall, isFeatureOn) {
    var METHODNAME = "sayInspirationalQuote:";

    console.info(FILENAME + OBJECTNAME  + METHODNAME);

    if(isFeatureOn) {
      var quoteData = quote.getInspirationalQuote();
      $.when(quoteData).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME  + METHODNAME + JSON.stringify(data));

          var text = $translate("greeting.inspirationalQuote") + data.quoteText + " by " + data.quoteAuthor;
          textToSpeech.playTextThenNextFeature(nextFeatureCall, text);
        }
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      textToSpeech.playTextThenNextFeature(nextFeatureCall, blankTTSCall);
    }
  };
  // Triggered on a button click, or some other target
  $scope.sayWeather = function (nextFeatureCall, isFeatureOn) {
    var METHODNAME = "sayWeather:";

    console.info(FILENAME + OBJECTNAME  + METHODNAME);

    if (isFeatureOn) {
      var weatherStatus = weather.getWeather();
      $.when(weatherStatus).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME  + METHODNAME + data);

          var text = $translate("greeting.weather") + data;
          textToSpeech.playTextThenNextFeature(nextFeatureCall, text);
        }
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      textToSpeech.playTextThenNextFeature(nextFeatureCall, blankTTSCall);
    }
  };
  // Triggered on a button click, or some other target
  $scope.sayGoogleEvents = function (nextFeatureCall, isFeatureOn) {
    var METHODNAME = "sayGoogleEvents:";

    console.info(FILENAME + OBJECTNAME  + METHODNAME);

    if(isFeatureOn) {
      var googleEventsText = "";
      var eventList = googleEvent.getTodaysEvents();

      $.when(eventList).done(function (data) {
        if (typeof data != "undefined") {
          var googleEventsText = $translate("greeting.googleTask");
          for (var i = 0; i < data.length; i++) {
            var event = data[i];

            var eventStartDatetime = new Date(event.start.dateTime);
            var eventEndDatetime = new Date(event.end.dateTime);

            var eventStart = eventStartDatetime.getTimeAMPMFormat().hour + " " + eventStartDatetime.getTimeAMPMFormat().minute + " " + eventStartDatetime.getTimeAMPMFormat().ampm;
            var eventEnd = eventEndDatetime.getTimeAMPMFormat().hour + " " + eventEndDatetime.getTimeAMPMFormat().minute + " " + eventEndDatetime.getTimeAMPMFormat().ampm;

            googleEventsText += event.summary + $translate("greeting.startSchedule") + eventStart + $translate("greeting.endSchedule") + eventEnd;
          }
          var text = googleEventsText;

          console.debug(FILENAME + OBJECTNAME  + METHODNAME + text);

          textToSpeech.playTextThenNextFeature(nextFeatureCall, text);
        }
      });
    }
    else{
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "send blank tts to speech call");

      var blankTTSCall = " ";
      textToSpeech.playTextThenNextFeature(nextFeatureCall, blankTTSCall);
    }
  };
}]);
