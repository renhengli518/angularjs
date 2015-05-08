'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('account-packet', {
        url: '/account/packet',
        templateUrl: 'app/account-packet/account-packet.html',
        controller: 'AccountPacketCtrl'
      });
  });