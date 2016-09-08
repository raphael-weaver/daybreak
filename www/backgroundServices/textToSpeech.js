var FILENAME = "textToSpeech.js:";
gcalarm.service('textToSpeech', ['$translate', function ($translate) {
  var OBJECTNAME = "googleEvent:";

  this.playText = function (text) {
    var METHODNAME = "playText:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

      TTS.speak({
        text: text,
        locale: $translate("locale.textToSpeech")
      }, function () {
        console.info(FILENAME + OBJECTNAME + METHODNAME + "TTS talk is successfully");
        //alert('success');
      }, function (error) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(error));
      });
  };
  this.playTextThenNextFeature = function (message, text) {
    var METHODNAME = "playTextThenNextFeature:";

    console.info(FILENAME + OBJECTNAME + METHODNAME);

    TTS.speak({
      text: text,
      locale: $translate("locale.textToSpeech")
    }, function () {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "TTS talk is successfully");
      //alert('success');
      console.info(FILENAME + OBJECTNAME  + METHODNAME + "sending message" + message);
      lsbridge.send(message, {message: ''});
    }, function (error) {
      console.debug(FILENAME + OBJECTNAME + METHODNAME + JSON.stringify(error));
    });
  };
}]);
