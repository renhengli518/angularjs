'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('protocol', {
        url: '/protocol/:id',
        templateUrl: 'app/protocol/protocol.html',
        controller: 'ProtocolCtrl'
      });
  });