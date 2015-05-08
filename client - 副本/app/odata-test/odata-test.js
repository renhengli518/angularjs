'use strict';

angular.module('p2pClientApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('odata-test', {
                url: '/odata-test',
                templateUrl: 'app/odata-test/odata-test.html',
                controller: 'OdataTestCtrl'
            });
    });
