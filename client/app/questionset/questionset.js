'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('questionset', {
        url: '/questionset',
        templateUrl: 'app/questionset/questionset.html',
        controller: 'QuestionsetCtrl'
      });
  });