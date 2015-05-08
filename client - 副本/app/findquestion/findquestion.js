'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('findquestion', {
        url: '/findquestion',
        templateUrl: 'app/findquestion/findquestion.html',
        controller: 'FindquestionCtrl'
      });
  });