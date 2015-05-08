'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('modifyquestion', {
        url: '/modifyquestion',
        templateUrl: 'app/modifyquestion/modifyquestion.html',
        controller: 'ModifyquestionCtrl'
      });
  });