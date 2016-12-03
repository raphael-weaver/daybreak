var FILENAME = "startController.js:";

gcalarm.controller('startController', ['$scope', '$rootScope', 'startService', 'settingsService', 'statusService', 'textToSpeech', 'localization', '$ionicPlatform', 'IonicClosePopupService', '$translate', '$ionicPopup', '$ionicPopover', '$cordovaLocalNotification', '$locale', '$localStorage', '$ionicPlatform', 'Constants', function ($scope, $rootScope, startService, settingsService, statusService, textToSpeech, localization, $ionicPlatform, IonicClosePopupService, $translate, $ionicPopup, $ionicPopover, $cordovaLocalNotification, $locale, $localStorage, $ionicPlatform, Constants) {
  var OBJECTNAME = "startController:";

  $ionicPlatform.ready(function () {

    $scope.$on("setNotifications", function () {
      $scope.setNotifications();
    });

    $scope.activeAlarmOptions = function () {
      var METHODNAME = "activeAlarmOptions:";

      console.info(FILENAME + OBJECTNAME + METHODNAME);

      var activeAlarmOptionsPopup = $ionicPopup.show({
        template: '',
        scope: $scope,
        cssClass: 'activeAlarmOptionsPopup',
        buttons: [{
          text: '<b>' + $translate.instant("button.snooze.text") + '</b>',
          type: 'button-positive',
          onTap: function (e) {
            console.info(FILENAME + OBJECTNAME + METHODNAME + "snooze button click");

            runSnoozeActions();
            activeAlarmOptionsPopup.close();
          }
        }, {
          text: '<b>' + $translate.instant("button.stop.text") + '</b>',
          type: 'button-light',
          onTap: function (e) {
            console.info(FILENAME + OBJECTNAME + METHODNAME + "stop button click");

            runStopActions();
            activeAlarmOptionsPopup.close();
          }
        },]
      });
      IonicClosePopupService.register(activeAlarmOptionsPopup);

      function runSnoozeActions() {
        var METHODNAME = "runSnoozeActions:";
        console.info(FILENAME + OBJECTNAME + METHODNAME);

        textToSpeech.playBlankText();

        console.info(FILENAME + OBJECTNAME + METHODNAME + "start clear triggered alarms");
        console.info(FILENAME + OBJECTNAME + METHODNAME + "end clear triggered alarms");

        $rootScope.$broadcast("notificationPlayManager", {
          "notificationState":Constants.notificationState.SNOOZE,
        });

        console.info(FILENAME + OBJECTNAME + METHODNAME + "end add snooze notification");

        $scope.popover.hide();
      };

      function runStopActions() {
        var METHODNAME = "runStopActions:";
        console.info(FILENAME + OBJECTNAME + METHODNAME);
        console.info(FILENAME + OBJECTNAME + METHODNAME + "start clear triggered alarms");

        textToSpeech.playBlankText();

        $rootScope.$broadcast("notificationPlayManager", {
          "notificationState":Constants.notificationState.STOP
        });
        console.info(FILENAME + OBJECTNAME + METHODNAME + "end clear triggered alarms");
      }

      $scope.popover.hide();
    };
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
