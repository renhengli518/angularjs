'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('account-myinvest', {
        url: '/account/myinvest',
        templateUrl: 'app/account-myinvest/account-myinvest.html',
        controller: 'AccountMyinvestCtrl'
      });
  });