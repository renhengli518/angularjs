'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('investitem', {
        url: '/investitem/:id',
        templateUrl: 'app/investitem/investitem.html',
        controller: 'InvestitemCtrl'
      })
  });