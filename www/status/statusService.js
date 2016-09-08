var FILENAME = "statusService.js:";
gcalarm.service('statusService', ['$cordovaCamera', '$localStorage', '$translate', function($cordovaCamera, $localStorage, $translate) {
  var OBJECTNAME = "statusService:";

  var gcalarmdb = window.openDatabase('gcalarm', '1.0', 'GCAlarm DB', 2 * 1024 * 1024);

  this.getNotificationTime = function () {
    var METHODNAME = "getNotificationTime:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    var notificationTime = {"weekdayNotification":new Date().getHours()*60*60,"weekendNotification":new Date().getHours()*60*60};
    console.info(FILENAME + OBJECTNAME + METHODNAME + "notificationTime=" + notificationTime);

    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS NOTIFICATIONTIME (notificationType TEXT, notificationName TEXT, notificationTime INTEGER)');
      tx.executeSql("SELECT * FROM NOTIFICATIONTIME WHERE notificationType = ?", ["WEEKDAY"], function (tx, resultSet) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "notification weekday from db" + resultSet.rows.length);

        if(resultSet.rows.length > 0) {
          notificationTime.weekdayNotification = resultSet.rows.item(0).notificationTime;
        }
      }, function (tx, error) {
        console.log('SELECT error: ' + error.message);
      });
      tx.executeSql("SELECT * FROM NOTIFICATIONTIME WHERE notificationType = ?", ["WEEKEND"], function (tx, resultSet) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "notification weekend from db" + resultSet.rows.length);

        if(resultSet.rows.length > 0) {
          notificationTime.weekendNotification = resultSet.rows.item(0).notificationTime;
        }
      }, function (tx, error) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + 'SELECT error: ' + error.message);
      });
      defer.resolve(notificationTime);
    }, function (error) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + 'transaction error: ' + error.message);
    }, function () {
      console.info(FILENAME + OBJECTNAME + METHODNAME + 'transaction ok');
    });
    return defer.promise();
  };
  this.saveWeekdayNotificationTime = function (notificationTime) {
    var METHODNAME = "saveWeekdayNotificationTime:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    console.info(FILENAME + OBJECTNAME + METHODNAME + "inserting notification weekday");
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS NOTIFICATIONTIME (notificationType TEXT, notificationName TEXT, notificationTime INTEGER)');

      tx.executeSql('DELETE FROM NOTIFICATIONTIME WHERE notificationType = ?', ['WEEKDAY']);
      tx.executeSql('INSERT INTO NOTIFICATIONTIME (notificationType, notificationName, notificationTime) VALUES (?,?,?)', ['WEEKDAY', 'DEFAULT', notificationTime]);
    });
    defer.resolve(notificationTime);

    return defer.promise();
  };
  this.saveWeekendNotificationTime = function (notificationTime) {
    var METHODNAME = "saveWeekendNotificationTime:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    console.info(FILENAME + OBJECTNAME + METHODNAME + "inserting notification weekend");
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS NOTIFICATIONTIME (notificationType TEXT, notificationName TEXT, notificationTime INTEGER)');

      tx.executeSql('DELETE FROM NOTIFICATIONTIME WHERE notificationType = ?', ['WEEKEND']);
      tx.executeSql('INSERT INTO NOTIFICATIONTIME (notificationType, notificationName, notificationTime) VALUES (?,?,?)', ['WEEKEND', 'DEFAULT', notificationTime]);
    });
    defer.resolve(notificationTime);

    return defer.promise();
  };


  this.setBackgroundImage = function () {
    var METHODNAME = "setBackgroundImage:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    var options = {
      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: window.innerWidth,
      targetHeight: window.innerHeight,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function (imageData) {
      console.info(FILENAME + OBJECTNAME + METHODNAME + "retrieved picture from mobile device");

      console.debug(FILENAME + OBJECTNAME + METHODNAME + "retrieved picture from device");
      var imageUri = "data:image/jpeg;base64," + imageData;

      $localStorage["imageUri"] = imageUri;
      console.info(FILENAME + OBJECTNAME + METHODNAME + "set device to background image" + imageUri);
      setCSSBackgroundImage(imageUri);

      defer.resolve(imageUri);

    });
    return defer.promise();
  };
  this.setExistingBackgroundImage = function (){
    var METHODNAME = "setExistingBackgroundImage:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    var imageUri = "";
    if($localStorage["imageUri"]) {
      imageUri = $localStorage["imageUri"];
      setCSSBackgroundImage(imageUri);
    }
    defer.resolve(imageUri);

    return defer.promise();
  };

  function setCSSBackgroundImage(imageUri){
    var METHODNAME = "setCSSBackgroundImage:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    $('.pane').css('background-image', 'url(' + imageUri + ')');
    $('.pane').css('background-repeat', 'no-repeat');
    $('.pane').css('background-attachment', 'fixed');
    $('.pane').css('background-position', 'center');
  }
}]);
