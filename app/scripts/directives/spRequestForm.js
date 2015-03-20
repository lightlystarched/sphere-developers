'use strict';
angular.module('developersApp')
.config(function ($logProvider) {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === 'ppdlcjobiakaooocnfcdplpgddhgbpbi') {
    $logProvider.debugEnabled(true);
  } else {
    $logProvider.debugEnabled(false);
  }
})
.directive('spRequestForm', function () {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: '/views/sp-request-form.html',
    link: function () {
    }
  };
});