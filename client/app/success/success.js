'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('success', {
        url: '/success/:param',
        templateUrl: 'app/success/success.html',
        controller: 'SuccessCtrl'
      });
  });