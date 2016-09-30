var FILENAME = "horoscope.js:";
gcalarm.service('horoscope', ['$http', '$translate', 'translator', 'localization', function($http, $translate, translator, localization) {
  var OBJECTNAME = "horoscope:";

  var dailyHoroscope = "";
  var description = "";

  this.getDailyHoroscope = function(horoscopeObject) {
    var METHODNAME = "getDailyHoroscope:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    var horoscope = astrologycomHoroscope(horoscopeObject);
    $.when(horoscope).done(function(data) {
      if(typeof data != "undefined"){
        dailyHoroscope = data;
        var promise = localization.isLocaleEnglish();
        promise.then(function (isLocaleEnglish) {
          if (!isLocaleEnglish) {
            console.info(FILENAME + OBJECTNAME + METHODNAME + "calling translator to translate horoscope");
            var translation = translator.getTranslation(dailyHoroscope);
            $.when(translation).done(function (data) {
              if (typeof data != "undefined") {
                dailyHoroscope = data;

                console.debug(FILENAME + OBJECTNAME + METHODNAME + data);
                console.info(FILENAME + OBJECTNAME + METHODNAME + "horoscope retrieved successfully");

                defer.resolve(dailyHoroscope);
              }
            });
          }
          else {
            defer.resolve(dailyHoroscope);
          }
        });
      }
    });

    return defer.promise();
  };

  function astrologycomHoroscope (horoscopeObject){
    var METHODNAME = "astrologycomHoroscope:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    var http = $http({
      url: 'http://www.astrology.com/horoscopes/daily-horoscope.rss',
      method: 'GET'
    });
    http.then(function (data) {
      var x2JS = new X2JS();

      dailyHoroscope = x2JS.xml2js(data.data);

      console.debug(FILENAME + OBJECTNAME + METHODNAME + data);
      console.info(FILENAME + OBJECTNAME + METHODNAME + "retrieved successfully return for horoscope");
      //TODO get horoscope from user and replace number with horoscope type number
      console.debug(FILENAME + OBJECTNAME + METHODNAME + "starting to parse the response from astrology.com");
      description = (dailyHoroscope.rss.channel.item[horoscopeObject.id].description).toString();
      var descriptionStartPosition = description.indexOf("<p>") + 3;
      var descriptionEndPosition = description.indexOf("</p>");

      description = description.slice(descriptionStartPosition,descriptionEndPosition);
      description = description.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
      console.debug(FILENAME + OBJECTNAME + METHODNAME + "ending to parse the response from astrology.com");
      defer.resolve(description);
    }, function errorCallback(response) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(response));
    });
    return defer.promise();
  }

  function findyourfatecomHoroscope (horoscopeObject){
    var METHODNAME = "findyourfatecomHoroscope:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    var http = $http({
      url: 'http://www.findyourfate.com/rss/dailyhoroscope-feed.asp',
      method: 'GET',
      params: {
        sign: horoscopeObject.sign
      }
    });
    http.then(function (data) {
      var x2JS = new X2JS();

      console.info(FILENAME + OBJECTNAME + METHODNAME + "horoscope data returned successfully");
      console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(data));

      dailyHoroscope = x2JS.xml2js(data.data);

      description = (dailyHoroscope.rss.channel.item.description).toString();
      defer.resolve(description);
    }, function errorCallback(response) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(response));
    });
    return defer.promise();
  }

}]);
