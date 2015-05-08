'use strict';
function ngDirectiver(fn) {
    return function () {
        return fn;
    };
}
angular.module('p2pClientApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    "jaydata",
    "ngStorage",
    "ui.calendar",
    "chartsExample.directives",
    "angular-md5",
    "smart-table",
    "xeditable",
    "ui.date",
    "ngTable",
    "infinite-scroll",
    "angular-svg-round-progress",
    "ui.slider",
    "ngClipboard"
])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $urlRouterProvider
            .otherwise('/');
        $httpProvider.interceptors.push('HttpInterceptor');
        $locationProvider.html5Mode(false);
    })
    .config(['ngClipProvider', function (ngClipProvider) {
        ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
    }])
    .run(function ($rootScope, $urlRouter, CMSService, $state, $location, AccountService, UtilsService) {

        //default set login , for testing . also can set logout for testing
        // $rootScope.login = false;
        //must use $locationChangeSuccess , otherwise $urlRouter.sync() will take you back
        //to the url when the location change start (the starting point)
        $rootScope.$on('$locationChangeSuccess', function (e) {
            // console.log("begin:" + new Date());
            // Prevent $urlRouter's default handler from firing
            //e.preventDefault();
            //setTimeout(function () {
            //    console.log("end:" + new Date());
            //    $urlRouter.sync();
            //
            //}, 1000);

            AccountService.checkLoginStatus()
                .then(function () {
                    //$rootScope.isLogin = AccountService.isLogin;
                    //if (!CMSService.secure($location.path())) {
                    //    $rootScope.historyPath = $location.path();
                    //    $state.go("login");
                    //}
                })
                .catch(function (err) {
                    if (!CMSService.secure($location.path())) {
                        $rootScope.historyPath = $location.path();
                        $state.go("login");
                    }
                })
                .finally(function () {
                    $urlRouter.sync();
                });
        });


        // Configures $urlRouter's listener *after* your custom listener
        $urlRouter.listen();
    })
    .directive({
        ngTitle: ngDirectiver(function (scope, element, attr) {
            var x = -90, y = -20, _toolTip; // x,y 默认偏移量
            element.mouseover(function (e) {
                var maxWidth = parseInt(element.attr('ng-title-max')) || 180;
                _toolTip = $("<div id='tooltip' class='tooltipBox' style='width:auto;'></div>").appendTo($('body'));
                _toolTip.html('<span></span><p>' + attr.ngTitle + '</p>').css({
                    'visibility': 'hidden',
                    'max-width': maxWidth
                });

                var L = e.pageX,
                    Y = e.pageY,
                    W = $(window).width(),
                    H = $(window).height(),
                    OW = _toolTip.outerWidth(true),
                    OH = _toolTip.outerHeight(true);

                if (OW > maxWidth) {
                    _toolTip.css({'width': maxWidth});
                } else {
                    _toolTip.css({'width': 'auto'});
                    OW = _toolTip.outerWidth(true);
                }
                _toolTip.css({
                    'left': L + x + OW > W ? L - OW - x : L + x,
                    'top': Y + y - OH,
                    'visibility': '',
                    'display': 'block'
                });
            }).mouseout(function () {
                _toolTip.remove();
            });
        })
    })
    .directive({
        ngFocus: ngDirectiver(function (scope, element, attr) {
            element.focus(function (e) {
                element.css('border', '1px solid #089bff');
            }).focusout(function () {
                element.css('border', '1px solid #dedfe5');
            });
        })
    }).directive({
        ngClick: ngDirectiver(function (scope, element, attr) {
            element.click(function (e) {
                scope.selectedBank = attr.ngClick;
                //element.parent('li').addClass('select').siblings('li').removeClass('select');
            });
        })
    });
