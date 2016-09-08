var FILENAME = "accountController.js:";
gcalarm.controller('accountController', ['$scope', 'accountService', 'googleLoginService', 'statusService', '$http', '$ionicModal', '$timeout', '$ionicPopup', '$cordovaOauth', '$translate', function ($scope, accountService, googleLoginService, statusService, $http, $ionicModal, $timeout, $ionicPopup, $cordovaOauth, $translate) {
  var OBJECTNAME = "accountController:";

  statusService.setExistingBackgroundImage();

  var promise = googleLoginService.checkIfLoggedIn();
  promise.then(function (data) {
    if (data) {
      console.info(FILENAME + OBJECTNAME + "changing google connect button to " + $scope.googleConnnectButtonText);
      console.info(FILENAME + OBJECTNAME + "google login successful");
      console.info(FILENAME + OBJECTNAME + JSON.stringify(data));

      $scope.googleConnected = true;
    }
    else {
      console.info(FILENAME + OBJECTNAME + "changing google connect button to " + $scope.googleConnnectButtonText);

      $scope.googleConnected = false;
    }
  }, function (data) {
    $scope.google_data = data;

    console.error(FILENAME + OBJECTNAME + JSON.stringify(google_data));
  });
  // Triggered on a button click, or some other target
  $scope.googleConnect = function () {
    var METHODNAME = "googleConnect:";

    if (!$scope.googleConnected) {

      console.info(FILENAME + OBJECTNAME + METHODNAME + "changing google connect button to " + $scope.googleConnnectButtonText);

      var promise = googleLoginService.startLogin();
      promise.then(function (data) {
        $scope.google_data = data;

        $scope.googleConnected = true;

        console.info(FILENAME + OBJECTNAME + "google login successful");
        console.info(FILENAME + OBJECTNAME + JSON.stringify(data));
      }, function (data) {
        $scope.google_data = data;

        console.error(FILENAME + OBJECTNAME + JSON.stringify(google_data));
      });
    }
    else {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "changing google connect button to " + $scope.googleConnnectButtonText);

      var isLoggedOut = googleLoginService.logOut();
      $.when(isLoggedOut).done(function (data) {
        if (data) {

          $scope.googleConnected = false;

          console.info(FILENAME + OBJECTNAME + JSON.stringify(data));
        }
      }, function (data) {
        $scope.google_data = data;

        console.error(FILENAME + OBJECTNAME + JSON.stringify($scope.google_data));
      });
    }

    console.info(FILENAME + OBJECTNAME + METHODNAME + "exited");
  };
}]);
