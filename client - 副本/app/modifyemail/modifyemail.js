'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('modifyemail', {
        url: '/modifyemail',
        templateUrl: 'app/modifyemail/modifyemail.html',
        controller: 'ModifyemailCtrl'
      });
  });