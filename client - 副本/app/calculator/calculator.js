'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('calculator', {
        url: '/calculator',
        templateUrl: 'app/calculator/calculator.html',
        controller: 'CalculatorCtrl'
      });
  });