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
    'sphere.devHeader',
    'sphere.footer',
    'sphere.localstorage',
    'sphere.popup',
    'sphere.analytics'
  ]);
