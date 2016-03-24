angular.module('starter.controllers', ['ionic-timepicker', 'standard-time-meridian', 'ion-place-tools'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopup) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    $scope.googleConnnectButtonText = "google unconnected";

    $scope.settingsDaysList = [
      { text: "Mon", checked: false },
      { text: "Tue", checked: false },
      { text: "Wed", checked: false },
      { text: "Thu", checked: false },
      { text: "Fri", checked: false },
      { text: "Sat", checked: false },
      { text: "Sun", checked: false }
    ];

    $scope.settingsFeaturesList = [
      { text: "Google Tasks", checked: false },
      { text: "Weather", checked: false },
      { text: "Commute Time", checked: false }
    ];

    // Triggered on a button click, or some other target
  $scope.googleConnect = function() {
      $scope.data = {};
      // An elaborate, custom popup
      var googleConnectPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.email" placeholder="email"></br><input type="password" ng-model="data.password" placeholder="password">',
/*        title: 'google',*/
        subTitle: 'google connection information',
        scope: $scope,
        buttons: [
          { text: 'cancel' },
          {
            text: '<b>connect</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.password) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                return $scope.data.password;
              }
            }
          }
        ]
      });

    googleConnectPopup.then(function(res) {
      console.log('googleConnectPopup!', res);
    });

    $timeout(function() {
      googleConnectPopup.close(); //close the popup after 3 seconds for some reason
    }, 30000);
  };
    //end account
  // Form data for the login modal
  $scope.loginData = {};
  $scope.timePickerObject = {
    etime: ((new Date()).getHours() * 60 * 60),  //Optional
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

  function timePickerCallback(val) {
    if (typeof (val) === 'undefined') {
      console.log('Time not selected');
    } else {
      var selectedTime = new Date(val * 1000);
      console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
    }
  }

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
