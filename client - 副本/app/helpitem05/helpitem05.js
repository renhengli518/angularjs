'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('helpitem05', {
        url: '/helpitem05',
        templateUrl: 'app/helpitem05/helpitem05.html',
        controller: 'Helpitem05Ctrl'
      });
  });