'use strict';

angular.module('sphere.devHeader', [
])
.directive('spDevHeader', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/header.html',
    scope: {},
    link: function () {
      /*scope.$watch(function () { return UserService.getIsAuthenticated(); }, function (auth) {
        scope.isAuthenticated = auth;
        if (auth) {
          scope.user = UserService.getUserInfo();
          console.log('User: ', scope.user);
        }
      });*/
    }
  };

});