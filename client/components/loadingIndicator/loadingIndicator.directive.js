'use strict';

angular.module('p2pClientApp')
    .directive('loadingIndicator', function ($rootScope) {
        return {
            templateUrl: 'components/loadingIndicator/loadingIndicator.html',
            restrict: 'A',
            "scope": {},
            link: function (scope, element, attrs) {
                scope.message = attrs.message;
                scope.show = attrs.ngShow || false;
                $rootScope.$on('$routeChangeStart', function () {
                    scope.show = attrs.ngShow || true;
                });
                $rootScope.$on('$routeChangeSuccess', function () {
                    scope.show = attrs.ngShow || false;
                });
            }
        };
    });
