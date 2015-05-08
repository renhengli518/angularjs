'use strict';

angular.module('p2pClientApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('announcementdetails', {
                url: '/announcementdetails/:id',
                templateUrl: 'app/announcementdetails/announcementdetails.html',
                controller: 'AnnouncementdetailsCtrl'
            });
    });
