'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('guide', {
        url: '/guide',
        templateUrl: 'app/guide/guide.html',
        controller: 'GuideCtrl'
      });
  });