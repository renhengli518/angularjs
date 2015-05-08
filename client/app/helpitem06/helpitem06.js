'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('helpitem06', {
        url: '/helpitem06',
        templateUrl: 'app/helpitem06/helpitem06.html',
        controller: 'Helpitem06Ctrl'
      });
  });