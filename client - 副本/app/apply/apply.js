'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('apply', {
        url: '/apply',
        templateUrl: 'app/apply/apply.html',
        controller: 'ApplyCtrl'
      });
  });