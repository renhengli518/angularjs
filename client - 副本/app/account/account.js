'use strict';

angular.module('p2pClientApp').config(function ($stateProvider) {
        $stateProvider
            .state('account', {
                url: '/account',
                templateUrl: 'app/account/account.html',
                controller: 'AccountCtrl'
            });
    });
