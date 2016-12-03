var FILENAME = "locationController.js:";
gcalarm.controller('locationController', ['$scope','locationService', 'statusService', '$ionicModal', '$timeout', '$ionicPopup', '$translate', function($scope, locationService, statusService, $ionicModal, $timeout, $ionicPopup, $translate) {
  var OBJECTNAME = "locationController:";

  //statusService.setExistingBackgroundImage();

  $scope.location = {"home":"","work":""};

  $scope.homeChanged = function(homeLocation) {
    var METHODNAME = "homeChanged:";
    console.info(FILENAME + OBJECTNAME);

    $scope.location.home = homeLocation;
  };
  $scope.workChanged = function(workLocation) {
    var METHODNAME = "workChanged:";
    console.info(FILENAME + OBJECTNAME);

    $scope.location.work = workLocation;
  };

  var homeLocation = locationService.getHomeLocation();
  $.when(homeLocation).done(function(data) {
    if(typeof data != "undefined"){
      console.info(FILENAME + OBJECTNAME);
      console.debug(FILENAME + OBJECTNAME + JSON.stringify(data));

      $scope.location.home = data;
    }
  });

  var workLocation = locationService.getWorkLocation();
  $.when(workLocation).done(function(data) {
    if(typeof data != "undefined"){
      console.info(FILENAME + OBJECTNAME);
      console.debug(FILENAME + OBJECTNAME + JSON.stringify(data));

      $scope.location.work = data;
    }
  });

  $scope.saveLocations = function() {
    var METHODNAME = "saveLocations:";
    console.info(FILENAME + OBJECTNAME);

    locationService.saveLocations($scope.location);
  };

}]);

