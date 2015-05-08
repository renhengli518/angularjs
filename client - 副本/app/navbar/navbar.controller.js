'use strict';

angular.module('p2pClientApp')
    .controller('NavbarCtrl', function ($scope, $location, AccountService, CMSService, _) {
        /*CMSService.nav().then(function (results) {
         debugger;
         $scope.navList = results;
         })
         .catch(function (err) {
         console.error(err);
         });
         */

        AccountService.checkLoginStatus()
            .then(function () {
                $scope.navList = [
                    {
                        'menuChineseName': '首页',
                        'MenuForwardUrl': '#/',
                        "matchPath": ["/"],
                        'menuImage': 'homeIcon'
                    }, {
                        'menuChineseName': '我要投资',
                        'MenuForwardUrl': '#/invest',
                        "matchPath": ["/invest", "/investitem"],
                        'menuImage': 'investIcon'
                    }, {
                        'menuChineseName': '安全保障',
                        'MenuForwardUrl': '#/safe',
                        'matchPath': ["/safe"],
                        'menuImage': 'safeIcon'
                    }, {
                        'menuChineseName': '关于我们',
                        'MenuForwardUrl': '#/about',
                        'matchPath': [
							"/about",
							'/announcement',
							'/media',
							'/mediadetails/details01',
							'/mediadetails/details02',
							'/partner',
						],
                        'menuImage': 'aboutIcon'
                    },
                    {
                        'menuChineseName': '我的账户',
                        'MenuForwardUrl': '#/account',
                        'matchPath': [
                            "/account",
                            "/account/message",
                            "/account/fund",
                            "/account/detail",
                            "/account/security",
                            "/account/packet",                          
                            "/account/myinvest",
							"/deposit",
                            "/apply",
                            "/invest/auto",
                            "/onetouch",
                            "/buffet",
                            "/share",
                            "/calculator",
                        ],
                        'menuImage': 'accountIcon'
                    }
                ]
            })
            .catch(function (err) {
                $scope.navList = [
                    {
                        'menuChineseName': '首页',
                        'MenuForwardUrl': '/',
                        "matchPath": ["/"],
                        'menuImage': 'homeIcon'
                    }, {
                        'menuChineseName': '我要投资',
                        'MenuForwardUrl': '#/invest',
                        "matchPath": ["/invest", "/investitem"],
                        'menuImage': 'investIcon'
                    }, {
                        'menuChineseName': '安全保障',
                        'MenuForwardUrl': '#/safe',
                        'matchPath': ["/safe"],
                        'menuImage': 'safeIcon'
                    }, {
                        'menuChineseName': '新手指引',
                        'MenuForwardUrl': '#/guide',
                        'matchPath': ["/guide"],
                        'menuImage': 'guideIcon'
                    }, {
                        'menuChineseName': '关于我们',
                        'MenuForwardUrl': '#/about',
                        'matchPath': [
							"/about",
							'/announcement',
							'/media',
							'/mediadetails/details01',
							'/mediadetails/details02',
							'/partner',
						],
                        'menuImage': 'aboutIcon'
                    }
                ]
            })

        $scope.isActive = function (routeArray) {
            var currentPath = $location.path();
            if (currentPath.indexOf("/investitem") !== -1) {
                currentPath = "/investitem";
            }
            return _.contains(routeArray, currentPath);
        };
    });
