'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('grade', {
        url: '/grade',
        templateUrl: 'app/grade/grade.html',
        controller: 'GradeCtrl'
      });
  });