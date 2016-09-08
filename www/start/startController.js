var FILENAME = "startController.js:";

gcalarm.controller('startController', ['$scope', 'startService', 'settingsService', 'statusService', '$ionicPlatform', 'IonicClosePopupService', '$translate', '$ionicPopup', '$ionicPopover', '$cordovaLocalNotification', '$locale', '$localStorage', '$ionicPlatform', function ($scope, startService, settingsService, statusService, $ionicPlatform, IonicClosePopupService, $translate, $ionicPopup, $cordovaLocalNotification, $localStorage, $locale) {
  var OBJECTNAME = "startController:";

  $ionicPlatform.ready(function () {

    $scope.activeAlarmOptions = function () {
      var METHODNAME = "activeAlarmOptions:";

      console.info(FILENAME + OBJECTNAME + METHODNAME);

      var activeAlarmOptionsPopup = $ionicPopup.show({
        template: '',
        scope: $scope,
        cssClass: 'activeAlarmOptionsPopup',
        buttons: [{
          text: '<b>Snooze</b>',
          type: 'button-positive',
          onTap: function (e) {
            console.info(FILENAME + OBJECTNAME + METHODNAME + "snooze button click");

            runSnoozeActions();
            activeAlarmOptionsPopup.close();
          }
        }, {
          text: '<b>Stop</b>',
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

        var nextSnoozeTime = new Date(Date.now());
        nextSnoozeTime.setMinutes(nextSnoozeTime.getMinutes() + 15);

        var name = "";
        if ($localStorage["name"]) {
          name = $localStorage["name"];
        }

        console.info(FILENAME + OBJECTNAME + METHODNAME + "start clear triggered alarms");
        cordova.plugins.notification.local.getTriggeredIds(function (triggeredIds) {
          console.debug(FILENAME + OBJECTNAME + METHODNAME + "triggeredIds=" + JSON.stringify(triggeredIds));

          cordova.plugins.notification.local.clear(triggeredIds, function () {
          });
        });
        console.info(FILENAME + OBJECTNAME + METHODNAME + "end clear triggered alarms");

        var otherSettingsBuzzWeekdayData = settingsService.getOtherSettingsBuzzWeekday();
        $.when(otherSettingsBuzzWeekdayData).done(function (otherSettingsBuzzWeekday) {
          var otherSettingsBuzzWeekendData = settingsService.getOtherSettingsBuzzWeekend();
          $.when(otherSettingsBuzzWeekendData).done(function (otherSettingsBuzzWeekend) {

            var buzzSettings;
            if (isWeekday(new Date(Date.now()))) {
              buzzSettings = otherSettingsBuzzWeekday;
            }
            else {
              buzzSettings = otherSettingsBuzzWeekend;
            }
            console.info(FILENAME + OBJECTNAME + METHODNAME + "start add snooze notification");
            var notificationId = (Math.floor(Math.random() * 1000000));
            $cordovaLocalNotification.add({
              id: notificationId,
              firstAt: nextSnoozeTime,
              message: "Hello " + name,
              title: "Your Daily Briefing....",
              every: "minute",
              sound: buzzSettings ? 'file://audio/loudBuzzer.mp3' : ''
            }).then(function () {
              console.info(FILENAME + OBJECTNAME + METHODNAME + "cordovaLocalNotifications set");
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
            console.info(FILENAME + OBJECTNAME + METHODNAME + "end add snooze notification");
          });
        });
      }

      function runStopActions() {
        var METHODNAME = "runStopActions:";
        console.info(FILENAME + OBJECTNAME + METHODNAME);

        console.info(FILENAME + OBJECTNAME + METHODNAME + "start clear triggered alarms");
        cordova.plugins.notification.local.getTriggeredIds(function (triggeredIds) {
          console.debug(FILENAME + OBJECTNAME + METHODNAME + "triggeredIds=" + JSON.stringify(triggeredIds));

          cordova.plugins.notification.local.clear(triggeredIds, function () {
          });
        });
        console.info(FILENAME + OBJECTNAME + METHODNAME + "end clear triggered alarms");
      }

      function isWeekday(days) {
        var METHODNAME = "isWeekday:";
        console.info(FILENAME + OBJECTNAME + METHODNAME);

        var weekdayList = [$locale.DATETIME_FORMATS.SHORTDAY[1].toString().toLowerCase(), $locale.DATETIME_FORMATS.SHORTDAY[2].toString().toLowerCase(), $locale.DATETIME_FORMATS.SHORTDAY[3].toString().toLowerCase(), $locale.DATETIME_FORMATS.SHORTDAY[4].toString().toLowerCase(), $locale.DATETIME_FORMATS.SHORTDAY[5].toString().toLowerCase()];

        return ($.inArray(days.text, weekdayList)) > -1;
      }

      function isWeekend(days) {
        var METHODNAME = "isWeekend:";
        console.info(FILENAME + OBJECTNAME + METHODNAME);

        var weekendList = [$locale.DATETIME_FORMATS.SHORTDAY[6].toString().toLowerCase(), $locale.DATETIME_FORMATS.SHORTDAY[0].toString().toLowerCase()];
        return ($.inArray(days.text, weekendList)) > -1;
      }

      console.debug(FILENAME + OBJECTNAME + METHODNAME + +"popup creation text=" + setNamePopup);
      $scope.popover.hide();
    };
  });
}]);
