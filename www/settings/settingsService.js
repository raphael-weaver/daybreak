gcalarm.service('settingsService', function() {
  var gcalarmdb = window.openDatabase('gcalarm', '1.0', 'GCAlarm DB', 2 * 1024 * 1024);
  this.getDaySettings= function (settingsDaysList) {
    var defer = $.Deferred();
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS DAY (day TEXT, isOn BOOLEAN)');
      tx.executeSql("SELECT * FROM DAY", [], function (tx, resultSet) {
        if(resultSet.rows.length > 0) {
          var settingsDaysList = [];
          for(var counter = 0; counter < resultSet.rows.length; counter++){
            settingsDaysList.push({text:resultSet.rows.item(counter).day, checked:(resultSet.rows.item(counter).isOn).bool()});
          }
          defer.resolve(settingsDaysList);
        }
        else{
          settingsDaysList = [
            { text: "Mon", checked: false },
            { text: "Tue", checked: false },
            { text: "Wed", checked: false },
            { text: "Thu", checked: false },
            { text: "Fri", checked: false },
            { text: "Sat", checked: false },
            { text: "Sun", checked: false }
          ];
          defer.resolve(settingsDaysList);
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
  this.getFeatureSettings= function (settingsFeaturesList) {
    var defer = $.Deferred();
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS FEATURE (feature TEXT, isOn BOOLEAN)');
      tx.executeSql("SELECT * FROM FEATURE", [], function (tx, resultSet) {
        if(resultSet.rows.length > 0) {
          var settingsFeaturesList = [];
          for(var counter = 0; counter < resultSet.rows.length; counter++){
            settingsFeaturesList.push({text:resultSet.rows.item(counter).feature, checked:(resultSet.rows.item(counter).isOn).bool()});
          }
          defer.resolve(settingsFeaturesList);
        }
        else {
          settingsFeaturesList = [
            {text: "Google Tasks", checked: false},
            {text: "Weather", checked: false},
            {text: "Commute Time", checked: false}
          ];
          defer.resolve(settingsFeaturesList);
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
  this.saveDays = function (settingsDaysList) {
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('DROP TABLE DAY', []);
      tx.executeSql('CREATE TABLE IF NOT EXISTS DAY (day TEXT, isOn TEXT)');

      for (var counter = 0; counter < settingsDaysList.length; counter++) {
        var day = settingsDaysList[counter].text;
        var isOn = settingsDaysList[counter].checked;
        tx.executeSql('INSERT INTO DAY (day, isOn) VALUES (?,?)', [day, isOn]);
      }
    });
  };

  this.saveFeatures = function (settingsFeaturesList) {
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('DROP TABLE FEATURE', []);
      tx.executeSql('CREATE TABLE IF NOT EXISTS FEATURE (feature TEXT, isOn TEXT)');

      for (var counter = 0; counter < settingsFeaturesList.length; counter++) {
          var feature = settingsFeaturesList[counter].text;
          var isOn = settingsFeaturesList[counter].checked;
          tx.executeSql('INSERT INTO FEATURE (feature, isOn) VALUES (?,?)', [feature, isOn]);
      }
    });
  }


});
