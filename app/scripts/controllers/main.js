'use strict';

angular.module('developersApp')
.controller('MainCtrl', function ($scope, $rootScope, $sce, $log, $timeout, anchorScroll, UserService, LocalStorageService, AnalyticsService, PopupService) {
  
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

  $scope.formOpen = false;
  $scope.btnHovered = false;
  $scope.showThanks = false;
  $scope.thanksMsg = 'Thank you for applying!';

  $scope.submitRequest = function () {
    var form = $scope.requestApi;
    if (form.$valid) {
      var params = {
        fromEmail: form.email.$viewValue,
        subject: 'Request for Sphere API',
        content: 'Name: ' + form.name.$viewValue + ' ' + form.surname.$viewValue + '; Company: ' + form.company.$viewValue + '; Title: ' + form.title.$viewValue + '; Sphere username: ' + form.username.$viewValue + '; Comments: ' + form.comments.$viewValue
      };

      UserService.contact(params).then(function(result) {
        if(!result.data.success) {
          $scope.thanksMsg = result.msg;
        }
        else {
          $scope.showThanks = true;
        }
        $timeout(function () {
          $scope.formOpen = false;
          $scope.showThanks = false;
          $scope.requestApi.$setPristine();
          $scope.requestApi.email = null;
          $scope.requestApi.name = null;
          $scope.requestApi.surname = null;
          $scope.requestApi.company = null;
          $scope.requestApi.title = null;
          $scope.requestApi.username = null;
          $scope.requestApi.comments = null;
          anchorScroll.scrollTo('page-header');

          if(!$scope.$$phase) {
            $scope.$apply();
          }
        }, 3000);
      });
    }
  };

  //AnalyticsService.track_event('Automatic Action', 'PV');
});