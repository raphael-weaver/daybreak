var FILENAME = "settingsController.js:";
gcalarm.controller('settingsController', ['$scope', '$rootScope', '$ionicPlatform',  '$ionicPopover', 'settingsService', 'statusService', '$ionicModal', '$timeout', '$ionicPopup', '$translate', function($scope, $rootScope, $ionicPlatform, $ionicPopover, settingsService, statusService, $ionicModal, $timeout, $ionicPopup, $translate) {
  var OBJECTNAME = "settingsController:";

  statusService.setExistingBackgroundImage();

  $ionicPlatform.ready(function () {
    console.info(FILENAME + OBJECTNAME + "ionic platform is ready");

    $scope.horoscopeSelected = "";

    $scope.setHoroscopeSign = function (horoscopeItem) {
      var METHODNAME = "setHoroscopeSign:";
      console.info(FILENAME + OBJECTNAME + METHODNAME);

      $scope.horoscopeSelected = horoscopeItem.sign;
      $scope.popover.hide();
    };
    var returnValue = statusService.setExistingBackgroundImage();
    $.when(returnValue).done(function (data) {
    });

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

    $scope.buzzSetting = {"weekday": {"text": $translate.instant("buzz"), "checked": false}, "weekend": {"text": $translate.instant("buzz"), "checked": false}};
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
          var dataFillerSaveOtherSettings = settingsService.saveOtherSettings($scope.buzzSetting, $scope.horoscopeList, $scope.horoscopeSelected);
          $.when(dataFillerSaveOtherSettings).done(function (saveOtherSettings) {
            console.info(FILENAME + OBJECTNAME + METHODNAME + "ending to save all setting");

            console.info(FILENAME + OBJECTNAME + METHODNAME + "broadcast setNotifications");
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
  });
}]);
