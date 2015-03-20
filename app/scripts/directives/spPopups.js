'use strict';

angular.module('sphere.popups', [])
.directives('spPopups', function () {
  return {
    restrict: 'AE',
    template: '<div class="popup-wrapper><h1>Popup</h1></div>',
    link: function () {

    }
  };
});