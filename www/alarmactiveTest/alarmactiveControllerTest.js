gcalarm.controller('alarmactiveControllerTest', ['$scope', 'alarmactiveService', 'googleMap', 'googleEvent', 'weather', 'textToSpeech', 'bibleVerse', 'horoscope', 'quote', '$ionicModal', '$timeout', '$ionicPopup', function($scope, alarmactiveService, googleMap, googleEvent, weather, textToSpeech, bibleVerse, horoscope, quote, $ionicModal, $timeout, $ionicPopup) {

  // Triggered on a button click, or some other target
  $scope.sayBibleVerseTest = function() {
    var bibleVerseData = bibleVerse.getBibleVerse();
    $.when(bibleVerseData).done(function(data) {
      if(typeof data != "undefined"){
        textToSpeech.playText("Your bible verse for today is " + data.text + " " + data.reference);
      }
    });
  };
  // Triggered on a button click, or some other target
  $scope.sayHoroscopeTest = function() {
     var dailyHoroscope = horoscope.getDailyHoroscope();
     $.when(dailyHoroscope).done(function(data) {
       if(typeof data != "undefined"){
         textToSpeech.playText("Your horoscope for today is " + data);
       }
     });
  };
  // Triggered on a button click, or some other target
  $scope.sayCommuteTimeTest = function() {
    var commuteTime = googleMap.getCommuteTime();
    $.when(commuteTime).done(function(data) {
      if(typeof data != "undefined"){
        textToSpeech.playText("Current commute time to work is" + data);
      }
    });
  };
  // Triggered on a button click, or some other target
  $scope.sayInspirationalQuoteTest = function() {
    var quoteData = quote.getInspirationalQuote();
    $.when(quoteData).done(function(data) {
      if(typeof data != "undefined"){
        textToSpeech.playText("Inspirational quote for today is " + data.quoteText + " by " + data.quoteAuthor);
      }
    });
  };
  // Triggered on a button click, or some other target
  $scope.sayWeatherTest = function() {
    var weatherStatus = weather.getWeather();
    $.when(weatherStatus).done(function(data) {
      if(typeof data != "undefined"){
        textToSpeech.playText("Current weather for today is" + data);
      }
    });
  };
  // Triggered on a button click, or some other target
  $scope.sayGoogleEventsTest = function() {
    var eventList = googleEvent.getTodaysEvents();
    $.when(eventList).done(function(data) {
      if(typeof data != "undefined"){
        textToSpeech.playText("Google calender task for the day");
        for (var i = 0; i < data.length; i++) {
          var event = data[i];

          var eventStartDatetime = new Date(event.start.dateTime);
          var eventEndDatetime = new Date(event.end.dateTime);

          var eventStart = eventStartDatetime.getTimeAMPMFormat().hour + " " + eventStartDatetime.getTimeAMPMFormat().minute + " " + eventStartDatetime.getTimeAMPMFormat().ampm;
          var eventEnd = eventEndDatetime.getTimeAMPMFormat().hour + " " + eventEndDatetime.getTimeAMPMFormat().minute + " " + eventEndDatetime.getTimeAMPMFormat().ampm;

          textToSpeech.playText(event.summary + " starts at " + eventStart  + " and is schedule to end at " + eventEnd);
        }
      }
    });
  };
}]);
