'use strict';

angular.module('p2pClientApp')
    .filter('moneyFormat', function (UtilsService) {
        return function (input) {
            return UtilsService.formatMoney(input, 3, 2);
        };
    });
