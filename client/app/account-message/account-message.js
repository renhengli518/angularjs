'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('account-message', {
        url: '/account/message',
        templateUrl: 'app/account-message/account-message.html',
        controller: 'AccountMessageCtrl'
      });
  });