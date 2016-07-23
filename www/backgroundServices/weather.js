//Model
var WeatherModel = (function(){
  function WeatherModel(){
    this.minTemperature = 0;
    this.maxTemperature = 0;
    this.precipitation  = 0;
  }
  return WeatherModel;
})();
var LocationModel = (function(){
  function LocationModel(){
    this.latitude = 0;
    this.longitude = 0;
  }
  return LocationModel;
})();
//Module(Service)
gcalarm.service('weather', function() {

  this.getTodaysWeather = function(date) {
    getWeatherByDate(date, getHomeLocation());
  };

  this.getWeather = function() {
    getWeatherByDate(new Date(), getHomeLocation());
  };

  function getWeatherByDate(date, homeLocation){

    var x2js = new X2JS();

    var url = "http://graphical.weather.gov/xml/SOAP_server/ndfdXMLclient.php?";

    var minDateTime = date;
    minDateTime.setHours(0);
    minDateTime.setMinutes(0);
    minDateTime.setSeconds(0);

    var maxDateTime = date;
    maxDateTime.setHours(23);
    maxDateTime.setMinutes(59);
    maxDateTime.setSeconds(59);

    var locationModel = getLatLong();

    var params =
    {
      whichClient:"NDFDgen",
      lat:locationModel.latitude,
      lon:locationModel.longitude,
      begin:minDateTime,
      end:maxDateTime,
      product:"time-series",
      maxt:"maxt",
      mint:"mint",
      qpf:"qpf",
      Submit:"Submit"
    };
    var paramsStr = $.param( params );

    var weatherModel = WeatherModel();

    $.ajax({
      type: "GET",
      url : url + paramsStr,
      dataType:"xml",
      cache: false,
      error:function (xhr, ajaxOptions, thrownError){
        debugger;
        alert(xhr.statusText);
        alert(thrownError);
      },
      success : function(xml) {

        var json = x2js.xml2js(xml);

        weatherModel.minTemperature = json.dwml.data.parameters.temperature[0].value.toString();
        weatherModel.maxTemperature = json.dwml.data.parameters.temperature[1].value.toString();
        weatherModel.precipitation  = json.dwml.data.parameters.probability-of-precipitation.value.toString();

      }
    });
  }

  function getHomeLocation() {
    gcalarmDB.transaction(function (tx) {
      tx.executeSql("SELECT * FROM LOCATION;", [], function (tx, resultSet) {
        fromLocation = resultSet.rows.item(0).fromLocation;
        toLocation = resultSet.rows.item(0).toLocation;

        return fromLocation;
      }, function (tx, error) {
        tx.executeSql('CREATE TABLE LOCATION (fromLocation, toLocation)');
        return "";
      });
    }, function (error) {
      console.log('transaction error: ' + error.message);
    }, function () {
      console.log('transaction ok');
    });
  }

  function getLatLong() {
    var location = new LocationModel();

    geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'address': getHomeLocation()}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        location.latitude  = results[0].geometry.location.lat();
        location.longitude = results[0].geometry.location.lng();
      }

      else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });

    return location;
  }

});
