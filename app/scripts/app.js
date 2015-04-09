'use strict';

/**
 * @ngdoc overview
 * @name developersApp
 * @description
 * # developersApp
 *
 * Main module of the application.
 */
angular
  .module('developersApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'swaggerUi',
    'ui.router',
    'ui.bootstrap',
    'duScroll',
    'angular-markdown',
    'sphere.validation',
    'sphere.authentication',
    'sphere.devHeader',
    'sphere.localstorage',
    'sphere.popup',
    'sphere.analytics'
  ]);
