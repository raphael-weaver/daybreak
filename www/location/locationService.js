var FILENAME = "locationService.js:";
gcalarm.service('locationService', ['$translate', function($translate) {
  var OBJECTNAME = "locationService:";

  var gcalarmdb = window.openDatabase('gcalarm', '1.0', 'GCAlarm DB', 2 * 1024 * 1024);

  var location= {home:"",work:""};

  this.getHomeLocation = function () {
    var METHODNAME = "getHomeLocation:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS LOCATION (locationType TEXT, address TEXT, lat INTEGER, long INTEGER)');
      tx.executeSql("SELECT * FROM LOCATION WHERE locationType = ?", ["HOME"], function (tx, resultSet) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "size of home location from db" + resultSet.rows.length);
        if(resultSet.rows.length > 0) {
          location.home = resultSet.rows.item(0).address;
          defer.resolve(location.home);
        }
        else{
          defer.resolve(location.home);
        }
      }, function (tx, error) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + 'SELECT error: ' + error.message);
      });
    }, function (error) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + 'transaction error: ' + error.message);
    }, function () {
      console.debug(FILENAME + OBJECTNAME + METHODNAME + 'transaction ok');
    });
    return defer.promise();
  };
  this.getWorkLocation = function () {
    var METHODNAME = "getWorkLocation:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS LOCATION (locationType TEXT, address TEXT, lat INTEGER, long INTEGER)');
      tx.executeSql("SELECT * FROM LOCATION WHERE locationType = ?", ["WORK"], function (tx, resultSet) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "size of work location from db" + resultSet.rows.length);

        if(resultSet.rows.length > 0) {
          location.work = resultSet.rows.item(0).address;
          defer.resolve(location.work);
        }
        else{
          defer.resolve(location.work);
        }
      }, function (tx, error) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + 'SELECT error: ' + error.message);
      });
    }, function (error) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + 'transaction error: ' + error.message);
    }, function () {
      console.debug(FILENAME + OBJECTNAME + METHODNAME + 'transaction ok');
    });
    return defer.promise();
  };
  this.saveLocations = function (location) {
    var METHODNAME = "saveLocations:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('DROP TABLE LOCATION', []);
      tx.executeSql('CREATE TABLE IF NOT EXISTS LOCATION (locationType TEXT, address TEXT, lat INTEGER, long INTEGER)');
    });
    var homeCoordinates =  {latitude:"",longitude:""};
    homeCoordinates = getHomeLatLongCoordinates(location.home);
    $.when(homeCoordinates).done(function(data) {
      console.debug(FILENAME + OBJECTNAME + METHODNAME + "insert home location to db");
      gcalarmdb.transaction(function (tx) {
        tx.executeSql('INSERT INTO LOCATION (locationType, address, lat, long) VALUES (?,?,?,?)',
          ['HOME', location.home, data.latitude, data.longitude]);
      });
      var workCoordinates =  {latitude:"",longitude:""};
      workCoordinates = getWorkLatLongCoordinates(location.work);
      $.when(workCoordinates).done(function(data) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "insert work location to db");
        gcalarmdb.transaction(function (tx) {
          tx.executeSql('INSERT INTO LOCATION (locationType, address, lat, long) VALUES (?,?,?,?)',
            ['WORK', location.work, data.latitude, data.longitude]);
        });
      });
    });

    return defer.promise();
  };

  this.getHomeLatLongCoordinates = function (location) {
    var METHODNAME = "getHomeLatLongCoordinates:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    var homeLocation = this.getHomeLocation();
    $.when(homeLocation).done(function(data) {
      if(typeof data != "undefined") {
        var homeCoordinates = {latitude: "", longitude: ""};
        homeCoordinates = getHomeLatLongCoordinates(data);
        $.when(homeCoordinates).done(function (data) {
          if (typeof data != "undefined") {
            console.debug(FILENAME + OBJECTNAME + METHODNAME + homeCoordinates);
            defer.resolve(data);
          }
        });
      }
    });
    return defer.promise();
  };

  function getHomeLatLongCoordinates(homeLocation){
    var METHODNAME = "getHomeLatLongCoordinates:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    var coordinates = {latitude:"",longitude:""};
    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({
      address: homeLocation
    },function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        coordinates.latitude = results[0].geometry.location.lat();
        coordinates.longitude = results[0].geometry.location.lng();

        console.info(FILENAME + OBJECTNAME + METHODNAME + "home coordinates successully");
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "home coordinates=" + coordinates);

        defer.resolve(coordinates);
      }
      else{
        if(status == google.maps.GeocoderStatus.INVALID_REQUEST)
          console.error(FILENAME + OBJECTNAME + METHODNAME + "INVALID_REQUEST");
        else if(status == google.maps.GeocoderStatus.MAX_ELEMENTS_EXCEEDED){
          console.error(FILENAME + OBJECTNAME + METHODNAME + "MAX_ELEMENTS_EXCEEDED");
        }
        else if(status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
          console.error(FILENAME + OBJECTNAME + METHODNAME + "OVER_QUERY_LIMIT");
        }
        else if(status == google.maps.GeocoderStatus.REQUEST_DENIED){
          console.error(FILENAME + OBJECTNAME + METHODNAME + "REQUEST_DENIED");
        }
        else if(status == google.maps.GeocoderStatus.UNKNOWN_ERROR){
          console.error(FILENAME + OBJECTNAME + METHODNAME + "UNKNOWN_ERROR");
        }
        defer.resolve(coordinates);
      }
    });
    return defer.promise();
  }

  function getWorkLatLongCoordinates(workLocation) {
    var METHODNAME = "getWorkLatLongCoordinates:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var coordinates = {latitude:"",longitude:""};
    var geocoder = new google.maps.Geocoder();

    var defer = $.Deferred();
    geocoder.geocode({
      address: workLocation
    },function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          coordinates.latitude = results[0].geometry.location.lat();
          coordinates.longitude = results[0].geometry.location.lng();

          console.info(FILENAME + OBJECTNAME + METHODNAME + "work coordinates successully");
          console.debug(FILENAME + OBJECTNAME + METHODNAME + "work coordinates=" + coordinates);

          defer.resolve(coordinates);
        }
        else{
          if(status == google.maps.GeocoderStatus.INVALID_REQUEST)
            console.error(FILENAME + OBJECTNAME + METHODNAME + "INVALID_REQUEST");
          else if(status == google.maps.GeocoderStatus.MAX_ELEMENTS_EXCEEDED){
            console.error(FILENAME + OBJECTNAME + METHODNAME + "MAX_ELEMENTS_EXCEEDED");
          }
          else if(status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
            console.error(FILENAME + OBJECTNAME + METHODNAME + "OVER_QUERY_LIMIT");
          }
          else if(status == google.maps.GeocoderStatus.REQUEST_DENIED){
            console.error(FILENAME + OBJECTNAME + METHODNAME + "REQUEST_DENIED");
          }
          else if(status == google.maps.GeocoderStatus.UNKNOWN_ERROR){
            console.error(FILENAME + OBJECTNAME + METHODNAME + "UNKNOWN_ERROR");
          }
          defer.resolve(coordinates);
        }
    });
    return defer.promise();
  }
}]);
