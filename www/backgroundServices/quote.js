var FILENAME = "quote.js:";
gcalarm.service('quote',['$http', '$translate', function($http, $translate) {
  var OBJECTNAME = "quote:";

  var quote = "";

  this.getInspirationalQuote = function() {
    var METHODNAME = "getInspirationalQuote:";

     var defer = $.Deferred();
// TODO use translator other locale than en and ru
     var http = $http({
     url: 'http://api.forismatic.com/api/1.0/?',
     method: 'GET',
     params: {
        method: "getQuote",
        format: "json",
        lang:$translate("locale.quote")
     }
     });
     http.then(function (data) {
       console.info(FILENAME + OBJECTNAME + METHODNAME + "retrieved data for quotes");
       console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(data));

       quote = data.data;

       console.info(FILENAME + OBJECTNAME + METHODNAME + "starting to parse data return");

       quote.quoteText = quote.quoteText.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

       console.info(FILENAME + OBJECTNAME + METHODNAME + "ending parse data return");

       defer.resolve(quote);
     }, function errorCallback(response) {
       console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(response));
     });
     return defer.promise();
  };

}]);
