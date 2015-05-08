'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('helpitem04', {
        url: '/helpitem04',
        templateUrl: 'app/helpitem04/helpitem04.html',
        controller: 'Helpitem04Ctrl'
      });
  });