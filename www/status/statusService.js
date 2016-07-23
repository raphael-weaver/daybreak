gcalarm.service('statusService', function() {
  var gcalarmdb = window.openDatabase('gcalarm', '1.0', 'GCAlarm DB', 2 * 1024 * 1024);
  this.getNotificationTime = function () {
    var notificationTime = new Date().getHours()*60*60;
    var defer = $.Deferred();
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS NOTIFICATIONTIME (notificationName TEXT, notificationTime INTEGER)');
      tx.executeSql("SELECT * FROM NOTIFICATIONTIME", [], function (tx, resultSet) {
        if(resultSet.rows.length > 0) {
          notificationTime = resultSet.rows.item(0).notificationTime;
        }
        defer.resolve(notificationTime);
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
  this.saveNotificationTime = function (notificationTime) {
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('DROP TABLE NOTIFICATIONTIME', []);
      tx.executeSql('CREATE TABLE IF NOT EXISTS NOTIFICATIONTIME (notificationName TEXT, notificationTime INTEGER)');
      tx.executeSql('INSERT INTO NOTIFICATIONTIME (notificationName, notificationTime) VALUES (?,?)', ['DEFAULT', notificationTime]);
    });
  }
});
