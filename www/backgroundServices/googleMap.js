//Module(Service)
gcalarm.service('googleMap', function() {
  this.getCommuteTime = function() {
    var fromLocation;
    var toLocation;

    var duration = "";

    gcalarmDB.transaction(function(tx) {
      tx.executeSql("SELECT * FROM LOCATION;", [], function (tx, resultSet) {
        fromLocation =  resultSet.rows.item(0).fromLocation;
        toLocation =  resultSet.rows.item(0).toLocation;
      }, function(tx, error) {
        tx.executeSql('CREATE TABLE LOCATION (fromLocation, toLocation)');
        return "";
      });
    }, function(error) {
      console.log('transaction error: ' + error.message);
    }, function() {
      console.log('transaction ok');
    });

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [fromLocation],
        destinations: [toLocation],
        travelMode: google.maps.TravelMode.DRIVING,
        transitOptions: TransitOptions,
        drivingOptions: DrivingOptions,
        unitSystem: UnitSystem,
        avoidHighways: Boolean,
        avoidTolls: Boolean,
      }, getDistanceMatrixCallback);

    function getDistanceMatrixCallback(response, status) {
      if (status == google.maps.DistanceMatrixStatus.OK) {
        var results = response.rows[0].elements;
        var element = results[0];
        duration = element.duration.text;
      }
    }

    return duration;
  };
});
