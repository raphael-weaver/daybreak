gcalarm.controller('locationController', ['$scope','locationService', '$ionicModal', '$timeout', '$ionicPopup', function($scope, locationService, $ionicModal, $timeout, $ionicPopup) {

  $scope.location = {"home":"","work":""};

  $scope.homeChanged = function(homeLocation) {
    $scope.location.home = homeLocation;
  };
  $scope.workChanged = function(workLocation) {
    $scope.location.work = workLocation;
  };

  var homeLocation = locationService.getHomeLocation();
  $.when(homeLocation).done(function(data) {
    if(typeof data != "undefined"){
      $scope.home = data;
    }
  });

  var workLocation = locationService.getWorkLocation();
  $.when(workLocation).done(function(data) {
    if(typeof data != "undefined"){
      $scope.work = data;
    }
  });

  $scope.saveLocations = function() {
    locationService.saveLocations($scope.location);
  };

}]);

