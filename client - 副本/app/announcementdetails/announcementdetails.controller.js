'use strict';

angular.module('p2pClientApp')
    .controller('AnnouncementdetailsCtrl', function ($scope, $stateParams, CMSService, _) {
        var id = $stateParams.id;
        CMSService.announcements()
            .then(function (results) {
                $scope.notice = _.find(results, {messageSequence: parseInt(id)});
            });
    });
