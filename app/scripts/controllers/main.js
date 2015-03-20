'use strict';

angular.module('developersApp')
.controller('MainCtrl', function ($scope, $rootScope, $routeParams, $location, $timeout, anchorScroll, LocalStorageService) {

  $scope.isLoading = true;

  $scope.isAuthenticated = false;

  $scope.showBetaMessage = false;

  $scope.page = $location.$$path.split('/')[0] || 'products';

  $rootScope.userInfo = angular.extend({}, $rootScope.basicUserSettings, true);

  $rootScope.userInfo.pallet = LocalStorageService.get('pallet') || $rootScope.userInfo.pallet;

  $scope.userPublishers = [];

  $scope.userCategories = [];

  $scope.contentOnly = $location.search().contentOnly ? true : false;

  $scope.widgetReqIdx = $location.search().widgetReqIdx ? $location.search().widgetIdx : 0;

  $scope.formOpen = false;
  $scope.btnHovered = false;
  $scope.showThanks = false;
  $scope.thanksMsg = 'Thank you for applying!';
  $rootScope.userInfo = {
    pallet: 'green'
  };

  /*$scope.submitRequest = function () {
    var form = $scope.requestApi;
    if (form.$valid) {
      var params = {
        fromEmail: form.email.$viewValue,
        subject: 'Request for Sphere API',
        content: 'Name: ' + form.name.$viewValue + ' ' + form.surname.$viewValue + '; Company: ' + form.company.$viewValue + '; Title: ' + form.title.$viewValue + '; Sphere username: ' + form.username.$viewValue + '; Comments: ' + form.comments.$viewValue
      };

      UserService.contact(params).then(function(result) {
        if(!result.data.success) {
          $scope.thanksMsg = result.msg;
        }
        else {
          $scope.showThanks = true;
        }
        $timeout(function () {
          $scope.formOpen = false;
          $scope.showThanks = false;
          $scope.requestApi.$setPristine();
          $scope.requestApi.email = null;
          $scope.requestApi.name = null;
          $scope.requestApi.surname = null;
          $scope.requestApi.company = null;
          $scope.requestApi.title = null;
          $scope.requestApi.username = null;
          $scope.requestApi.comments = null;
          anchorScroll.scrollTo('page-header');

          if(!$scope.$$phase) {
            $scope.$apply();
          }
        }, 3000);
      });
    }
  };*/

  //$scope.isAuthenticated = UserService.getIsAuthenticated();

  /*$scope.mergeUserInfo = function() {
    var info = UserService.getUserInfo();
    for(var prop in info) {
       if(!info[prop]) {
         info[prop] = $rootScope.userInfo[prop];
       }
    }
    return info;
  };*/

  /*$scope.authChanged = function() {
    $scope.isAuthenticated = UserService.getIsAuthenticated();
    $rootScope.userInfo = $scope.mergeUserInfo();
    $scope.isLoading = false;
    console.log('User is authenticated: ', $scope.isAuthenticated);

    if(!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  };*/

  $scope.getShortName = function() {
    var shortName = 'you';
    if($scope.userInfo.name) {
      shortName = $scope.userInfo.name.match(/\b\w/g).join('').toLowerCase();
      if(shortName.length > 1) {
        shortName = shortName.substring(0,1);
      }
    }
    return shortName;
  };

  /*$scope.setPallet = function(color) {
    $rootScope.userInfo.pallet = color;
    UserService.saveUserInfo({
      pallet: color
    });

    if(!$rootScope.$$phase) {
      $rootScope.$apply();
    }
  };*/

  /*UserService.getUserInfoRequest().then(function() {
    $scope.isLoading = false;
  });*/

  $scope.$on('loggedIn', function() {
    $scope.authChanged();

    // Save pallet property in LS for fast loading
    LocalStorageService.set('pallet', $rootScope.userInfo.pallet);
  });

  $scope.$on('loggedOut', function() {
    $scope.authChanged();
    $rootScope.userInfo = angular.extend({}, $rootScope.basicUserSettings, true);

    // Removing pallet property from local storage
    LocalStorageService.remove('pallet');

    // Redirecting back to profile page
    if($scope.page === 'profile') {
      $location.path('/profile');
    }
  });
});