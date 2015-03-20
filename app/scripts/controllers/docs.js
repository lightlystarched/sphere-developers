'use strict';

angular.module('developersApp')
.controller('DocsCtrl', function ($scope){
    // init form
    $scope.url = '/swagger.json';//'http://petstore.swagger.io/v2/swagger.json';//

    // transform try it request
    $scope.myTransform = function (request){
        request.headers.apiKey = 's5hredf5hy41er8yhee58';
    };
});