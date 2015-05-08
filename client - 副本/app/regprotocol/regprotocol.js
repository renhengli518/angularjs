'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('regprotocol', {
        url: '/regprotocol',
        templateUrl: 'app/regprotocol/regprotocol.html',
        controller: 'RegprotocolCtrl'
      });
  });