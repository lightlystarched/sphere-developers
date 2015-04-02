'use strict';

angular.module('developersApp')
.directive('spDocMenu', function ($log, $location, anchorScroll) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/partials/document-menu.html',
    scope: {
      thisMenu: '=spDoc'
    },
    link: function (scope) {

      scope.goTo = function (link) {
        //$log.debug('Going to ', link);
        $location.hash(link);
        anchorScroll.scrollTo(link);
      };
    }
  };
})
.directive('spHeaderDocMenu', function ($log, $location, anchorScroll) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'views/partials/headerMenu.html',
    scope: {
      thisMenu: '=spHeadDoc'
    },
    link: function (scope) {

      scope.goTo = function (link) {
        //$log.debug('Going to ', link);
        $location.hash(link);
        anchorScroll.scrollTo(link);
      };
    }
  };
})
.directive('spMenuItem', function ($location) {
  return {
    restrict: 'A',
    scope: {
      thisItem: '=spMenuItem'
    },
    link: function (scope, element) {
      scope.$watch(function () { return $location.hash(); }, function (newHash) {
        if (!element.hasClass('current') && newHash === scope.thisItem.link) {
          element.addClass('current');
        } else if (element.hasClass('current') && newHash !== scope.thisItem.link) {
          element.removeClass('current');
        }
      });
    }
  };
});