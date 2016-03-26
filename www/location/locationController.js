/*var geocoder = new google.maps.Geocoder();
geocoder.geocode({
  address: addressFromEventHandler
}, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    q.resolve(results);
  } else {
    q.reject();
  }
});

 scope.locationChanged = function (address) {
 geocoder.geocode({
 address: address
 }, function(results, status) {
 if (status == google.maps.GeocoderStatus.OK) {
 scope.data.latitude = results[0].geometry.location.lat();
 scope.data.longitude = results[0].geometry.location.lng();
 map.setCenter(results[0].geometry.location);
 marker.setPosition(results[0].geometry.location);
 if (options.fitBounds) {
 map.fitBounds(results[0].geometry.viewport);
 }
 }
 });
 };
*/

