'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('modifypwd', {
        url: '/modifypwd',
        templateUrl: 'app/modifypwd/modifypwd.html',
        controller: 'ModifypwdCtrl'
      });
  });