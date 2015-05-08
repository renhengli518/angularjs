'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('helpitem01', {
        url: '/helpitem01',
        templateUrl: 'app/helpitem01/helpitem01.html',
        controller: 'Helpitem01Ctrl'
      });
  });