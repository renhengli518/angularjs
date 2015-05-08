'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('account-fund', {
        url: '/account/fund',
        templateUrl: 'app/account-fund/account-fund.html',
        controller: 'AccountFundCtrl'
      });
  });