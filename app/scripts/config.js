'use strict';

angular.module('developersApp')
.value('duScrollOffset', 100)
.run(function ($log, $anchorScroll, $rootScope, UserService, LocalStorageService) {
  $anchorScroll.yOffset = 120;
  $rootScope.isAuthenticated = false;
  $rootScope.basicUserSettings = {
    name: '',
    gender: 'u',
    birthday: {
      day: null,
      month: null,
      year: null
    },
    location: {
      country: 'USA',
      state: 'New York'
    },
    weather: {
      unit: 'f'
    },
    pallet: 'green'
  };

  $rootScope.state = {
    current: 'home',
    changing: false
  };

  $rootScope.$on('$stateChangeStart', function () {
    $rootScope.state.changing = true;
  });

  $rootScope.$on('$stateChangeSuccess', function (e, toState) {
    $rootScope.state.changing = false;

    $rootScope.state.current = toState.name;
  });

  $rootScope.authChanged = function() {
    $rootScope.isAuthenticated = UserService.getIsAuthenticated();
    $rootScope.userInfo = $rootScope.mergeUserInfo();
    $rootScope.userInfo.pallet = 'green';

    if(!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  };

  $rootScope.mergeUserInfo = function() {
    var info = UserService.getUserInfo();
    /*for(var prop in info) {
       if(!info[prop]) {
         info[prop] = $rootScope.userInfo[prop];
       }
    }*/
    return info;
  };

  $rootScope.$on('loggedIn', function() {
    $rootScope.authChanged();

    // Save pallet property in LS for fast loading
    LocalStorageService.set('pallet', $rootScope.userInfo.pallet);
  });

  $rootScope.$on('loggedOut', function() {
    $rootScope.authChanged();
    $rootScope.userInfo = angular.extend({}, $rootScope.basicUserSettings, true);

    // Removing pallet property from local storage
    LocalStorageService.remove('pallet');
  });

  UserService.getUserInfoRequest();
})
.config(function ($stateProvider, $urlRouterProvider, $logProvider, $locationProvider) {
  var debugEnabled = false,
    resolve = {},
    states = {};

  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === 'ppdlcjobiakaooocnfcdplpgddhgbpbi') {
    debugEnabled = true;
  }

  //$locationProvider.html5Mode(!debugEnabled);

  // Define resolve object
  resolve = {
    docs: ['$http', '$q', function ($http, $q) {
      var deferred = $q.defer();


      $http.get('/docs/bower_components/sphere-documentation/README.md')
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function (data) {
        console.log('Error retrieving docs');
        deferred.resolve(data);
      });

      return deferred.promise;
    }],
    swagger: ['$http', '$q', function ($http, $q) {
      var deferred = $q.defer();


      $http.get('/docs/bower_components/sphere-documentation/swagger.json')
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function (data) {
        console.log('Error retrieving swagger file');
        deferred.resolve(data);
      });

      return deferred.promise;
    }]
  };

  $urlRouterProvider.otherwise('/');

  // Define states
  states = {
    home: {
      name: 'home',
      url: '/',
      controller: 'MainCtrl',
      templateUrl: 'views/main.html'
    },
    docs: {
      name: 'docs',
      url: '/docs',
      controller: 'DocsCtrl',
      templateUrl: 'views/docs.html',
      resolve: {
        Document: resolve.docs,
        Swagger: resolve.swagger
      }
    }
  };
  //$locationProvider.html5Mode(false);

  // Inject states into the state provider
  angular.forEach(states, function (state) {
    $stateProvider.state(state);
  });
});