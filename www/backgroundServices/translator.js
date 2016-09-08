var FILENAME = "translator.js:";
gcalarm.service('translator',['$http', '$translate', function($http, $translate) {
  var OBJECTNAME = "translator:";

  var translatedText = "";

  this.getTranslation = function(text) {
    var METHODNAME = "getTranslation:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    var key = 'trnsl.1.1.20160813T120024Z.cc0ff5387971c002.4980c9eec95af21b8373d6f38d9a2c3c14821b36';

    var http = $http({
      url: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
      method: 'GET',
      params: {
        key: key,
        text: text,
        lang: $translate("locale.translator")
      }
    });
    http.then(function (data) {
      console.info(FILENAME + OBJECTNAME + METHODNAME);
      console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(data));
      translatedText = data.data.text;
      defer.resolve(translatedText);
    }, function error(errorResponse) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(errorResponse));
    });
    return defer.promise();
  };
}]);
