'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('forgetpasswd', {
        url: '/forgetpasswd',
        templateUrl: 'app/forgetpasswd/forgetpasswd.html',
        controller: 'ForgetpasswdCtrl'
      });
  });