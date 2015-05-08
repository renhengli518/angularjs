'use strict';

angular.module('p2pClientApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('exit', {
                url: '/exit',
                controller: function ($scope, $rootScope, $state, AccountService) {
                    delete $rootScope.username_1;
                    delete $rootScope.login;
                    AccountService.exit();
                }
            });
    });
