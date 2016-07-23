gcalarm.service('locationService', function() {
  var gcalarmdb = window.openDatabase('gcalarm', '1.0', 'GCAlarm DB', 2 * 1024 * 1024);

  var location= {home:"",work:""};

  this.getHomeLocation = function () {

    var defer = $.Deferred();
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS LOCATION (locationType TEXT, address TEXT, lat INTEGER, long INTEGER)');
      tx.executeSql("SELECT * FROM LOCATION WHERE locationType = ?", ["HOME"], function (tx, resultSet) {
        if(resultSet.rows.length > 0) {
          location.home = resultSet.rows.item(0).address;
          defer.resolve(location.home);
        }
      }, function (tx, error) {
        console.log('SELECT error: ' + error.message);
      });
    }, function (error) {
      console.log('transaction error: ' + error.message);
    }, function () {
      console.log('transaction ok');
    });
    return defer.promise();
  };
  this.getWorkLocation = function () {

    var defer = $.Deferred();
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS LOCATION (locationType TEXT, address TEXT, lat INTEGER, long INTEGER)');
      tx.executeSql("SELECT * FROM LOCATION WHERE locationType = ?", ["WORK"], function (tx, resultSet) {
        if(resultSet.rows.length > 0) {
          location.work = resultSet.rows.item(0).address;
          defer.resolve(location.work);
        }
      }, function (tx, error) {
        console.log('SELECT error: ' + error.message);
      });
    }, function (error) {
      console.log('transaction error: ' + error.message);
    }, function () {
      console.log('transaction ok');
    });
    return defer.promise();
  };
  this.saveLocations = function (location) {

    gcalarmdb.transaction(function (tx) {
      tx.executeSql('DROP TABLE LOCATION', []);
      tx.executeSql('CREATE TABLE IF NOT EXISTS LOCATION (locationType TEXT, address TEXT, lat INTEGER, long INTEGER)');
    });

    var homeCoordinates =  {latitude:"",longitude:""};
    homeCoordinates =getHomeLatLongCoordinates(location.home);
    $.when(homeCoordinates).done(function(data) {
      gcalarmdb.transaction(function (tx) {
        tx.executeSql('INSERT INTO LOCATION (locationType, address, lat, long) VALUES (?,?,?,?)',
          ['HOME', location.home, data.latitude, data.longitude]);
      });
    });

    var workCoordinates =  {latitude:"",longitude:""};
    workCoordinates = getWorkLatLongCoordinates(location.work);
    $.when(workCoordinates).done(function(data) {
      gcalarmdb.transaction(function (tx) {
        tx.executeSql('INSERT INTO LOCATION (locationType, address, lat, long) VALUES (?,?,?,?)',
          ['WORK', location.work, data.latitude, data.longitude]);
      });
    });

  };

  function getHomeLatLongCoordinates(homeLocation){

    var coordinates = {latitude:"",longitude:""};
    var geocoder = new google.maps.Geocoder();

    var defer = $.Deferred();
    geocoder.geocode({
      address: homeLocation
    },function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        coordinates.latitude = results[0].geometry.location.lat();
        coordinates.longitude = results[0].geometry.location.lng();
        defer.resolve(coordinates);
      }
    });
    return defer.promise();
  }

  function getWorkLatLongCoordinates(workLocation) {

    var coordinates = {latitude:"",longitude:""};
    var geocoder = new google.maps.Geocoder();

    var defer = $.Deferred();
    geocoder.geocode({
      address: workLocation
    },function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          coordinates.latitude = results[0].geometry.location.lat();
          coordinates.longitude = results[0].geometry.location.lng();
          defer.resolve(coordinates);
        }
    });
    return defer.promise();
  }
});
