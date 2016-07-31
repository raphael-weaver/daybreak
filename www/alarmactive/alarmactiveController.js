gcalarm.controller('alarmactiveController', ['$scope', 'alarmactiveService', 'googleEvent', 'googleMap', 'textToSpeech', '$ionicModal', '$timeout', '$ionicPopup', function($scope, alarmactiveService, googleEvent, googleMap, textToSpeech, $ionicModal, $timeout, $ionicPopup) {

  // Triggered on a button click, or some other target
  $scope.snooze = function() {

  };

  // Triggered on a button click, or some other target
  $scope.stop = function() {

  };

  // Triggered on a button click, or some other target
  $scope.sayCommuteTime = function() {
    var commuteTime = googleMap.getCommuteTime();
    $.when(commuteTime).done(function(data) {
      if(typeof data != "undefined"){
        textToSpeech.playText("Current commute time to work is" + data);
      }
    });
  };
}]);
