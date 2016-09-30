var FILENAME = "bibleVerse.js:";
gcalarm.service('bibleVerse',['$http', '$translate', 'localization', function($http, $translate, localization) {
  var OBJECTNAME = "bibleVerse:";

  var bibleVerse;

  this.getBibleVerse = function() {
    var METHODNAME = "getBibleVerse:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    var bibleVerseData = callBibleVerseApi();
    $.when(bibleVerseData).done(function (data1) {
      if (typeof data1 != "undefined") {
        //TODO change to check for locale
        var promise = localization.isLocaleEnglish();
        promise.then(function (isLocaleEnglish) {
          if (!isLocaleEnglish) {
            var bibleVerseLocaleData = callLocaleBibleVerseApi(data1.reference);
            $.when(bibleVerseLocaleData).done(function (data) {
              var bibleVerseLocale = {"text": "", "reference": ""};
              if (typeof data != "undefined") {
                console.info(FILENAME + OBJECTNAME + METHODNAME + "bible verse data received successfully");

                bibleVerseLocale.text = data;
                bibleVerseLocale.reference = data1.reference;

                console.debug(FILENAME + OBJECTNAME + METHODNAME + "bible text " + JSON.stringify(bibleVerseLocale));
                defer.resolve(bibleVerseLocale);
              }
            });
          }
          else {
            console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(bibleVerse));
            defer.resolve(bibleVerse);
          }
        });
      }
    });
    return defer.promise();
  };

  function callBibleVerseApi(){
    var METHODNAME = "callBibleVerseApi:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    var http = $http({
      url: 'http://www.ourmanna.com/verses/api/get/?',
      method: 'GET',
      params: {
        format:"json",
        order:"random"
      }
    });
    http.then(function (data) {
      bibleVerse = data.data.verse.details;

      //TODO change to check for locale
      if(localization.isLocaleEnglish()){
        bibleVerse.reference = bibleVerse.reference.replace(":", " ").replace("-", " ");
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "bible object " + JSON.stringify(bibleVerse));
      }
      defer.resolve(bibleVerse);
    }, function errorCallback(response) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(response));
    });
    return defer.promise();
  }

  function callLocaleBibleVerseApi(bibleVerseReference){
    var METHODNAME = "callLocaleBibleVerseApi:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    //TODO have to map lang with bible version
    var locale = "en";
    var http = $http({
      url: 'https://getbible.net/json',
      method: 'GET',
      dataType: 'jsonp',
      jsonp: 'getbible',
      params: {
        passage:bibleVerseReference,
        translation:$translate.instant("bibleTranslation")
      }
    });
    http.then(function (data) {
      console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(data));

      var dataJSONString = JSON.stringify(data.data).replace(/\\/g, "");
      var verseStartPosition = dataJSONString.lastIndexOf('"verse":') + 8;
      var verseEndPosition = dataJSONString.indexOf("}", verseStartPosition);
      bibleVerse =  dataJSONString.slice(verseStartPosition,verseEndPosition);

      console.info(FILENAME + OBJECTNAME + METHODNAME + "bible verse text " + bibleVerse);

      defer.resolve(bibleVerse);
    }, function errorCallback(errorResponse) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(errorResponse));
    });
    return defer.promise();
  }

}]);
