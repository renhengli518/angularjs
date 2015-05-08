'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('bindemail', {
        url: '/bindemail',
        templateUrl: 'app/bindemail/bindemail.html',
        controller: 'BindemailCtrl'
      });
  });