'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('share', {
        url: '/share',
        templateUrl: 'app/share/share.html',
        controller: 'ShareCtrl'
      });
  });