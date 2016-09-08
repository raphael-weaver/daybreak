var FILENAME = "gcalarmController.js:";
gcalarm.controller('gcalarmController', ['$scope', '$rootScope', '$localStorage', '$ionicModal', '$timeout', '$ionicPopup', '$ionicPopover', '$ionicPlatform', '$cordovaCamera', '$translate', 'statusService', function ($scope, $rootScope, $localStorage, $ionicModal, $timeout, $ionicPopup, $ionicPopover, $ionicPlatform, $cordovaCamera, $translate, statusService) {
  var OBJECTNAME = "gcalarmController:";

  console.info(FILENAME + OBJECTNAME + "calling popoverMainSettings");
  popoverMainSettings();

  console.info(FILENAME + OBJECTNAME + "get name if exist");
  if ($localStorage["name"]) {
    $scope.name = $localStorage["name"];
  }
  else {
    $scope.name = $translate.instant("add.name");
  }

  console.info(FILENAME + OBJECTNAME + "get background image if exist");

  statusService.setExistingBackgroundImage();

  $scope.setName = function () {
    var METHODNAME = "setName:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var setNamePopup = $ionicPopup.show({
      template: '<input type="text" style="height:40px;font-size:14pt;" class="namePopupText" ng-value="name" placeholder="{{name}}">',
      scope: $scope,
      cssClass: 'setNamePopup',
      buttons: [
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function (e) {
            $scope.name = $(".namePopupText").val();
            $localStorage["name"] = $scope.name;
          }
        }, {
          text: 'Cancel'
        },]
    });

    console.debug(FILENAME + OBJECTNAME + METHODNAME + +"popup creation text=" + setNamePopup);
    $scope.popover.hide();
  };

  $scope.setBackgroundImage = function () {
    var METHODNAME = "setBackgroundImage:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    this.setBackgroundImage = function () {
      var defer = $.Deferred();
      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: window.innerWidth,
        targetHeight: window.innerHeight,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function (imageData) {
        console.info(FILENAME + OBJECTNAME + METHODNAME + "retrieved picture from mobile device");

        var imageUri = "data:image/jpeg;base64," + imageData;

        console.debug(FILENAME + OBJECTNAME + METHODNAME + "retrieved picture from device");

        $localStorage["imageUri"] = imageUri;
        console.info(FILENAME + OBJECTNAME + METHODNAME + "set device to background image" + imageUri);
        statusService.setCSSBackgroundImage(imageUri);
        defer.resolve(imageUri);
      });
      return defer.promise();
    };
  };

  $scope.addTiles = function () {
    var defer = $.Deferred();

    defer.resolve(true);

    return defer.promise();
  };

  function popoverMainSettings() {
    var METHODNAME = "popoverMainSettings:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/mainSettings.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });
    $scope.openPopover = function ($event) {
      if ($scope.popover.isShown()) {
        $scope.popover.hide();
      }
      else {
        $scope.popover.show($event);
      }
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
      // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
      // Execute action
    });
  }
}]);
