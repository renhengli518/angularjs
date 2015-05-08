'use strict';

angular.module('p2pClientApp')
    .factory('HttpInterceptor', function ($q, $rootScope, $location, $sessionStorage) {
        //return requestInterceptor;

        var _resetLogin = function () {
            $sessionStorage.$reset();
            $rootScope.historyPath = $location.path();
            window.location.href = "/#/login";
        }

        return {
            // On request success
            request: function (config) {
                //if (!$rootScope.disableLoadingMessage) {
                //    $rootScope.loadingShow = true;
                //}
                if(config.url.indexOf("p2p/data/ws/rest") !== -1) {
                   // $rootScope.loadingShow = true;
                }
                return $q.when(config);
            },

            requestError: function (rejection) {
                //$rootScope.loadingShow = false;
                return $q.reject(rejection);
            },

            // On response success
            response: function (response) {
                return $q.when(response)
                    .then(function (t) {
                        //$rootScope.loadingShow = false;
                        if (t.config.url.indexOf("p2p/data/ws/rest") !== -1) {
                            var resData = t.data;
                            if (resData && resData.msg && resData.msg.indexOf("用户未登录") !== -1) {
                                _resetLogin();
                            }
                        }
                        return t;
                    });
            },
            // On response failture
            responseError: function (rejection) {
                //$rootScope.loadingShow = false;
                return $q.reject(rejection);
            }
        };
    });
