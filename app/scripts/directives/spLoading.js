'use strict';
angular.module('developersApp')
.directive('spLoading', function ($log) {
  return {
    restrict: 'A',
    scope: {
      spLoading: '='
    },
    replace: true,
    templateUrl: 'views/templates/loading.html',
    link: function (scope, element) {
      scope.$watch('spLoading', function (isLoading) {
        if (isLoading) {
          element.css({'visibility': 'visible'});
        } else {
          element.css({'visibility': 'hidden'});
        }
      });
    }
  };
});