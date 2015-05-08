'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('helpitem03', {
        url: '/helpitem03',
        templateUrl: 'app/helpitem03/helpitem03.html',
        controller: 'Helpitem03Ctrl'
      });
  });