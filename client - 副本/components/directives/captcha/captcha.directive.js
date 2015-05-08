'use strict';

angular.module('p2pClientApp')
    .directive('captcha', function (CMSService, ConstantService) {
        return {
            templateUrl: 'components/directives/captcha/captcha.html',
            restrict: 'EA',
            scope: {},
            link: function (scope, element, attrs) {
//                scope.verificationCode = attrs["verificationCode"];
                var url = ConstantService.APIUrl();
                var src = url + "/p2p/app/sudoor/captcha-image.html?" + Math.random();
                $("#captcha-validate").attr("src", src);

                scope.refresh = function (obj) {
                    var url = ConstantService.APIUrl();
                    var src = url + "/p2p/app/sudoor/captcha-image.html?" + Math.random();
                    $("#captcha-validate").attr("src", src);
                };

            }
        };
    });
