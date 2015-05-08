'use strict';

angular.module('p2pClientApp')
    .directive('openButton', function (ConstantService) {
        return {
            templateUrl: 'components/directives/open-button/open-button.html',
            restrict: 'EA',
            scope: {
                "displayText":"=displayText"
            },
            link: function (scope, element, attrs) {
                var url = '/acct/postnroute?jsonStr={"url":"-channelPay-registerparam"}';
                //window.location.href = ConstantService.RouteUrl() + url;
                scope.targetUrl = ConstantService.RouteUrl() + url;
            }
        };
    });
