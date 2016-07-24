gcalarm.service('accountService', function() {

  var gcalarmdb = window.openDatabase('gcalarm', '1.0', 'GCAlarm DB', 2 * 1024 * 1024);

  this.getGoogleToken = function () {
    var defer = $.Deferred();
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS TOKEN (tokenType TEXT, token TEXT)');
      tx.executeSql("SELECT * FROM TOKEN WHERE tokenType = ?", ["GOOGLE"], function (tx, resultSet) {
        if(resultSet.rows.length > 0) {
          var googleToken = resultSet.rows.item(0).token;
          defer.resolve(googleToken);
        }
        else{
          defer.resolve("");
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

  this.saveGoogleToken = function (token) {

    gcalarmdb.transaction(function (tx) {
      tx.executeSql('DROP TABLE TOKEN', []);
      tx.executeSql('CREATE TABLE IF NOT EXISTS TOKEN (tokenType TEXT, token TEXT)');
      tx.executeSql('INSERT INTO TOKEN (tokenType, token) VALUES (?,?)', ["GOOGLE", token]);
    });

  };

});
