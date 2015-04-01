'use strict';

angular.module('developersApp')
.directive('spDevFooter', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/partials/footer.html'
  };
});