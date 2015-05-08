'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('account-message2', {
        url: '/account/message/:messageStatusValue',
        templateUrl: 'app/account-message/account-message.html',
        controller: 'AccountMessageCtrl'
      });
  });
