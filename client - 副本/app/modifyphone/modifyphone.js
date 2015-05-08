'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('modifyphone', {
        url: '/modifyphone',
        templateUrl: 'app/modifyphone/modifyphone.html',
        controller: 'ModifyphoneCtrl'
      });
  });