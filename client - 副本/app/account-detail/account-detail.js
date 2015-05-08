'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('account-detail', {
        url: '/account/detail',
        templateUrl: 'app/account-detail/account-detail.html',
        controller: 'AccountDetailCtrl'
      });
  });