'use strict';
angular.module('developersApp')
.config(function ($logProvider) {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === 'ppdlcjobiakaooocnfcdplpgddhgbpbi') {
    $logProvider.debugEnabled(true);
  } else {
    $logProvider.debugEnabled(false);
  }
})
.controller('AnimationController', function ($log, $scope, $timeout) {
  var self = this,
    startOn = false,// Turn on and off the initial display of elements
    currentLight = 0,
    alternateLights,
    stopLights,
    lightAnim,
    buildScope;

  $scope.lightSwitches = {
    title: startOn,
    subtitle: startOn,
    ellipse: startOn,
    subtitleTwo: startOn,
    subtitleThree: startOn,
    bgVeins: startOn,
    glow: startOn,
    outerCircle: startOn,
    node: startOn,
    veins: startOn,
    button: startOn
  };
  $scope.veinList = [];

  buildScope = function () {
    var array = [];
    
    for (var i = 1; i <= self.numOfVeins; i++) {
      array.push({src: self.imgSrc, isOn: false});
    }

    return array;
  };

  stopLights = function () {
    $log.debug('stopping animation');
    $timeout.cancel(lightAnim);
  };

  // private functions
  alternateLights = function () {
    var newNumber = Math.floor((Math.random() * self.numOfVeins) + 0);
    if (newNumber === currentLight && newNumber !== $scope.veinList.length -1) { newNumber++; }
    else if (newNumber === currentLight && newNumber === $scope.veinList.length - 1) { newNumber = 0; }

    $scope.veinList[currentLight].isOn = false;
    $scope.veinList[newNumber].isOn = true;

    currentLight = newNumber;
    lightAnim = $timeout(function () { alternateLights(); }, 1000);
  };

  this._init = function () {
    $scope.veinList = buildScope();

    // Turn on animations
    $scope.lightSwitches.outerCircle = true;
    $scope.lightSwitches.subtitle = true;
    $scope.lightSwitches.node = true;
    $scope.lightSwitches.ellipse = true;
    //$scope.lightSwitches.glow = true;

    // Each of these timeouts should be pulled into separate functions that get invoked
    $timeout(function () {
      $scope.lightSwitches.ellipse = false;
      $scope.veinList[3].isOn = true;
      $scope.lightSwitches.node = false;
      $scope.lightSwitches.subtitleTwo = true;
      $scope.lightSwitches.bgVeins = true;
      $timeout(function () {
        $scope.lightSwitches.veins = true;
        $scope.lightSwitches.title = true;
        $timeout(function () {
          $scope.lightSwitches.button = true;
          $timeout(function () {
            $scope.lightSwitches.veins = false;
            $scope.veinList[3].isOn = false;
            $timeout(function () {
              alternateLights();
            });
          }, 1000);
        }, 1500);
      }, 1500);
    }, 1500);
    //$scope.veinList[3].isOn = true;
  };
})
.directive('spLogoAnimation', function ($log, anchorScroll) {
  return {
    restrict: 'AE',
    replace: true,
    controller: 'AnimationController',
    templateUrl: '/views/spLogoAnimation.html',
    link: function (scope, element, attrs, ctrl) {
      //var dimensions = {height: element[0].scrollHeight};
      // set variables
      ctrl.imgSrc = attrs.src ? String(attrs.src) : '';
      ctrl.numOfVeins = attrs.veins ? Number(attrs.veins) : 8;

      scope.buttonClicked = function (formOpen) {
        if (formOpen) {
          anchorScroll.scrollTo('page-header');
        } else {
          anchorScroll.scrollTo('form-wrapper');
        }
        scope.formOpen = !scope.formOpen;
      };

      $log.debug('Starting animation');
      
      // initialize me
      ctrl._init();
    }
  };
})
.directive('spFormToggle', function (anchorScroll) {
  return {
    restrict: 'A',
    scope: {
      formOpen: '=spFormToggle'
    },
    link: function (scope, element) {
      element.on('mouseover', function () {
        element.addClass('hover');
      });

      element.on('mouseout', function () {
        element.removeClass('hover');
      });
      
      element.on('click', function () {
        if (scope.formOpen) {
          anchorScroll.scrollTo('page-header');
        } else {
          anchorScroll.scrollTo('form-wrapper');
        }
        scope.formOpen = !scope.formOpen;
      });
    }
  };
});