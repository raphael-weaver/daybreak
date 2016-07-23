//Module(Service)
gcalarm.service('textToSpeech', function() {
  this.playText = function(text) {
    var locale = 'en-GB';
    TTS
      .speak({
        text: text,
        locale: locale
      }, function () {
        alert('success');
      }, function (reason) {
        alert(reason);
      });
  };
});
