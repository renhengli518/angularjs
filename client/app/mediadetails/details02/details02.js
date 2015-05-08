'use strict';

angular.module('p2pClientApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('details02', {
                url: '/mediadetails/details02',
                templateUrl: 'app/mediadetails/details02/details02.html',
                controller: 'Details02Ctrl'
            });
    });
