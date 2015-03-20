angular.module('developersApp')
.config(function ($stateProvider, $locationProvider, $logProvider) {
  var debugEnabled = false,
    resolve = {},
    states = {};

  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === 'ppdlcjobiakaooocnfcdplpgddhgbpbi') {
    debugEnabled = true;
  }

  $logProvider.debugEnabled(debugEnabled);
  $locationProvider.html5Mode(!debugEnabled);

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
      templateUrl: 'views/docs.html'
    }
  };
  
  /*$routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .when('/docs', {
      templateUrl: 'views/api/swagger.html',
      controller: 'DocsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });*/

  // Inject states into the state provider
  angular.forEach(states, function (state) {
    $stateProvider.state(state);
  });
});