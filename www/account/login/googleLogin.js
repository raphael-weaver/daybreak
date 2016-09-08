var apiKey       = 'AIzaSyDpM5h0ACAk91h6clwvjU7Au94pkvkQ4BE';
var clientId     = '674271502244-s7bdlo86hv8nmsbda8n4ga68h2rjolfo.apps.googleusercontent.com';
var clientSecret = 'T6Qpifuzw0gkwPcdUfMiCMZ4';

var FILENAME = "googleLogin.js:";

gcalarm.factory('timeStorage', ['$localStorage', function ($localStorage) {
  var OBJECTNAME = "timeStorage:";

  var timeStorage = {};
  timeStorage.cleanUp = function () {
    var METHODNAME = "cleanUP:";

    var cur_time = new Date().getTime();
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key.indexOf('_expire') === -1) {
        var new_key = key + "_expire";
        var value = localStorage.getItem(new_key);
        if (value && cur_time > value) {
          localStorage.removeItem(key);
          localStorage.removeItem(new_key);
          console.info(FILENAME + OBJECTNAME + METHODNAME + "keys removed");
        }
      }
    }
  };
  timeStorage.remove = function (key) {
    var METHODNAME = "remove:";

    this.cleanUp();
    var time_key = key + '_expire';
    $localStorage[key] = false;
    $localStorage[time_key] = false;
    console.debug(FILENAME + OBJECTNAME + METHODNAME + "removed key " + time_key);
  };
  timeStorage.set = function (key, data, hours) {
    var METHODNAME = "set:";

    this.cleanUp();
    $localStorage[key] = data;
    var time_key = key + '_expire';
    var time = new Date().getTime();
    time = time + (hours * 1 * 60 * 60 * 1000);
    $localStorage[time_key] = time;

    console.debug(FILENAME + OBJECTNAME + METHODNAME + "set key " + time_key);
  };
  timeStorage.get = function (key) {
    var METHODNAME = "get:";

    this.cleanUp();
    var time_key = key + "_expire";
    if (!$localStorage[time_key]) {
      return false;
    }
    var expire = $localStorage[time_key] * 1;
    if (new Date().getTime() > expire) {
      $localStorage[key] = null;
      $localStorage[time_key] = null;
      return false;
    }
    console.debug(FILENAME + OBJECTNAME + METHODNAME + "get key= " + key + "returned key=" + $localStorage[key]);
    return $localStorage[key];

  };
  return timeStorage;
}]);


