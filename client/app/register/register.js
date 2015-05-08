'use strict';

angular.module('p2pClientApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('register', {
                url: '/register',
                templateUrl: 'app/register/register.html',
                controller: 'RegisterCtrl'
            });
    });
