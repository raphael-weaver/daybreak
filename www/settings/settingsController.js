gcalarm.controller('settingsController', ['$scope','settingsService', '$ionicModal', '$timeout', '$ionicPopup', function($scope, settingsService, $ionicModal, $timeout, $ionicPopup) {

  var settingsDays = settingsService.getDaySettings($scope.settingsDaysList);
  $.when(settingsDays).done(function(data) {
    if(typeof data != "undefined"){
      $scope.settingsDaysList = data;
    }
  });

  var settingsFeatures = settingsService.getFeatureSettings($scope.settingsFeaturesList);
  $.when(settingsFeatures).done(function(data) {
    if(typeof data != "undefined"){
      $scope.settingsFeaturesList = data;
    }
  });

  $scope.saveSettings = function() {
    settingsService.saveDays($scope.settingsDaysList);
    settingsService.saveFeatures($scope.settingsFeaturesList);
  };

}]);
