'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('loan', {
        url: '/loan',
        templateUrl: 'app/loan/loan.html',
        controller: 'LoanCtrl'
      });
  });