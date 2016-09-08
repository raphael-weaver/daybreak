(function ($ionicPlatform, tmhDynamicLocale, $translate, $cordovaGlobalization,
           availableLanguages, $rootScope, defaultLanguage, $locale) {

  function applyLanguage(language) {
    tmhDynamicLocale.set(language.toLowerCase());
  }

  function getSuitableLanguage(language) {
    for (var index = 0; index < availableLanguages.length; index++) {
      if (availableLanguages[index].toLowerCase() === language.toLocaleLowerCase()) {
        return availableLanguages[index];
      }
    }
    return defaultLanguage;
  }

  function setLanguage() {
    if (typeof navigator.globalization !== "undefined") {
      $cordovaGlobalization.getPreferredLanguage().then(function (result) {
        var language = getSuitableLanguage(result.value);
        applyLanguage(language);
        $translate.use(language);
      });
    } else {
      applyLanguage(defaultLanguage);
    }
  }

  function getGlobalizationPreferredLanguage() {
    $cordovaGlobalization.getPreferredLanguage().then(function (result) {
      var language = getSuitableLanguage(result.value);
      return language;
    });
  }

  function isLocaleEnglish() {
    return getGlobalizationPreferredLanguage() == "en";
  }
});
