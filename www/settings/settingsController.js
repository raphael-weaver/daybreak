var FILENAME = "settingsController.js:";
gcalarm.controller('settingsController', ['$scope', '$rootScope', '$localStorage', '$ionicPlatform', '$ionicPopover', 'settingsService', 'statusService', 'textToSpeech', 'locationService', 'googleLoginService', '$ionicModal', '$timeout', '$ionicPopup', '$translate', 'Constants', function ($scope, $rootScope, $localStorage, $ionicPlatform, $ionicPopover, settingsService, statusService, textToSpeech, locationService, googleLoginService, $ionicModal, $timeout, $ionicPopup, $translate, Constants) {
  var OBJECTNAME = "settingsController:";

  setupFeatures();

  function setupFeatures() {

    $scope.weatherFeatures = [$translate.instant("feature.weather")];
    $scope.weatherFeaturesFilter = function(item) {
      return ($scope.weatherFeatures.indexOf(item.text) !== -1);
    };

    $scope.googleFeatures = [$translate.instant("feature.googleTasks"), $translate.instant("feature.commuteTime")];
    $scope.googleFeaturesFilter = function(item) {
      return ($scope.googleFeatures.indexOf(item.text) !== -1);
    };

    $scope.horoBiblInspFeatures = [$translate.instant("feature.horoscope"), $translate.instant("feature.inspirationalQuote"), $translate.instant("feature.bibleVerse")];
    $scope.horoBiblInspFeaturesFilter = function(item) {
      return ($scope.horoBiblInspFeatures.indexOf(item.text) !== -1);
    };

  };

  $ionicPlatform.ready(function () {
      console.info(FILENAME + OBJECTNAME + "ionic platform is ready");

      $scope.horoscopeSelected = "";

      $scope.setHoroscopeSign = function (horoscopeItem) {
        var METHODNAME = "setHoroscopeSign:";
        console.info(FILENAME + OBJECTNAME + METHODNAME);

        $scope.closePopover();
        $localStorage["horoscopeSelected"] = horoscopeItem.sign;
      }

      $scope.checkFeatureRequirement = function (feature) {
        if (feature.checked && feature.text == $translate.instant("feature.googleTasks")) {
          checkGoogleEventsRequirement(feature);
        }
        else if (feature.checked && feature.text == $translate.instant("feature.weather")) {
          checkWeatherRequirement(feature);
        }
        else if (feature.checked && feature.text == $translate.instant("feature.commuteTime")) {
          checkCommuteRequirement(feature);
        }
        else if (feature.checked && feature.text == $translate.instant("feature.horoscope")) {
          checkHoroscopeRequirement(feature);
        }
        else if (feature.checked && feature.text == $translate.instant("feature.inspirationalQuote")) {
          checkInspirationalQuoteRequirement(feature);
        }
        else if (feature.checked && feature.text == $translate.instant("feature.bibleVerse")) {
          checkBibleVerseRequirement(feature);
        }
      }

      var settingsDayList = settingsService.getDaySettings($scope.settingsWeekdayList, $scope.settingsWeekendList);
      $.when(settingsDayList).done(function (data) {
        if (typeof data != "undefined") {
          var METHODNAME = "setHoroscopeSign:";
          console.debug(FILENAME + OBJECTNAME + JSON.stringify(data));

          $scope.settingsWeekdayList = data.settingsWeekdayList;
          $scope.settingsWeekendList = data.settingsWeekendList;
        }
      });

      var settingsWeekdayFeatures = settingsService.getWeekdayFeatureSettings($scope.settingsWeekdayFeaturesList);
      $.when(settingsWeekdayFeatures).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME + "settingsWeekdayFeatures return" + JSON.stringify(data));

          $scope.settingsWeekdayFeaturesList = data;
        }
      });

      var settingsWeekendFeatures = settingsService.getWeekendFeatureSettings($scope.settingsWeekendFeaturesList);
      $.when(settingsWeekendFeatures).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME + "settingsWeekendFeatures return" + JSON.stringify(data));

          $scope.settingsWeekendFeaturesList = data;
        }
      });

      $scope.buzzSetting = {
        "weekday": {"text": $translate.instant("buzz"), "checked": false},
        "weekend": {"text": $translate.instant("buzz"), "checked": false}
      };
      var otherSettingsBuzzWeekday = settingsService.getOtherSettingsBuzzWeekday();
      $.when(otherSettingsBuzzWeekday).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME + "OtherSettingsBuzzWeekday return" + data);

          $scope.buzzSetting.weekday.checked = data;
        }
      });
      var otherSettingsBuzzWeekend = settingsService.getOtherSettingsBuzzWeekend();
      $.when(otherSettingsBuzzWeekend).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME + "OtherSettingsBuzzWeekend return" + data);

          $scope.buzzSetting.weekend.checked = data;
        }
      });

      var otherSettingsHoroscopeList = settingsService.getOtherSettingsHoroscopeList($scope.horoscopeList);
      $.when(otherSettingsHoroscopeList).done(function (data) {
        if (typeof data != "undefined") {
          console.debug(FILENAME + OBJECTNAME + "OtherSettingsBuzzWeekend return" + JSON.stringify(data));

          $scope.horoscopeList = data;
        }
      });
      console.info(FILENAME + OBJECTNAME + "creating horoscope select popover");
      popoverSelectHoroscopeSign();

      $scope.saveSettings = function () {
        var METHODNAME = "saveSettings:";
        console.info(FILENAME + OBJECTNAME + METHODNAME);

        console.info(FILENAME + OBJECTNAME + METHODNAME + "starting to save all setting");
        var dataFillerSaveDays = settingsService.saveDays($scope.settingsWeekdayList, $scope.settingsWeekendList);
        $.when(dataFillerSaveDays).done(function (fillerSaveDays) {
          var dataFillerSaveFeatures = settingsService.saveFeatures($scope.settingsWeekdayFeaturesList, $scope.settingsWeekendFeaturesList);
          $.when(dataFillerSaveFeatures).done(function (fillerSaveFeatures) {
            var horoscopeSelected = "";
            if ($localStorage["horoscopeSelected"]) {
              horoscopeSelected = $localStorage["horoscopeSelected"];
            }
            var dataFillerSaveOtherSettings = settingsService.saveOtherSettings($scope.buzzSetting, $scope.horoscopeList, horoscopeSelected);
            $.when(dataFillerSaveOtherSettings).done(function (saveOtherSettings) {
              console.info(FILENAME + OBJECTNAME + METHODNAME + "ending to save all setting");

              console.info(FILENAME + OBJECTNAME + METHODNAME + "broadcast setNotifications");

              $rootScope.$broadcast("notificationPlayManager", {
                "notificationState": Constants.notificationState.STOP
              });
              $rootScope.$broadcast("setNotifications");
            });
          });
        });
      };

      function popoverSelectHoroscopeSign() {
        var METHODNAME = "popoverSelectHoroscopeSign:";
        console.info(FILENAME + OBJECTNAME + METHODNAME);

        $ionicPopover.fromTemplateUrl('templates/selectHoroscopeSign.html', {
          scope: $scope
        }).then(function (popover) {
          $scope.popover = popover;
        });
        $scope.openPopover = function ($event) {
          $scope.popover.show($event);
        };
        $scope.closePopover = function () {
          $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function () {
          $scope.popover.remove();
        });
        // Execute action on hide popover
        $scope.$on('popover.hidden', function () {
          // Execute action
        });
        // Execute action on remove popover
        $scope.$on('popover.removed', function () {
          // Execute action
        });
      }

      function checkGoogleEventsRequirement(feature) {
        var METHODNAME = "checkGoogleEventsRequirement";

        if (!$rootScope.isGoogleFeaturesPurchased) {
          textToSpeech.playText($translate.instant('feature.purchase.googleEvents'));
          feature.checked = false;
          $scope.$apply();
        }
        else {
          var promise = googleLoginService.checkIfLoggedIn();
          promise.then(function (data) {
            var isLoggedIn = JSON.stringify(data).bool();
            if (!isLoggedIn) {
              textToSpeech.playText($translate.instant("googleTask.notLoggedIn"));
              feature.checked = false;
              $scope.$apply();
            }
          }, function (data) {
            $scope.google_data = data;

            console.error(FILENAME + OBJECTNAME + JSON.stringify(google_data));
          });
        }
      }

      function checkCommuteRequirement(feature) {
        var METHODNAME = "checkCommuteRequirement";

        if (!$rootScope.isGoogleFeaturesPurchased) {
          textToSpeech.playText($translate.instant('feature.purchase.commuteTime'));
          feature.checked = false;
          $scope.$apply();
        }
        else {
          var location = {"home": "", "work": ""};
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
              if ((location.home).isEmpty() && (location.work).isEmpty()) {
                textToSpeech.playText($translate.instant('location.commuteTime.isEmpty'));
                feature.checked = false;
                $scope.$apply();
              }
              else if ((location.home).isEmpty()) {
                textToSpeech.playText($translate.instant('location.home.commuteTime.isEmpty'));
                feature.checked = false;
                $scope.$apply();
              }
              else if ((location.work).isEmpty()) {
                textToSpeech.playText($translate.instant('location.work.commuteTime.isEmpty'));
                feature.checked = false;
                $scope.$apply();
              }
            });
          });
        }
      }

      function checkWeatherRequirement(feature) {
        var METHODNAME = "checkWeatherRequirement";

        var homeLocationLatLong;

        var homeLatLong = locationService.getHomeLatLongCoordinates();
        $.when(homeLatLong).done(function (data) {
          if (typeof data != "undefined") {
            homeLocationLatLong = data;
            if (((homeLocationLatLong.latitude).toString().isEmpty()) && ((homeLocationLatLong.longitude).toString().isEmpty())) {
              textToSpeech.playText($translate.instant('location.home.weather.isEmpty'));
              feature.checked = false;
              $scope.$apply();
            }
          }
        });
      }

      function checkHoroscopeRequirement(feature) {
        var METHODNAME = "checkHoroscopeRequirement";

        if (!$rootScope.isHoroBiblInspFeaturesPurchased) {
          textToSpeech.playText($translate.instant('feature.purchase.horoscope'));
          feature.checked = false;
          $scope.$apply();
        }
        else {
          if (!($localStorage["horoscopeSelected"])) {
            textToSpeech.playText($translate.instant('horoscope.sign.notSelected'));
            feature.checked = false;
            $scope.$apply();
          }
        }
      }

      function checkInspirationalQuoteRequirement(feature) {
        var METHODNAME = "checkHoroscopeRequirement";

        if (!$rootScope.isHoroBiblInspFeaturesPurchased) {
          textToSpeech.playText($translate.instant('feature.purchase.inspirationalQuote'));
          feature.checked = false;
          $scope.$apply();
        }
      }

      function checkBibleVerseRequirement(feature) {
        var METHODNAME = "checkHoroscopeRequirement";

        if (!$rootScope.isHoroBiblInspFeaturesPurchased) {
          textToSpeech.playText($translate.instant('feature.purchase.bibleVerse'));
          feature.checked = false;
          $scope.$apply();
        }
      }
    }
  );
}]);
