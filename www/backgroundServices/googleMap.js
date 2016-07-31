//Module(Service)
gcalarm.service('googleMap', ['locationService', 'textToSpeech', function(locationService, textToSpeech) {
  var gcalarmdb = window.openDatabase('gcalarm', '1.0', 'GCAlarm DB', 2 * 1024 * 1024);

  var location       = {home:"",work:""};
  var avoidTolls     = true;
  var avoidHighways  = false;
  var transitOptions = "";
  var drivingOptions = "";

  this.getCommuteTime = function() {

    var defer = $.Deferred();
    var duration = "";
    var homeLocation = locationService.getHomeLocation();
    $.when(homeLocation).done(function(data) {
      if(typeof data != "undefined"){
        location.home = data;
      }
      var workLocation = locationService.getWorkLocation();
      $.when(workLocation).done(function(data) {
        if(typeof data != "undefined"){
          location.work = data;
        }
        if(location.home != "" & location.work != "") {
          getDuration();
        }
        else{
          if(location.home == ""){
            textToSpeech.playText("Please add a home location to get commute time");
          }
          if(location.work == ""){
            textToSpeech.playText("Please add a work location to get cumut time");
          }
        }
      });
    });

    function getDuration() {
      var service = new google.maps.DistanceMatrixService;
      service.getDistanceMatrix(
        {
          origins: [location.home],
          destinations: [location.work],
          travelMode: google.maps.TravelMode.DRIVING,
          /*transitOptions: TransitOptions,
          drivingOptions: DrivingOptions,*/
          unitSystem: google.maps.UnitSystem.METRIC,
          avoidHighways: avoidHighways,
          avoidTolls: avoidTolls,
        },getDistanceMatrixCallback);
    }
    function getDistanceMatrixCallback(response, status) {
      if (status == google.maps.DistanceMatrixStatus.OK) {
        var results = response.rows[0].elements;
        var element = results[0];
        duration = element.duration.text;
        defer.resolve(duration);
      }
    }
    return defer.promise();
  };
}]);
