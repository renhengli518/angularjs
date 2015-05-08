'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('onetouch', {
        url: '/onetouch',
        templateUrl: 'app/onetouch/onetouch.html',
        controller: 'OnetouchCtrl'
      });
  });