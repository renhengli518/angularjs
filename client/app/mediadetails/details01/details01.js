'use strict';

angular.module('p2pClientApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('details01', {
                url: '/mediadetails/details01',
                templateUrl: 'app/mediadetails/details01/details01.html',
                controller: 'Details01Ctrl'
            });
    });
