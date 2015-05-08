'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('deposit', {
        url: '/deposit',
        templateUrl: 'app/deposit/deposit.html',
        controller: 'DepositCtrl'
      });
  });