gcalarm.controller('statusController', ['$scope','statusService', '$ionicModal', '$timeout', '$ionicPopup', function($scope, statusService, $ionicModal, $timeout, $ionicPopup) {

  // Form data for the login modal
  $scope.loginData = {};

  var notificationTime = statusService.getNotificationTime();
  $.when(notificationTime).done(function(data) {
    $scope.timePickerObject = {
      etime: data,//Optional
      step: 05,  //Optional
      format: 12,  //Optional
      titleLabel: '12-hour Format',  //Optional
      setLabel: 'Set',  //Optional
      closeLabel: 'Close',  //Optional
      setButtonType: 'button-positive',  //Optional
      closeButtonType: 'button-stable',  //Optional
      callback: function (val) {    //Mandatory
        timePickerCallback(val);
      }
    };
  });

  function timePickerCallback(val) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      statusService.saveNotificationTime(val);
    }
  }

}]);
