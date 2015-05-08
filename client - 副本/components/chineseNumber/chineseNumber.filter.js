'use strict';

angular.module('p2pClientApp')
    .filter('chineseNumber', function (UtilsService) {
        return function (input) {
            //var t = newV.replace(/[^\.^\d]/g, '');
            var reg = /^\d+(\.\d+)?$/;
            if (input && reg.test(input)) {
                var input = UtilsService.chineseCost(input);
                if (input && input.indexOf("整") === -1) {
                    var a = input.split("元");
                    a[1] = a[1].replace(/角|分/g, "");
                    input = a[0] + "点" + a[1];
                }
            } else {
                input = null;
            }
            return input || "";
        };
    });