gcalarm.factory('googleLoginService', [
  '$http', '$q', '$interval', '$log', 'timeStorage',
  function ($http, $q, $interval, $log, timeStorage) {
    var OBJECTNAME = "googleLoginService:";
    var service = {};
    service.access_token = false;
    service.redirect_url = 'http://localhost/callback';
    service.api_key = apiKey;
    service.client_id = clientId;
    service.secret = clientSecret;
    service.scope = 'https://www.googleapis.com/auth/calendar.readonly';

    service.gulp = function (url, name) {
      var METHODNAME = "gulp: ";
      url = url.substring(url.indexOf('?') + 1, url.length);

      console.info(FILENAME + OBJECTNAME + METHODNAME);
      return url.replace('code=', '');

    };
    service.authorize = function () {
      var METHODNAME = "authorize:";

      var def = $q.defer();
      var self = this;

      var access_token = timeStorage.get('google_access_token');
      if (access_token) {
        console.info(FILENAME + OBJECTNAME + METHODNAME + 'Direct Access Token :' + access_token);
        var authorizeData = {accessToken:access_token,apiKey:self.api_key,def:def};

        def.resolve(authorizeData);
      } else {
        var params = 'client_id=' + encodeURIComponent(self.client_id);
        params += '&redirect_uri=' + encodeURIComponent(self.redirect_url);
        params += '&response_type=code';
        params += '&scope=' + encodeURIComponent(self.scope);
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + params;

        var win = window.open(authUrl, '_blank', 'location=no,toolbar=no,width=800, height=800');
        var context = this;

        if (ionic.Platform.isWebView()) {
          console.info(FILENAME + OBJECTNAME + METHODNAME + 'using in app browser');
          win.addEventListener('loadstart', function (data) {
            console.info(FILENAME + OBJECTNAME + METHODNAME + 'load start');
            if (data.url.indexOf(context.redirect_url) === 0) {
              console.debug(FILENAME + OBJECTNAME + METHODNAME + 'redirect url found ' + context.redirect_url);
              console.debug(FILENAME + OBJECTNAME + METHODNAME + 'window url found ' + data.url);
              win.close();
              var url = data.url;
              var access_code = context.gulp(url, 'code');
              if (access_code) {
                context.validateToken(access_code, def);
              } else {
                def.reject({error: 'Access Code Not Found'});
              }
            }

          });
        } else {
          console.info(FILENAME + OBJECTNAME + METHODNAME + 'InAppBrowser not found11');
          var pollTimer = $interval(function () {
            try {
              console.debug("google window url " + win.document.URL);
              if (win.document.URL.indexOf(context.redirect_url) === 0) {
                console.info(FILENAME + OBJECTNAME + METHODNAME + 'redirect url found');
                win.close();
                $interval.cancel(pollTimer);
                pollTimer = false;
                var url = win.document.URL;
                console.debug(FILENAME + OBJECTNAME + METHODNAME + 'Final URL ' + url);
                var access_code = context.gulp(url, 'code');
                if (access_code) {
                  console.debug(FILENAME + OBJECTNAME + METHODNAME + 'Access Code: ' + access_code);
                  context.validateToken(access_code, def);
                } else {
                  console.error(FILENAME + OBJECTNAME + METHODNAME + 'Access Code Not Found');
                  def.reject({error: 'Access Code Not Found'});
                }
              }
            } catch (e) {
            }
          }, 100);
        }
      }
      console.info(FILENAME + OBJECTNAME + METHODNAME);
      return def.promise;
    };
    service.validateToken = function (token, def) {
      var METHODNAME = "validateToken:";

      console.debug(FILENAME + OBJECTNAME + METHODNAME + 'Code: ' + token);
      var http = $http({
        url: 'https://www.googleapis.com/oauth2/v3/token',
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        params: {
          code: token,
          client_id: this.client_id,
          client_secret: this.secret,
          redirect_uri: this.redirect_url,
          grant_type: 'authorization_code',
          scope: ''
        }
      });
      var context = this;
      http.then(function (data) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + data);
        var access_token = data.data.access_token;
        var expires_in = data.data.expires_in;
        expires_in = expires_in * 1 / (60 * 60);
        timeStorage.set('google_access_token', access_token, expires_in);
        if (access_token) {
          console.info(FILENAME + OBJECTNAME + METHODNAME + 'Access Token :' + access_token);
          var authorizeData = {accessToken:access_token,apiKey:context.api_key,def:def};
          def.resolve(authorizeData);
        } else {
          console.error(FILENAME + OBJECTNAME + METHODNAME + 'Access Token Not Found');
          def.reject({error: 'Access Token Not Found'});
        }
      });

      console.info(FILENAME + OBJECTNAME + METHODNAME);
      return def.promise;
    };
    service.getUserInfo = function (access_token, def) {
      var METHODNAME = "getUserInfo:";

      var http = $http({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
        method: 'GET',
        params: {
          access_token: access_token
        }
      });
      http.then(function (data) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + data);
        var user_data = data.data;
        var user = {
          name: user_data.name,
          gender: user_data.gender,
          email: user_data.email,
          google_id: user_data.sub,
          picture: user_data.picture,
          profile: user_data.profile
        };
        def.resolve(user);
      });

      console.info(FILENAME + OBJECTNAME + METHODNAME);
    };
    service.getUserFriends = function () {
      var METHODNAME = "getUserFriends:";

      var access_token = this.access_token;
      var http = $http({
        url: 'https://www.googleapis.com/plus/v1/people/me/people/visible',
        method: 'GET',
        params: {
          access_token: access_token
        }
      });
      http.then(function (data) {
        console.debug(FILENAME + OBJECTNAME + METHODNAME + data);
      });

      console.info(FILENAME + OBJECTNAME + METHODNAME);
    };
    service.startLogin = function () {
      var METHODNAME = "startLogin:";

      var def = $q.defer();
      var promise = this.authorize({
        client_id: this.client_id,
        client_secret: this.secret,
        redirect_uri: this.redirect_url,
        scope: this.scope
      });
      promise.then(function (data) {
        def.resolve(data);
      }, function (data) {
        console.error(FILENAME + OBJECTNAME + METHODNAME + data);
        def.reject(data.error);
      });
      return def.promise;
    };
    service.checkIfLoggedIn = function () {
      var METHODNAME = "checkIfLoggedIn:";

      var def = $q.defer();
      var access_token = timeStorage.get('google_access_token');
      if (access_token) {
        def.resolve(true);
      } else {
        def.resolve(false);
      }
      console.info(FILENAME + OBJECTNAME + METHODNAME);
      return def.promise;
    };
    service.logOut = function () {
      var METHODNAME = "logOut:";

      var defer = $.Deferred();
      timeStorage.remove('google_access_token');
      var isLoggedOut = true;
      defer.resolve(isLoggedOut);

      console.info(FILENAME + OBJECTNAME + METHODNAME + "isLoggedOut=" + isLoggedOut);
      return defer.promise;
    };
    return service;
  }
]);
