'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('regulations', {
        url: '/regulations',
        templateUrl: 'app/regulations/regulations.html',
        controller: 'RegulationsCtrl'
      });
  });