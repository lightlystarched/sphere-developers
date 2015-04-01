'use strict';

angular.module('developersApp')
.controller('MainCtrl', function ($scope, $rootScope, $sce, $log, $timeout, UserService, LocalStorageService, AnalyticsService, PopupService) {
  
  $rootScope.$on('loginRequest', function () {
    PopupService.openPopup($scope, {
      templateUrl: 'views/common/login.html',
      customClass: 'login_popup',
      closeButton: false,
      callback: $scope.getData,
      _topPosition: 100,
      _width: 340
    });
  });

  //AnalyticsService.track_event('Automatic Action', 'PV');
});