//Model
var NotificationModel = (function(){
  function NotificationModel(){
    var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
    this.id       = 0;
    this.title    = "";
    this.text     = ""; // "Duration 1h",
    this.firstAt  = ""; // monday_9_am,
    this.every    = ""; // "week",
    this.sound    = sound; // "file://sounds/reminder.mp3",
    this.icon     = ""; // "http://icons.com/?cal_id=1",
    this.data     = {}; // { meetingId:"123#fg8" }
  }
  return NotificationModel;
})();

//Module(Service)
gcalarm.service('notification', function() {

  // Schedule notification for tomorrow to remember about the meeting
  cordova.plugins.notification.local.schedule(
    constructJSONString()
  );

  // Join BBM Meeting when user has clicked on the notification
  cordova.plugins.notification.local.on("click", function (notification) {
  });

  // Notification has reached its trigger time (Tomorrow at 8:45 AM)
  cordova.plugins.notification.local.on("trigger", function (notification) {
  });

  var notifications = [];

  this.getNotifications = function() {
    deconstructJSONString(retrieveNotificationJSONString());
  };
  this.setNotification = function() {
    saveJSONString();
  };

  function constructJSONString(){
    var jsonString = "[";
    for (var index = 0; index < notifications.length; index++) {

      jsonString += "{";
      jsonString += "id:'" + notifications[index].id + "',";
      jsonString += "title:'" + notifications[index].title + "',";
      jsonString += "text:'" + notifications[index].text + "',";
      jsonString += "firstAt:'" + notifications[index].firstAt + "',";
      jsonString += "every:'" + notifications[index].every + "',";
      jsonString += "sound:'" + notifications[index].sound + "',";
      jsonString += "icon:'" + notifications[index].icon + "',";
      jsonString += "data:''";
      jsonString += "}";

      if((index + 1) != notifications.length){
        jsonString += ",";
      }
    }
    jsonString += "]";

    return jsonString;
  }
  function deconstructJSONString(jsonString){
    var notifications = JSON.parse(jsonString);
  }
  function saveJSONString(){
    gcalarmDB.transaction(function(tx) {
      var notificationJSONString = constructJSONString();
      tx.executeSql('INSERT INTO NOTIFICATION VALUES (?)', [notificationJSONString], function(tx, resultSet) {
        console.log('resultSet.insertId: ' + resultSet.insertId);
        console.log('resultSet.rowsAffected: ' + resultSet.rowsAffected);
      }, function(tx, error) {
        tx.executeSql('CREATE TABLE NOTIFICATION (notificationJSONString)');
        console.log('INSERT error: ' + error.message);
      });
    }, function(error) {
      console.log('transaction error: ' + error.message);
    }, function() {
      console.log('transaction ok');
    });
  }
  function retrieveNotificationJSONString(){
    gcalarmDB.transaction(function(tx) {
      tx.executeSql("SELECT * FROM NOTIFICATION;", [], function (tx, resultSet) {
        return resultSet.rows.item(0).notificationJSONString;
      }, function(tx, error) {
        tx.executeSql('CREATE TABLE NOTIFICATION (notificationJSONString)');
        return "";
      });
    }, function(error) {
      console.log('transaction error: ' + error.message);
    }, function() {
      console.log('transaction ok');
    });
  }

});
