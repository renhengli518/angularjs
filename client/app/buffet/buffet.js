'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('buffet', {
        url: '/buffet',
        templateUrl: 'app/buffet/buffet.html',
        controller: 'BuffetCtrl'
      });
  });