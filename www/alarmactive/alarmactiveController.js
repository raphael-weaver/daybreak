var FILENAME = "alarmactiveController.js:";
gcalarm.controller('alarmactiveController', ['$scope', 'alarmactiveService', 'googleMap', 'googleEvent', 'weather', 'textToSpeech', 'bibleVerse', 'horoscope', 'quote', '$ionicModal', '$timeout', '$ionicPopup', '$translate', function($scope, alarmactiveService, googleMap, googleEvent, weather, textToSpeech, bibleVerse, horoscope, quote, $ionicModal, $timeout, $ionicPopup, $translate) {
  var OBJECTNAME = "alarmactiveController:";

  $scope.snooze = function() {
    var METHODNAME = "snooze:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);
  };
  // Triggered on a button click, or some other target
  $scope.stop = function() {
    var METHODNAME = "stop:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);
  };

}]);
