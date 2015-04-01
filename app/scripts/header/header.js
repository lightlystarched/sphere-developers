'use strict';

angular.module('sphere.devHeader', [
])
.directive('spDevHeader', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/partials/header.html',
    link: function () {

      //scope.currentState = $state.current.name;
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