'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('account-security', {
        url: '/account/security',
        templateUrl: 'app/account-security/account-security.html',
        controller: 'AccountSecurityCtrl'
      });
  });
