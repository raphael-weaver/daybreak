var FILENAME = "notificationController.js:";
gcalarm.controller('notificationController', ['$scope', '$q', '$rootScope', '$ionicPlatform', '$localStorage', '$cordovaLocalNotification', '$translate', '$locale', 'statusService', 'settingsService', 'googleMap', 'googleEvent', 'weather', 'textToSpeech', 'bibleVerse', 'horoscope', 'quote', 'notificationService', 'Constants', function ($scope, $q, $rootScope, $ionicPlatform, $localStorage, $cordovaLocalNotification, $translate, $locale, statusService, settingsService, googleMap, googleEvent, weather, textToSpeech, bibleVerse, horoscope, quote, notificationService, Constants) {
  var OBJECTNAME = "notificationController:";

  var notifications = [];
  $scope.notifications = "";

  $ionicPlatform.ready(function () {

    console.info(FILENAME + OBJECTNAME + "setting code for a broadcast of value setNotifications");
    $scope.$on("setNotifications", function () {
      $scope.setNotifications();
    });

    $scope.$on("notificationPlayManager", function (event, notificationData) {
      var METHODNAME = "notificationPlayManager:receive";
      var settingsWeekdayFeaturesList, settingsWeekendFeaturesList, horoscopeList;

      console.info(FILENAME + OBJECTNAME + METHODNAME + "starting get all features");

      var settingsWeekdayFeaturesData = settingsService.getWeekdayFeatureSettings(settingsWeekdayFeaturesList);
      $.when(settingsWeekdayFeaturesData).done(function (settingsWeekdayFeatures) {
        var settingsWeekendFeaturesData = settingsService.getWeekendFeatureSettings(settingsWeekendFeaturesList);
        $.when(settingsWeekendFeaturesData).done(function (settingsWeekendFeatures) {
          var otherSettingsHoroscopeListData = settingsService.getOtherSettingsHoroscopeList(horoscopeList);
          $.when(otherSettingsHoroscopeListData).done(function (otherSettingsHoroscopeList) {

            if (notificationData.notificationState === Constants.notificationState.STOP) {//create enuumeration for different state and functionality
              $localStorage["isStopped"] = true;
              cordova.plugins.notification.local.clearAll(function () {
              }, this);
            }
            else if (notificationData.notificationState === Constants.notificationState.SNOOZE) {

              var snoozeDelay = settingsService.getSnoozeDelayTime();
              $.when(snoozeDelay).done(function (snoozeDelayMinutes) {
                console.debug(FILENAME + OBJECTNAME + "nextSnoozeTime=" + JSON.stringify(snoozeDelayMinutes));

                var snoozeDelayMillSecs = (60000 * snoozeDelayMinutes);

                setTimeout(function () {
                    $rootScope.$broadcast("notificationPlayManager", {
                      "notificationState":Constants.notificationState.TRIGGERED
                    });
                }, snoozeDelayMillSecs);
              });
            }
            else if (notificationData.notificationState === Constants.notificationState.TRIGGERED) {
              $localStorage["isStopped"] = false;

              var today = new Date(Date.now());
              var isWeekdayNotification = isWeekday(today);
              if (isWeekdayNotification) {
                var promise = runWeekdayNotifications(settingsWeekdayFeatures, otherSettingsHoroscopeList);
                promise.then(function (data) {
                  $rootScope.$broadcast("notificationPlayManager", {
                    "notificationState":Constants.notificationState.ACTIVE
                  });
                });
              }
              else {
                var promise = runWeekendNotifications(settingsWeekendFeatures, otherSettingsHoroscopeList);
                promise.then(function (data) {
                  $rootScope.$broadcast("notificationPlayManager", {
                    "notificationState":Constants.notificationState.ACTIVE
                  });
                });
              }
            }
            else if (notificationData.notificationState === Constants.notificationState.ACTIVE) {
              var oneMinuteInMillSecs = 60000;

              setTimeout(function () {
                var today = new Date(Date.now());
                var isWeekdayNotification = isWeekday(today);
                if (isWeekdayNotification) {
                  if(!$localStorage["isStopped"]) {
                    var promise = runWeekdayNotifications(settingsWeekdayFeatures, otherSettingsHoroscopeList);
                    promise.then(function (data) {
                      $rootScope.$broadcast("notificationPlayManager", {
                        "notificationState":Constants.notificationState.ACTIVE
                      });
                    });
                  }
                }
                else {
                  if(!$localStorage["isStopped"]) {
                    var promise = runWeekendNotifications(settingsWeekendFeatures, otherSettingsHoroscopeList);
                    promise.then(function (data) {
                      $rootScope.$broadcast("notificationPlayManager", {
                        "notificationState":Constants.notificationState.ACTIVE
                      });
                    });
                  }
                }
              }, oneMinuteInMillSecs);
            }
          });
        });
      });
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
      console.info(FILENAME + OBJECTNAME + METHODNAME + "calling $cordovaLocalNotification.clearAll method");

      cordova.plugins.notification.local.cancelAll(function() {
      }, this);

      var name = "";
      if ($localStorage["name"]) {
        name = $localStorage["name"];
      }

      var settingsWeekdayList, settingsWeekendList;
      console.info(FILENAME + OBJECTNAME + METHODNAME + "starting to retrieve all data for notification");
      var settingsDayListData = settingsService.getDaySettings(settingsWeekdayList, settingsWeekendList);
      $.when(settingsDayListData).done(function (settingsDayList) {
        var weekdayNotificationTimeData = statusService.getWeekdayNotificationTime();
        $.when(weekdayNotificationTimeData).done(function (weekdayNotificationTime) {
          var weekendNotificationTimeData = statusService.getWeekendNotificationTime();
          $.when(weekendNotificationTimeData).done(function (weekendNotificationTime) {
            var otherSettingsBuzzWeekdayData = settingsService.getOtherSettingsBuzzWeekday();
            $.when(otherSettingsBuzzWeekdayData).done(function (otherSettingsBuzzWeekday) {
              var otherSettingsBuzzWeekendData = settingsService.getOtherSettingsBuzzWeekend();
              $.when(otherSettingsBuzzWeekendData).done(function (otherSettingsBuzzWeekend) {
                console.info(FILENAME + OBJECTNAME + METHODNAME + "ending to retrieve all data for notification");
                var dateTime = new Date(Date.now());
                var selectedTime = new Date(weekdayNotificationTime * 1000);
                dateTime.setMinutes(selectedTime.getMinutes());
                dateTime.setHours(selectedTime.getHours());

                for (var counter = 0; counter < settingsDayList.settingsWeekdayList.length; counter++) {
                  var day = getFullDayName(settingsDayList.settingsWeekdayList[counter].text);

                  var nextDay = setNextDay(new Date(Date.now()), day.intValue);
                  nextDay.setMinutes(dateTime.getMinutes());
                  nextDay.setHours(dateTime.getHours());

                  var isDayOn = settingsDayList.settingsWeekdayList[counter].checked;
                  if (isDayOn) {
                    console.info(FILENAME + OBJECTNAME + METHODNAME + "calling $cordovaLocalNotification.add method");

                    $cordovaLocalNotification.add({
                      id: day.intValue,
                      firstAt: nextDay,
                      message: $translate.instant("hello") + name,
                      title: $translate.instant("daybreak.notification.text"),
                      every: "week",
                      sound: otherSettingsBuzzWeekday ? 'file://audio/loudBuzzer.mp3' : ''
                    }).then(function () {
                      console.info(FILENAME + OBJECTNAME + METHODNAME + "cordovaLocalNotifications set");
                    });
                  }
                }
                dateTime = new Date(weekendNotificationTime * 1000);
                for (var counter = 0; counter < settingsDayList.settingsWeekendList.length; counter++) {
                  var day = getFullDayName(settingsDayList.settingsWeekendList[counter].text);

                  var nextDay = setNextDay(new Date(Date.now()), day.intValue);
                  nextDay.setMinutes(dateTime.getMinutes());
                  nextDay.setHours(dateTime.getHours());

                  var isDayOn = settingsDayList.settingsWeekendList[counter].checked;
                  if (isDayOn) {

                    console.info(FILENAME + OBJECTNAME + METHODNAME + "calling $cordovaLocalNotification.add method");
                    $cordovaLocalNotification.add({
                      id: day.intValue,
                      firstAt: nextDay,
                      message: $translate.instant("hello") + name,
                      title: $translate.instant("daybreak.notification.text"),
                      every: "week",
                      sound: otherSettingsBuzzWeekend ? 'file://audio/loudBuzzer.mp3' : ''
                    }).then(function () {
                      console.info(FILENAME + OBJECTNAME + METHODNAME + "cordovaLocalNotifications set");
                    });
                  }
                }
                navigator.plugins.alarm.set(
                  function (response) {
                    console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(response));
                    console.info(FILENAME + OBJECTNAME + METHODNAME + "navigator.plugins.alarm set");
                  },
                  function (errorResponse) {
                    console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(errorResponse));
                  }
                );
              });
            });
          });
        });
      });
      console.info(FILENAME + OBJECTNAME + METHODNAME + "setting code for cordovaLocalNotification:click");
      $rootScope.$on("$cordovaLocalNotification:click", function (id, state, json) {
        notificationTriggeredActions();
      });
      console.info(FILENAME + OBJECTNAME + METHODNAME + "setting code for cordovaLocalNotification:trigger");
      $rootScope.$on("$cordovaLocalNotification:trigger", function (id, state, json) {
        notificationTriggeredActions();
      });

      navigator.plugins.alarm.cancel(
        function (response) {
          console.debug(FILENAME + OBJECTNAME + METHODNAME + "navigator.plugins.alarm.cancel" + JSON.stringify(response));
        },
        function (error) {
          console.error(FILENAME + OBJECTNAME + METHODNAME + "navigator.plugins.alarm.cancel" + JSON.stringify(error));
        }
      );
      navigator.plugins.alarm.set(
        function (response) {
          console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(response));
          console.info(FILENAME + OBJECTNAME + METHODNAME + "navigator.plugins.alarm set");
        },
        function (errorResponse) {
          console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(errorResponse));
        }
      );
      textToSpeech.playBlankText();
      return defer.promise();
    };

    function notificationTriggeredActions() {
      var METHODNAME = "notificationTriggeredActions:";

      var name = "";
      if ($localStorage["name"]) {
        name = $localStorage["name"];
      }

      var buzzSettings;

      var today = new Date(Date.now());
      var isWeekdayNotification = isWeekday(today);
      var otherSettingsBuzzWeekdayData = settingsService.getOtherSettingsBuzzWeekday();
      $.when(otherSettingsBuzzWeekdayData).done(function (otherSettingsBuzzWeekday) {
        var otherSettingsBuzzWeekendData = settingsService.getOtherSettingsBuzzWeekend();
        $.when(otherSettingsBuzzWeekendData).done(function (otherSettingsBuzzWeekend) {
          if (isWeekdayNotification) {
            buzzSettings = otherSettingsBuzzWeekday;
          }
          else {
            buzzSettings = otherSettingsBuzzWeekend;
          }
          console.info(FILENAME + OBJECTNAME + METHODNAME + "ending get all features");

          var delayTime;
          if (buzzSettings) {
            delayTime = 2000;
          }
          else {
            delayTime = 0;
          }

          setTimeout(function () {
            $rootScope.$broadcast("notificationPlayManager", {
              "notificationState": Constants.notificationState.TRIGGERED
            });
          }, delayTime);

        });
      });
    };

    function getHoroscopeObject(horoscopeList) {
      var METHODNAME = "getHoroscopeObject:";
      var deferred = $q.defer();

      var horoscopeValueFound = false;
      console.info(FILENAME + OBJECTNAME + METHODNAME);
      for (var i = 0; i < horoscopeList.length; i++) {
        if (horoscopeList[i].selected) {
          horoscopeValueFound = true;
          deferred.resolve(horoscopeList[i]);
        }
      }
      if(!horoscopeValueFound) {
        deferred.resolve(horoscopeValueFound);
      }
      return deferred.promise;
    }

    function getFullDayName(day) {
      var METHODNAME = "getFullDayName:";

      console.info(FILENAME + OBJECTNAME + METHODNAME);

      var weekdayList = [
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[1].toString().toLowerCase(), fullName: "monday", intValue: 1},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[2].toString().toLowerCase(), fullName: "tuesday", intValue: 2},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[3].toString().toLowerCase(), fullName: "wednesday", intValue: 3},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[4].toString().toLowerCase(), fullName: "thursday", intValue: 4},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[5].toString().toLowerCase(), fullName: "friday", intValue: 5},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[6].toString().toLowerCase(), fullName: "saturday", intValue: 6},
        {shortName: $locale.DATETIME_FORMATS.SHORTDAY[0].toString().toLowerCase(), fullName: "sunday", intValue: 0}
      ];
      for (var i = 0; i < weekdayList.length; i++) {
        if (weekdayList[i].shortName === day) {
          return weekdayList[i];
        }
      }
    }

    function getHourandAMPM(daysTime) {
      var METHODNAME = "getHourandAMPM:";

      console.info(FILENAME + OBJECTNAME + METHODNAME);

      var time = {hour: "", ampm: ""};
      var hour = daysTime.getHours();
      time.ampm = hour >= 12 ? 'pm' : 'am';
      if (hour > 12) {
        time.hour = hour - 12;
      }
      else {
        time.hour = hour;
      }

      console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(time));
      return time;
    }

    function setNextDay(date, dayOfWeek) {
      var METHODNAME = "setNextDay:";

      console.info(FILENAME + OBJECTNAME + METHODNAME);

      var date = new Date(date);
      date.setDate(date.getDate() + ((dayOfWeek + 7 - date.getDay()) % 7));

      console.debug(FILENAME + OBJECTNAME + METHODNAME + "nextDay" + date.toString());
      return date;
    }

    function runWeekdayNotifications(settingsWeekdayFeatures, otherSettingsHoroscopeList) {
      var METHODNAME = "runWeekdayNotifications:";
      var deferred = $q.defer();

      console.info(FILENAME + OBJECTNAME + METHODNAME);

      var isGoogleEventsFeatureOn = settingsWeekdayFeatures[0].checked;
      var isWeatherFeatureOn = settingsWeekdayFeatures[1].checked;
      var isCommuteTimeFeatureOn = settingsWeekdayFeatures[2].checked;
      var isHoroscopeFeatureOn = settingsWeekdayFeatures[3].checked;
      var isInspirationalQuoteOn = settingsWeekdayFeatures[4].checked;
      var isBibleVerseOn = settingsWeekdayFeatures[5].checked;

      var notificationData = "";
      var promise = notificationService.sayGoogleEvents(isGoogleEventsFeatureOn);
      promise.then(function (data) {
        notificationData += data;
        promise = notificationService.sayWeather(isWeatherFeatureOn);
        promise.then(function (data) {
          notificationData += data;
          promise = notificationService.sayCommuteTime(isCommuteTimeFeatureOn);
          promise.then(function (data) {
            notificationData += data;
            promise = getHoroscopeObject(otherSettingsHoroscopeList);
            promise.then(function (horoscopeObject) {
              promise = notificationService.sayHoroscope(horoscopeObject, isHoroscopeFeatureOn);
              promise.then(function (data) {
                notificationData += data;
                promise = notificationService.sayInspirationalQuote(isInspirationalQuoteOn);
                promise.then(function (data) {
                  notificationData += data;
                  promise = notificationService.sayBibleVerse(isBibleVerseOn);
                  promise.then(function (data) {
                    notificationData += data;
                    textToSpeech.playText(notificationData);
                    deferred.resolve(true);
                  }, function (reason) {
                    console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
                  });
                }, function (reason) {
                  console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
                });
              }, function (reason) {
                console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
              });
            }, function (reason) {
              console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
            });
          }, function (reason) {
            console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
          });
        }, function (reason) {
          console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
        });
      }, function (reason) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
      });
      textToSpeech.playBlankText();
      return deferred.promise;
    }

    function runWeekendNotifications(settingsWeekendFeatures, otherSettingsHoroscopeList) {
      var METHODNAME = "runWeekendNotifications:";
      var deferred = $q.defer();

      console.info(FILENAME + OBJECTNAME + METHODNAME);

      var isGoogleEventsFeatureOn = settingsWeekendFeatures[0].checked;
      var isWeatherFeatureOn = settingsWeekendFeatures[1].checked;
      var isCommuteTimeFeatureOn = settingsWeekendFeatures[2].checked;
      var isHoroscopeFeatureOn = settingsWeekendFeatures[3].checked;
      var isInspirationalQuoteOn = settingsWeekendFeatures[4].checked;
      var isBibleVerseOn = settingsWeekendFeatures[5].checked;

      var notificationData = "";
      var promise = notificationService.sayGoogleEvents(isGoogleEventsFeatureOn);
      promise.then(function (data) {
        notificationData += data;
        promise = notificationService.sayWeather(isWeatherFeatureOn);
        promise.then(function (data) {
          notificationData += data;
          promise = notificationService.sayCommuteTime(isCommuteTimeFeatureOn);
          promise.then(function (data) {
            notificationData += data;
            promise = getHoroscopeObject(otherSettingsHoroscopeList);
            promise.then(function (horoscopeObject) {
              promise = notificationService.sayHoroscope(horoscopeObject, isHoroscopeFeatureOn);
              promise.then(function (data) {
                notificationData += data;
                promise = notificationService.sayInspirationalQuote(isInspirationalQuoteOn);
                promise.then(function (data) {
                  notificationData += data;
                  promise = notificationService.sayBibleVerse(isBibleVerseOn);
                  promise.then(function (data) {
                    notificationData += data;
                    textToSpeech.playText(notificationData);
                    deferred.resolve(true);
                  }, function (reason) {
                    console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
                  });
                }, function (reason) {
                  console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
                });
              }, function (reason) {
                console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
              });
            }, function (reason) {
              console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
            });
          }, function (reason) {
            console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
          });
        }, function (reason) {
          console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
        });
      }, function (reason) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + reason);
      });
      textToSpeech.playBlankText();
      return deferred.promise;
    }
  });

  function isWeekday(day) {
    var METHODNAME = "isWeekday:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var weekdayList = [1, 2, 3, 4, 5];

    return ($.inArray(day.getDay(), weekdayList)) > -1;
  }

  function isWeekend(day) {
    var METHODNAME = "isWeekend:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var weekendList = [0, 6];
    return ($.inArray(day.getDay(), weekendList)) > -1;
  }
}]);
