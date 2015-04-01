'use strict';

angular.module('developersApp')
.directive('spDocMenu', function ($log, $location, $anchorScroll) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/partials/document-menu.html',
    scope: {
      thisMenu: '=spDoc'
    },
    link: function (scope) {
      //$log.debug('Document passed to menu directive: ', doc);

      /*scope.$watch('currentDocs', function (doc) {
        if (doc) {
          console.log('Formatting docs: ', doc);
          scope.thisMenu = $filter('mdDocParser')(doc);
          //$log.debug('This menu: ', scope.thisMenu, ' and the document: ', doc);
        }

      });*/

      scope.goTo = function (link) {
        //$log.debug('Going to ', link);
        $location.hash(link);
        $anchorScroll();
      };
    }
  };
})
.directive('spHeaderDocMenu', function ($log, $location, $anchorScroll) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/partials/headerMenu.html',
    scope: {
      thisMenu: '=spHeadDoc'
    },
    link: function (scope) {
      console.log('This menu: ', scope.thisMenu);
      //$log.debug('Document passed to menu directive: ', doc);

      /*scope.$watch('currentDocs', function (doc) {
        if (doc) {
          console.log('Formatting docs: ', doc);
          scope.thisMenu = $filter('mdDocParser')(doc);
          //$log.debug('This menu: ', scope.thisMenu, ' and the document: ', doc);
        }

      });*/

      scope.goTo = function (link) {
        //$log.debug('Going to ', link);
        $location.hash(link);
        $anchorScroll();
      };
    }
  };
});