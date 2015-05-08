'use strict';

angular.module('p2pClientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('announcement', {
        url: '/announcement',
        templateUrl: 'app/announcement/announcement.html',
        controller: 'AnnouncementCtrl'
      });
  });