var FILENAME = "localization.js:";
gcalarm.service('localization', ['$ionicPlatform', '$translate', '$q', 'Constants', function ($ionicPlatform, $translate, $q, Constants) {
  var OBJECTNAME = "localization:";

  this.isLocaleEnglish = function () {
    var METHODNAME = "isLocaleEnglish:";
    var deferred = $q.defer();

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var promise = getGlobalizationPreferredLanguage();
    promise.then(function (data) {
      deferred.resolve(data == "en-US");
    });

    return deferred.promise;
  };
  function getGlobalizationPreferredLanguage() {
    var METHODNAME = "getGlobalizationPreferredLanguage:";

    var deferred = $q.defer();

    var language = "";
      navigator.globalization.getPreferredLanguage(
      function (result) {
        console.info(FILENAME + OBJECTNAME + METHODNAME + "preferred language" + result.value);

        language = getSuitableLanguage(result.value);
        deferred.resolve(language);
      },
      function () {
        console.error(FILENAME + OBJECTNAME + METHODNAME + 'Error getting language\n');
      }
    );
    return deferred.promise;
  }

  function setLanguage() {
    var METHODNAME = "setLanguage:";
    if (typeof navigator.globalization !== "undefined") {
      navigator.globalization.getPreferredLanguage(
        function (result) {
          console.info(FILENAME + OBJECTNAME + METHODNAME + "preferred language" + result.value);
          var language = getSuitableLanguage(result.value);

          applyLanguage(language);
          $translate.use(language);
          $translate.refresh(language);
        },
        function () {
          console.error(FILENAME + OBJECTNAME + METHODNAME + 'Error getting language\n');
        }
      );
    }
    else {
      applyLanguage(Constants.defaultLanguage);
    }
  }

  function applyLanguage(language) {
    var METHODNAME = "applyLanguage:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    tmhDynamicLocale.set(language.toLowerCase());
  }

  function getSuitableLanguage(language) {
    var METHODNAME = "getSuitableLanguage:";

    for (var key in Constants.availableLanguages) {
      if (Constants.availableLanguages.hasOwnProperty(key)) {
        if (Constants.availableLanguages[key].toLowerCase() === language.toLocaleLowerCase()) {
          return Constants.availableLanguages[key];
        }
      }
    }

    return Constants.defaultLanguage;
  }
}]);
