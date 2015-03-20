'use strict';

angular.module('sphere.authentication', [])
.config(function($httpProvider) {
//  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  $httpProvider.defaults.headers.post['Content-Type'] = 'text/plain';
})
.service('UserService', function ($q, $http, $rootScope, $interval, LocalStorageService) {
  var requestCanceller = $q.defer();
  var baseUrl = LocalStorageService.get('omakaseBaseUrl') || 'https://omakase.outbrain.com/Omakase/';
//  var baseUrl = 'http://omak-19001-stg-nydc1.nydc1.outbrain.com:8080/Omakase/';
//  var baseUrl = 'http://127.0.0.1:8080/Omakase/api/user';

  var isAuthenticated = false;
  var userInfo = { pallet: 'green' };
  var interval = null;

  return {

    getIsAuthenticated: function() {
      return isAuthenticated;
    },

    getUserInfo: function () {
      return userInfo;
    },

    getUserInfoRequest: function() {
      var me = this;
      var url = baseUrl + 'api/user/info';
      var request = $http.get(url, { timeout: requestCanceller.promise, withCredentials: true });

      request.then(function(result) {
        if(result.data.success) {
          isAuthenticated = true;
          userInfo = result.data.data;
          $rootScope.$broadcast('loggedIn');

          if(interval) {
            $interval.cancel(interval);
            interval = null;
          }
        }
        else {
          isAuthenticated = false;
          if(!LocalStorageService.getItem('notFirstTime')) {
            me.tryToReLogin();
          }
        }
        $rootScope.$broadcast('authChanged');
      });

      return request;
    },

    saveUserInfo: function(info) {
      var url = baseUrl + 'api/user/info';
      var request = $http.post(url, info, {
        timeout: requestCanceller.promise,
        withCredentials: true
      });

      return request;
    },

    tryToReLogin: function() {
      var me = this;

      interval = $interval(function() {
        me.getUserInfoRequest();
      }, 5000);
    },

    login: function (username, password, rememberMe, captcha) {
      var me = this;
      var url = baseUrl + 'j_spring_security_check';
      var params = 'j_username=' + encodeURIComponent(username) + '&j_password=' + password + '&_spring_security_remember_me=true';
      if (captcha) {
        params += '&captchaValue=' + captcha.captchaValue + '&captchaImage=' + captcha.captchaImage;
      }
      
      var request = $http.post(url, params, { timeout: requestCanceller.promise, withCredentials: true, headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }});

      request.then(function(result) {
        if(result.data.success) {
          me.getUserInfoRequest();
        }
      });

      return request;
    },

    logout: function () {
      var url = baseUrl + 'logout';
      var request = $http.get(url, { timeout: requestCanceller.promise, withCredentials: true });

      request.then(function(result) {
        if(result.data.success) {
          isAuthenticated = false;
          userInfo = {};
          // Trigger a logged out event on Main Controller
          $rootScope.$broadcast('authChanged');
        }
      });

      return request;
    },

    register: function(params) {
      var me = this;
      var url = baseUrl + 'api/account/register';
      var request = $http.post(url, params, {
        timeout: requestCanceller.promise,
        withCredentials: true,
        headers: {
        'Content-Type': 'text/plain'
        }
      });

      request.then(function(result) {
        if(result.data.success) {
          me.login(params.email, params.password);
        }
      });

      return request;
    },

    inviteFriends: function(params) {
      var url = baseUrl + 'api/user/invite';
      var request = $http.post(url, params, {
        timeout: requestCanceller.promise,
        withCredentials: true,
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      return request;
    },

    contact: function(params) {
      var url = baseUrl + 'api/user/contact';
      var request = $http.post(url, params, {
        timeout: requestCanceller.promise,
        withCredentials: true,
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      return request;
    },

    forgotPassword: function(params) {
      var url = baseUrl + 'api/account/forgotPassword';
      var request = $http.post(url, params, {
        timeout: requestCanceller.promise,
        withCredentials: true,
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      return request;
    },

    abort: function () {
      if(requestCanceller) {
        requestCanceller.resolve();
      }
      return this;
    }
  };
});