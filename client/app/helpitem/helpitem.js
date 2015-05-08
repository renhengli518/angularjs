'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('helpitem', {
        url: '/helpitem',
        templateUrl: 'app/helpitem/helpitem.html',
        controller: 'HelpitemCtrl'
      });
  });