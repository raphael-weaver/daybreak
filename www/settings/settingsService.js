var FILENAME = "settingsService.js:";
gcalarm.service('settingsService', ['$ionicPlatform', '$locale', '$translate', function ($ionicPlatform, $locale, $translate) {
  var OBJECTNAME = "settingsService:";

  var gcalarmdb = window.openDatabase('gcalarm', '1.0', 'GCAlarm DB', 2 * 1024 * 1024);

  this.getDaySettings = function (settingsWeekdayList, settingsWeekendList) {
    var METHODNAME = "getDaySettings:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);
    var defer = $.Deferred();
    var settingsDaysList = [];
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS DAY (day TEXT, isOn BOOLEAN)');
      tx.executeSql("SELECT * FROM DAY", [], function (tx, resultSet) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "size of day from db" + resultSet.rows.length);

        if (resultSet.rows.length > 0) {
          var settingsWeekdayList = [];
          var settingsWeekendList = [];
          for (var counter = 0; counter < resultSet.rows.length; counter++) {
            settingsDaysList.push({
              text: resultSet.rows.item(counter).day,
              checked: (resultSet.rows.item(counter).isOn).bool()
            });
          }
          defer.resolve({
            "settingsWeekdayList": settingsDaysList.filter(isWeekday),
            "settingsWeekendList": settingsDaysList.filter(isWeekend)
          });
        }
        else {
          settingsDaysList = [
            {text: $locale.DATETIME_FORMATS.SHORTDAY[0].toString().toLowerCase(), checked: false},
            {text: $locale.DATETIME_FORMATS.SHORTDAY[1].toString().toLowerCase(), checked: false},
            {text: $locale.DATETIME_FORMATS.SHORTDAY[2].toString().toLowerCase(), checked: false},
            {text: $locale.DATETIME_FORMATS.SHORTDAY[3].toString().toLowerCase(), checked: false},
            {text: $locale.DATETIME_FORMATS.SHORTDAY[4].toString().toLowerCase(), checked: false},
            {text: $locale.DATETIME_FORMATS.SHORTDAY[5].toString().toLowerCase(), checked: false},
            {text: $locale.DATETIME_FORMATS.SHORTDAY[6].toString().toLowerCase(), checked: false}
          ];
          defer.resolve({
            "settingsWeekdayList": settingsDaysList.filter(isWeekday),
            "settingsWeekendList": settingsDaysList.filter(isWeekend)
          });
        }
      }, function (tx, error) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + 'SELECT error: ' + error.message);
      });
    }, function (error) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + 'transaction error: ' + error.message);
    }, function () {
      console.log(FILENAME + OBJECTNAME + METHODNAME + 'transaction ok');
    });
    return defer.promise();
  };
  this.getWeekdayFeatureSettings = function (settingsWeekdayFeaturesList) {
    var METHODNAME = "getWeekdayFeatureSettings:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS FEATURE (featureType TEXT, feature TEXT, isOn BOOLEAN)');
      tx.executeSql("SELECT * FROM FEATURE WHERE featureType = ?", ["WEEKDAY"], function (tx, resultSet) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "size of feature weekday from db" + resultSet.rows.length);

        var settingsWeekdayFeaturesList = [];
        if (resultSet.rows.length > 0) {
          for (var counter = 0; counter < resultSet.rows.length; counter++) {
            settingsWeekdayFeaturesList.push({
              text: resultSet.rows.item(counter).feature,
              checked: (resultSet.rows.item(counter).isOn).bool()
            });
          }
          defer.resolve(settingsWeekdayFeaturesList);
        }
        else {
          settingsWeekdayFeaturesList = [
            {text: $translate.instant("feature.googleTasks"), checked: false},
            {text: $translate.instant("feature.weather"), checked: false},
            {text: $translate.instant("feature.commuteTime"), checked: false},
            {text: $translate.instant("feature.horoscope"), checked: false},
            {text: $translate.instant("feature.inspirationalQuote"), checked: false},
            {text: $translate.instant("feature.bibleVerse"), checked: false}
          ];
          defer.resolve(settingsWeekdayFeaturesList);
        }
      }, function (tx, error) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + 'SELECT error: ' + error.message);
      });
    });
    return defer.promise();
  };
  this.getWeekendFeatureSettings = function (settingsWeekendFeatures) {
    var METHODNAME = "getWeekendFeatureSettings:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS FEATURE (featureType TEXT, feature TEXT, isOn BOOLEAN)');
      tx.executeSql("SELECT * FROM FEATURE WHERE featureType = ?", ["WEEKEND"], function (tx, resultSet) {
        var settingsWeekendFeaturesList = [];
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "size of feature weekend from db" + resultSet.rows.length);

        if (resultSet.rows.length > 0) {
          for (var counter = 0; counter < resultSet.rows.length; counter++) {
            settingsWeekendFeaturesList.push({
              text: resultSet.rows.item(counter).feature, checked: (resultSet.rows.item(counter).isOn).bool()
            });
          }
          defer.resolve(settingsWeekendFeaturesList);
        }
        else {
          settingsWeekendFeaturesList = [
            {text: $translate.instant("feature.googleTasks"), checked: false},
            {text: $translate.instant("feature.weather"), checked: false},
            {text: $translate.instant("feature.commuteTime"), checked: false},
            {text: $translate.instant("feature.horoscope"), checked: false},
            {text: $translate.instant("feature.inspirationalQuote"), checked: false},
            {text: $translate.instant("feature.bibleVerse"), checked: false}
          ];
          defer.resolve(settingsWeekendFeaturesList);
        }
      }, function (tx, error) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + 'SELECT error: ' + error.message);
      });
    }, function (error) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + 'transaction error: ' + error.message);
    }, function () {
      console.info('transaction ok');
    });
    return defer.promise();
  };
  this.getOtherSettingsBuzzWeekday = function () {
    var METHODNAME = "getOtherSettingsBuzzWeekday:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS OTHERSETTING (otherSettingType TEXT, otherSettingName TEXT, otherSettingValue TEXT)');
      tx.executeSql("SELECT * FROM OTHERSETTING WHERE otherSettingType = ? AND otherSettingName = ?", ["BUZZ", "WEEKDAY"], function (tx, resultSet) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "size of otherSetting weekday from db" + resultSet.rows.length);
        if (resultSet.rows.length > 0) {
          var isChecked = (resultSet.rows.item(0).otherSettingValue).bool();
          defer.resolve(isChecked);
        }
        else {
          defer.resolve(false);
        }
      }, function (tx, error) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + 'SELECT error: ' + error.message);
      });
    }, function (error) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + 'transaction error: ' + error.message);
    }, function () {
      console.info(FILENAME + OBJECTNAME + METHODNAME + 'transaction ok');
    });
    return defer.promise();
  };
  this.getOtherSettingsBuzzWeekend = function () {
    var METHODNAME = "getOtherSettingsBuzzWeekend:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS OTHERSETTING (otherSettingType TEXT, otherSettingName TEXT, otherSettingValue TEXT)');
      tx.executeSql("SELECT * FROM OTHERSETTING WHERE otherSettingType = ? AND otherSettingName = ?", ["BUZZ", "WEEKEND"], function (tx, resultSet) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + "size of otherSetting weekend from db" + resultSet.rows.length);
        if (resultSet.rows.length > 0) {
          var isChecked = (resultSet.rows.item(0).otherSettingValue).bool();
          defer.resolve(isChecked);
        }
        else {
          defer.resolve(false);
        }
      }, function (tx, error) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + 'SELECT error: ' + error.message);
      });
    }, function (error) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + 'transaction error: ' + error.message);
    }, function () {
      console.info(FILENAME + OBJECTNAME + METHODNAME + 'transaction ok');
    });
    return defer.promise();
  };
  this.getOtherSettingsHoroscopeList = function (horoscopeList) {
    var METHODNAME = "getOtherSettingsHoroscopeList:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS OTHERSETTING (otherSettingType TEXT, otherSettingName TEXT, otherSettingValue TEXT)');
      tx.executeSql("SELECT * FROM OTHERSETTING WHERE otherSettingType = ?", ["HOROSCOPE"], function (tx, resultSet) {
        var horoscopeList = [];

        console.debug(FILENAME + OBJECTNAME + METHODNAME + "size of horoscope list from db" + resultSet.rows.length);

        if (resultSet.rows.length > 0) {
          for (var counter = 0; counter < resultSet.rows.length; counter++) {
            horoscopeList.push({
              id: counter,
              sign: resultSet.rows.item(counter).otherSettingName,
              selected: (resultSet.rows.item(counter).otherSettingValue).bool()
            });
          }
          defer.resolve(horoscopeList);
        }
        else {
          horoscopeList = [
            {"id": 0, "sign": $translate.instant("horoscope.sign.Aries"), "selected": false},
            {"id": 1, "sign": $translate.instant("horoscope.sign.Taurus"), "selected": false},
            {"id": 2, "sign": $translate.instant("horoscope.sign.Gemini"), "selected": false},
            {"id": 3, "sign": $translate.instant("horoscope.sign.Cancer"), "selected": false},
            {"id": 4, "sign": $translate.instant("horoscope.sign.Leo"), "selected": false},
            {"id": 5, "sign": $translate.instant("horoscope.sign.Virgo"), "selected": false},
            {"id": 6, "sign": $translate.instant("horoscope.sign.Libra"), "selected": false},
            {"id": 7, "sign": $translate.instant("horoscope.sign.Scorpio"), "selected": false},
            {"id": 8, "sign": $translate.instant("horoscope.sign.Sagittarius"), "selected": false},
            {"id": 9, "sign": $translate.instant("horoscope.sign.Capricorn"), "selected": false},
            {"id": 10, "sign": $translate.instant("horoscope.sign.Aquarius"), "selected": false},
            {"id": 11, "sign": $translate.instant("horoscope.sign.Pisces"), "selected": false}
          ];
          defer.resolve(horoscopeList);
        }
      }, function (tx, error) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + 'SELECT error: ' + error.message);
      });
    }, function (error) {
      console.error(FILENAME + OBJECTNAME + METHODNAME + 'transaction error: ' + error.message);
    }, function () {
      console.info(FILENAME + OBJECTNAME + METHODNAME + 'transaction ok');
    });
    return defer.promise();
  };
  this.saveDays = function (settingsWeekdayList, settingsWeekendList) {
    var METHODNAME = "saveDays:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    console.info(FILENAME + OBJECTNAME + METHODNAME + "inserting days");
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('DROP TABLE DAY', []);
      tx.executeSql('CREATE TABLE IF NOT EXISTS DAY (day TEXT, isOn TEXT)');

      for (var counter = 0; counter < settingsWeekdayList.length; counter++) {
        var day = settingsWeekdayList[counter].text;
        var isOn = settingsWeekdayList[counter].checked;
        tx.executeSql('INSERT INTO DAY (day, isOn) VALUES (?,?)', [$locale.DATETIME_FORMATS.SHORTDAY[counter], isOn]);
      }
      for (var counter = 0; counter < settingsWeekendList.length; counter++) {
        var day = settingsWeekendList[counter].text;
        var isOn = settingsWeekendList[counter].checked;
        tx.executeSql('INSERT INTO DAY (day, isOn) VALUES (?,?)', [$locale.DATETIME_FORMATS.SHORTDAY[counter], isOn]);
      }
    });

    defer.resolve(true);
    return defer.promise();
  };

  this.saveFeatures = function (settingsWeekdayFeaturesList, settingsWeekendFeaturesList) {
    var METHODNAME = "saveFeatures:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    console.info(FILENAME + OBJECTNAME + METHODNAME + "inserting features");
    gcalarmdb.transaction(function (tx) {
      tx.executeSql('DROP TABLE FEATURE', []);
      tx.executeSql('CREATE TABLE IF NOT EXISTS FEATURE (featureType TEXT, feature TEXT, isOn TEXT)');

      for (var counter = 0; counter < settingsWeekdayFeaturesList.length; counter++) {
        var feature = settingsWeekdayFeaturesList[counter].text;
        var isOn = settingsWeekdayFeaturesList[counter].checked;
        tx.executeSql('INSERT INTO FEATURE (featureType, feature, isOn) VALUES (?,?,?)', ["WEEKDAY", feature, isOn]);
      }

      for (var counter = 0; counter < settingsWeekendFeaturesList.length; counter++) {
        var feature = settingsWeekendFeaturesList[counter].text;
        var isOn = settingsWeekendFeaturesList[counter].checked;
        tx.executeSql('INSERT INTO FEATURE (featureType, feature, isOn) VALUES (?,?,?)', ["WEEKEND", feature, isOn]);
      }
    });

    defer.resolve(true);
    return defer.promise();
  };

  this.saveOtherSettings = function (buzzSetting, horoscopeSign, horoscopeSelected) {
    var METHODNAME = "saveOtherSettings:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var defer = $.Deferred();

    console.info(FILENAME + OBJECTNAME + METHODNAME + "inserting other settings");

    gcalarmdb.transaction(function (tx) {
      tx.executeSql('DROP TABLE OTHERSETTING', []);
      tx.executeSql('CREATE TABLE IF NOT EXISTS OTHERSETTING (otherSettingType TEXT, otherSettingName TEXT, otherSettingValue TEXT)');
      tx.executeSql('INSERT INTO OTHERSETTING (otherSettingType, otherSettingName, otherSettingValue) VALUES (?,?,?)', ["BUZZ", "WEEKDAY", buzzSetting.weekday.checked]);
      tx.executeSql('INSERT INTO OTHERSETTING (otherSettingType, otherSettingName, otherSettingValue) VALUES (?,?,?)', ["BUZZ", "WEEKEND", buzzSetting.weekend.checked]);
      for (var counter = 0; counter < horoscopeSign.length; counter++) {
        var sign = horoscopeSign[counter].sign;
        var selected = horoscopeSign[counter].selected;
        tx.executeSql('INSERT INTO OTHERSETTING (otherSettingType, otherSettingName, otherSettingValue) VALUES (?,?,?)', ["HOROSCOPE", sign, (horoscopeSelected == sign)]);
      }
    });

    defer.resolve(true);
    return defer.promise();
  };

  function isWeekday(days) {
    var METHODNAME = "isWeekday:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var weekdayList = [$locale.DATETIME_FORMATS.SHORTDAY[1].toString().toLowerCase(), $locale.DATETIME_FORMATS.SHORTDAY[2].toString().toLowerCase(), $locale.DATETIME_FORMATS.SHORTDAY[3].toString().toLowerCase(), $locale.DATETIME_FORMATS.SHORTDAY[4].toString().toLowerCase(), $locale.DATETIME_FORMATS.SHORTDAY[5].toString().toLowerCase()];

    return ($.inArray(days.text, weekdayList)) > -1;
  }

  function isWeekend(days) {
    var METHODNAME = "isWeekend:";
    console.info(FILENAME + OBJECTNAME + METHODNAME);

    var weekendList = [$locale.DATETIME_FORMATS.SHORTDAY[6].toString().toLowerCase(), $locale.DATETIME_FORMATS.SHORTDAY[0].toString().toLowerCase()];
    return ($.inArray(days.text, weekendList)) > -1;
  }

}]);
