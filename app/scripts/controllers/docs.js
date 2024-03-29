'use strict';

angular.module('developersApp')
.controller('DocsCtrl', function ($scope, $rootScope, $anchorScroll, $filter, Document, Swagger){

  $scope.docs = angular.copy(Document);
  $rootScope.docMenu = $filter('mdDocParser')(angular.copy(Document), angular.copy(Swagger));
  $scope.swagger = angular.copy(Swagger);

  // init form
  $scope.url = '/docs/bower_components/sphere-documentation/swagger.json';//'http://petstore.swagger.io/v2/swagger.json';//

  $scope.$on('$stateChangeSuccess', function () {
    $scope.docPage = true;
    $anchorScroll();
  });
});