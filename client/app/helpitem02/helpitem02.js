'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('helpitem02', {
        url: '/helpitem02',
        templateUrl: 'app/helpitem02/helpitem02.html',
        controller: 'Helpitem02Ctrl'
      });
  });