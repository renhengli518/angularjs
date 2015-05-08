'use strict';

angular.module('p2pClientApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('portal', {
                url: '/',
                templateUrl: 'app/portal/portal.html',
                controller: 'PortalCtrl'
            });
    });
