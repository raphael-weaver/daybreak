gcalarm.controller('accountController', ['$scope', 'accountService', '$ionicModal', '$timeout', '$ionicPopup', '$cordovaOauth', function($scope, accountService, $ionicModal, $timeout, $ionicPopup, $cordovaOauth) {

  var googleTokenReturn = accountService.getGoogleToken();
  $.when(googleTokenReturn).done(function(data) {
    var googleTokenJSObject;
    if(typeof data !== "undefined") {
      if (data !== "") {
        googleTokenJSObject = JSON.parse(data);
        handleAuthResult(googleTokenJSObject);
        gapi.auth.setToken(googleTokenJSObject);
        $scope.googleConnnectButtonText = "google connected";
      }
      else {
        $scope.googleConnnectButtonText = "google unconnected";
      }
      $scope.googleToken = googleTokenJSObject;
    }
  });

  // Triggered on a button click, or some other target
  $scope.googleConnect = function() {
    if($scope.googleConnnectButtonText == "google connected"){
      $scope.googleToken = "";
      $scope.googleConnnectButtonText = "google unconnected";
      accountService.deleteGoogleToken();
      gapi.auth.signOut();
    }
    else{
      var clientId = '674271502244-s7bdlo86hv8nmsbda8n4ga68h2rjolfo.apps.googleusercontent.com';
      var scopes   = ['https://www.googleapis.com/auth/tasks.readonly', 'profile'];
      $cordovaOauth.google(clientId, scopes).then(function(result) {
        $scope.googleConnnectButtonText = "google connected";
        // call googleLogin.handleAuthResult to initialize angular-googleapi callbacks
        handleAuthResult(result);
        accountService.saveGoogleToken(result);
        $scope.googleToken = result;
        // for the callbacks to work, set authentication result as gapi access_token
        gapi.auth.setToken(result);

      }, function(error) {
        $scope.googleConnnectButtonText = "google unconnected";
      });
    }
  };

}]);
