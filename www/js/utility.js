var FILENAME = "utility.js:";

var ACTIVENOTIFICATIONID = 0;
String.prototype.bool = function() {
  var METHODNAME = "String.bool:";
  console.info(FILENAME + METHODNAME);

  return (/^true$/i).test(this);
};
String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toLowerCase() + this.slice(1);
}
String.prototype.isEmpty = function() {
  var METHODNAME = "String.isEmpty:";
  console.info(FILENAME + METHODNAME);

  return (this.length === 0 || !this.trim());
};
Date.prototype.getTimeAMPMFormat = function(){
  var METHODNAME = "Date.getTimeAMPMFormat:";
  console.info(FILENAME + METHODNAME);

  var time = {hour:"",minute:"",ampm:""};

  var hour = this.getHours();
  var minute = this.getMinutes();
  var ampm = hour >= 12 ? 'p m' : 'a m';

  if(hour > 12){
    time.hour = hour - 12;
  }
  else{
    time.hour = hour;
  }
  time.minute = minute;
  time.ampm = ampm;

  return time;
}
function xmlObjectToXmlString(xmlObject) {
  var METHODNAME = "xmlObjectToXmlString:";
  console.info(FILENAME + METHODNAME);

  var xmlString;
  //IE
  if (window.ActiveXObject){
    xmlString = xmlObject.xml;
  }
  // code for Mozilla, Firefox, Opera, etc.
  else{
    xmlString = (new XMLSerializer()).serializeToString(xmlObject);
  }
  return xmlString;
}
showToast = function (text) {
  var METHODNAME = "showToast:";
  console.info(FILENAME + METHODNAME);


  setTimeout(function () {
    if (device.platform != 'windows') {
      window.plugins.toast.showShortBottom(text);
    } else {
      showDialog(text);
    }
  }, 100);
};
showDialog = function (text) {
  var METHODNAME = "showDialog:";
  console.info(FILENAME + METHODNAME);


  if (dialog) {
    dialog.content = text;
    return;
  }
  dialog = new Windows.UI.Popups.MessageDialog(text);
  dialog.showAsync().done(function () {
    dialog = null;
  });
};
