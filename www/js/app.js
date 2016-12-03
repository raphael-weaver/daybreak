// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var gcalarm = angular.module('gcalarm', ['ionic', 'ionic-timepicker', 'standard-time-meridian', 'ion-place-tools', 'ngCordovaOauth', 'ngStorage', 'ngCordova', 'tmh.dynamicLocale', 'pascalprecht.translate', 'ionic.closePopup'])

   ///Languages implemented within application
  .constant('Constants', {
    availableLanguages:{
      0:'en-US',
      1:'es-es',
      2:'fr-fr',
      3:'ja-jp',
      4:'ms-latn',
      5:'pt-pt',
      6:'ru-ru',
      7:'zh-cn',
      8:'de-de',
      9:'ar-001'
    },
    defaultLanguage:'en-US',
    notificationState:{
      STOP: 1,
      SNOOZE: 3,
      TRIGGERED: 2,
      ACTIVE: 4
    }
  }
  )
  .run(function ($rootScope, $ionicPlatform, tmhDynamicLocale, Constants) {

    $ionicPlatform.ready(function () {
      tmhDynamicLocale.set(Constants.defaultLanguage);
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });
  })
  .config(function (tmhDynamicLocaleProvider, $translateProvider, Constants) {
    tmhDynamicLocaleProvider.localeLocationPattern('locales/angular-locale_{{locale}}.js');
    $translateProvider.useStaticFilesLoader({
       'prefix': 'i18n/',
       'suffix': '.json'
     });
    $translateProvider.preferredLanguage(Constants.defaultLanguage);
  })
  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('top');
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'gcalarmController'
      })
      .state('app.status', {
        url: '/status',
        views: {
          'menuContent': {
            abstract: true,
            templateUrl: 'templates/status.html',
            controller: 'statusController'
          }
        }
      })
      .state('app.start', {
        url: '/start',
        views: {
          'menuContent': {
            templateUrl: 'templates/start.html',
            controller: 'startController'
          }
        }
      })
      .state('app.alarmactive', {
        url: '/alarmactive',
        views: {
          'menuContent': {
            templateUrl: 'templates/alarmactive.html',
            controller: 'alarmactiveController'
          }
        }
      })
      .state('app.alarmactiveTest', {
        url: '/alarmactiveTest',
        views: {
          'menuContent': {
            templateUrl: 'templates/alarmactiveTest.html',
            controller: 'alarmactiveControllerTest'
          }
        }
      })
      .state('app.account', {
        url: '/account',
        views: {
          'menuContent': {
            templateUrl: 'templates/account.html',
            controller: 'accountController'
          }
        }
      })
      .state('app.location', {
        url: '/location',
        views: {
          'menuContent': {
            templateUrl: 'templates/location.html',
            controller: 'locationController'
          }
        }
      })
      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller: 'settingsController'
          }
        }
      });
    /*  .state('app.single', {
     url: '/playlists/:playlistId',
     views: {
     'menuContent': {
     templateUrl: 'templates/playlist.html',
     controller: 'PlaylistCtrl'
     }
     }
     })*/
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/start');
  });


