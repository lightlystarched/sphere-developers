'use strict';

angular.module('developersApp')
.directive('spDocMenu', function ($log, $location, $anchorScroll) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/partials/document-menu.html'
  };
})
.directive('spHeaderDocMenu', function ($log, $location, $anchorScroll) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/partials/headerMenu.html'
  };
});