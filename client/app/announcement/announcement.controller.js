'use strict';

angular.module('p2pClientApp')
    .controller('AnnouncementCtrl', function ($scope, CMSService) {
        CMSService.announcements()
            .then(function (results) {
                $scope.list = results;
            });
    });
