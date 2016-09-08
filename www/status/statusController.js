var FILENAME = "statusController.js:";
gcalarm.controller('statusController', ['$scope', '$rootScope', 'statusService', '$ionicModal', '$timeout', '$ionicPopup', '$ionicPlatform', '$cordovaLocalNotification', '$translate', function($scope, $rootScope, statusService, $ionicModal, $timeout, $ionicPopup, $ionicPlatform, $cordovaLocalNotification, $translate) {
  var OBJECTNAME = "statusController:";

  statusService.setExistingBackgroundImage();

  var notificationSet = "";
  $ionicPlatform.ready(function() {
    console.info(FILENAME + OBJECTNAME + "ionic platform is ready");

    var notificationTime = statusService.getNotificationTime();
    $.when(notificationTime).done(function(data) {
      console.debug(FILENAME + OBJECTNAME + "notificationTime=" + JSON.stringify(data));

      notificationSet = data;
      $scope.weekdayTimePickerObject = {
        etime: data.weekdayNotification,//Optional
        step: 05,  //Optional
        format: 12,  //Optional
        titleLabel: '12-hour Format',  //Optional
        setLabel: $translate("set"),  //Optional
        closeLabel: $translate("close"),  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
          weekdayTimePickerCallback(val);
        }
      };

      $scope.weekendTimePickerObject = {
        etime: data.weekendNotification,//Optional
        step: 05,  //Optional
        format: 12,  //Optional
        titleLabel: '12-hour Format',  //Optional
        setLabel: $translate("set"),  //Optional
        closeLabel: $translate("close"),  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
          weekendTimePickerCallback(val);
        }
      };
    });

    function weekdayTimePickerCallback(val) {
      var METHODNAME = "weekdayTimePickerCallback:";
      console.info(FILENAME + OBJECTNAME + METHODNAME);

      if (typeof (val) === 'undefined') {
        console.info(FILENAME + OBJECTNAME + METHODNAME + 'Time not selected');
      } else {
        var dataFiller = statusService.saveWeekdayNotificationTime(val);
        $.when(dataFiller).done(function(data) {
          console.info(FILENAME + OBJECTNAME + METHODNAME + "broadcast setNotifications");

          $rootScope.$broadcast("setNotifications");
        });
      }
    }

    function weekendTimePickerCallback(val) {
      var METHODNAME = "weekendTimePickerCallback:";
      console.info(FILENAME + OBJECTNAME + METHODNAME);

      if (typeof (val) === 'undefined') {
        console.info(FILENAME + OBJECTNAME + METHODNAME + 'Time not selected');
      } else {
        var dataFiller = statusService.saveWeekendNotificationTime(val);
        $.when(dataFiller).done(function(data) {
          console.info(FILENAME + OBJECTNAME + METHODNAME + "broadcast setNotifications");

          $rootScope.$broadcast("setNotifications");
        });
      }
    }
  });
}]);
