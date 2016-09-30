var FILENAME = "textToSpeech.js:";
gcalarm.service('textToSpeech', ['$translate', function ($translate) {
  var OBJECTNAME = "googleEvent:";

  this.playBlankText = function () {
    var METHODNAME = "playBlankText:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    TTS.speak({
      text: " ",
      rate: 0.90,
      locale: $translate.instant("locale.textToSpeech")
    }, function () {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "TTS talk is successfully");
      //alert('success');
    }, function (error) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(error));
    });
  };

  this.playText = function (text) {
    var METHODNAME = "playText:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    TTS.speak({
      text: text,
      rate: 0.90,
      locale: $translate.instant("locale.textToSpeech")
    }, function () {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "TTS talk is successfully");

    }, function (error) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(error));
    });
  };
  this.playTextThenNextFeature = function (message, text) {
    var METHODNAME = "playTextThenNextFeature:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    TTS.speak({
      text: text,
      rate: 0.90,
      locale: $translate.instant("locale.textToSpeech")
    }, function () {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "TTS talk is successfully");
      console.info(FILENAME + OBJECTNAME + METHODNAME + "sending message" + message);

    }, function (error) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(error));
    });

  };
}]);
