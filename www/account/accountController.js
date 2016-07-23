gcalarm.controller('accountController', ['$scope','accountService', '$ionicModal', '$timeout', '$ionicPopup', function($scope, accountService, $ionicModal, $timeout, $ionicPopup) {

  $scope.googleConnnectButtonText = "google unconnected";
  // Triggered on a button click, or some other target
  $scope.googleConnect = function() {
    $scope.data = {};
    // An elaborate, custom popup
    var googleConnectPopup = $ionicPopup.show({
      template: '<div id="authorize-div" style="display: none"><span>Authorize access to Google Tasks API</span></div><pre id="output"></pre>',
      //template: '<input type="text" ng-model="data.email" placeholder="email"></br><input type="password" ng-model="data.password" placeholder="password">',
      /*        title: 'google',*/
      subTitle: 'google connection',
      scope: $scope,
      buttons: [
        { text: 'cancel' },
        {
          text: '<button id="authorize-button">Authorize </button>',<!--Button for the user to click to initiate auth sequence -->
          type: 'button-positive',
          onTap: function(e) {
            if(handleAuthClick(e)){
              $scope.googleConnnectButtonText = "google connected";
            }
            else{
              $scope.googleConnnectButtonText = "google unconnected";
            }

            googleConnectPopup.close();
/*            if (!$scope.data.password) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data.password;
            }*/
          }
        }
      ]
    });

    googleConnectPopup.then(function(res) {
      console.log('googleConnectPopup!', res);
    });
/*
    $timeout(function() {
      googleConnectPopup.close(); //close the popup after 3 seconds for some reason
    }, 30000);*/
  };

}]);
