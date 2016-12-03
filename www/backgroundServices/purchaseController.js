var FILENAME = "purchaseController.js:";
gcalarm.controller('purchaseController', ['$scope', '$rootScope', '$ionicPlatform', '$ionicLoading', '$ionicPopup', 'Constants', function ($scope, $rootScope, $ionicPlatform, $ionicLoading, $ionicPopup, Constants) {
  var OBJECTNAME = "purchaseController:";

  var productIds = ['google_features_1', 'extra_info_features_1']; // <- Add your product Ids here
  var GOOGLEFEATURES = productIds[0];
  var EXTRAINFOFEATURES = productIds[1];

  var spinner = '<ion-spinner icon="dots" class="spinner-stable"></ion-spinner><br/>';

  var productsCallback = loadProducts();
  $.when(productsCallback).done(function (data) {
    $rootScope.renderSettingFeatureToggles = true;
    $scope.$apply();
  });

  $scope.purchaseGoogleFeatures = function () {
    $scope.buy(GOOGLEFEATURES);
  };

  $scope.purchaseExtraInfoFeatures = function () {
    $scope.buy(EXTRAINFOFEATURES);
  };

  $scope.buy = function (productId) {

    $ionicLoading.show({ template: spinner + 'Purchasing...' });
    inAppPurchase
      .buy(productId)
      .then(function (data) {
        if(GOOGLEFEATURES == productId) {
          $rootScope.isGoogleFeaturesPurchased = true;
          $scope.$apply();
        }
        else if(EXTRAINFOFEATURES == productId) {
          $rootScope.isHoroBiblInspFeaturesPurchased = true;
          $scope.$apply();
        }
        console.log(JSON.stringify(data));
        console.log('consuming transactionId: ' + data.transactionId);
        return inAppPurchase.consume(data.type, data.receipt, data.signature);
      })
      .then(function () {
        var alertPopup = $ionicPopup.alert({
          title: 'Purchase was successful!',
          template: 'Enjoy your new feature!'
        });
        console.log('consume done!');
        $ionicLoading.hide();
      })
      .catch(function (err) {
        $ionicLoading.hide();
        console.log(JSON.stringify(err));
/*        $ionicPopup.alert({
          title: 'Something went wrong',
          template: 'Check your console log for the error details'
        });*/
      });

  };

  function loadProducts () {
    var defer = $.Deferred();

    inAppPurchase
      .getProducts(productIds)
      .then(function (products) {
        console.log(JSON.stringify(products));
        for(var product of products){
          if(product.productId == GOOGLEFEATURES) {
            $rootScope.isGoogleFeaturesPurchased = true;
            $scope.$apply();
          }
          else if(product.productId == EXTRAINFOFEATURES) {
            $rootScope.isHoroBiblInspFeaturesPurchased = true;
            $scope.$apply();
          }
        }
        defer.resolve(true);
      })
      .catch(function (err) {
        console.log(err);
        defer.resolve(false);
      });
    return defer.promise();
  }

  function restore() {
    inAppPurchase
      .restorePurchases()
      .then(function (purchases) {
        $ionicLoading.hide();
        console.log(JSON.stringify(purchases));
        $ionicPopup.alert({
          title: 'Restore was successful!',
          template: 'Check your console log for the restored purchases data'
        });
      })
      .catch(function (err) {
        $ionicLoading.hide();
        console.log(err);
        $ionicPopup.alert({
          title: 'Something went wrong',
          template: 'Check your console log for the error details'
        });
      });
  }
}]);
