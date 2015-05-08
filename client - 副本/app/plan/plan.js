'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('plan', {
        url: '/plan',
        templateUrl: 'app/plan/plan.html',
        controller: 'PlanCtrl'
      });
  });