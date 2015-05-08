'use strict';

angular.module('p2pClientApp')
    .factory('CMSService', function (ConstantService, $q, $http, $localStorage, $rootScope, _, AccountService, ODataService, UtilsService, $resource) {
        // Service logic
        // ...
        var baseAPI = ConstantService.APIRoot();


        // Public API here
        return {
            latestProjects: function () {
                var defer = $q.defer();
                var array = [
                    {
                        "name": "大额消费(V14A001)1",
                        "ensure": true,
                        "level": "A",
                        "rate": 10,
                        "expiration": "4",
                        "amount": 400000,
                        "minAmount": 40,
                        "customer": "工薪",
                        "progress": 20,
                        "summary": {
                            "number": "300",
                            "completed": "50",
                            "left": "60"
                        }
                    }, {
                        "name": "大额消费(V14A001)2",
                        "ensure": true,
                        "level": "A",
                        "rate": 20,
                        "expiration": "4",
                        "amount": 500000,
                        "minAmount": 50,
                        "customer": "工薪",
                        "progress": 40,
                        "summary": {
                            "number": "3000",
                            "completed": "50",
                            "left": "60"
                        }
                    }, {
                        "name": "大额消费(V14A001)3",
                        "ensure": true,
                        "level": "A",
                        "rate": 30,
                        "expiration": "4",
                        "amount": 400000,
                        "minAmount": 40,
                        "customer": "工薪",
                        "progress": 20,
                        "summary": {
                            "number": "3000",
                            "completed": "50",
                            "left": "60"
                        }
                    }, {
                        "name": "大额消费(V14A001)4",
                        "ensure": true,
                        "level": "A",
                        "rate": 80,
                        "expiration": "4",
                        "amount": 300000,
                        "minAmount": 80,
                        "customer": "工薪",
                        "progress": 20,
                        "summary": {
                            "number": "30000",
                            "completed": "50",
                            "left": "60"
                        }
                    }, {
                        "name": "大额消费(V14A001)5",
                        "ensure": true,
                        "level": "A",
                        "rate": 80,
                        "expiration": "4",
                        "amount": 300000,
                        "minAmount": 80,
                        "customer": "工薪",
                        "progress": 20,
                        "summary": {
                            "number": "30000",
                            "completed": "50",
                            "left": "60"
                        }
                    }
                ];
                defer.resolve(array);
                return defer.promise;
                //return InvestService.queryInvestProjectInfo()
                //    .then(function (list) {
                //        //return list;
                //        return defer.promise;
                //    })
            },
            nav: function () {
                //var defer = $q.defer();
                var login = [
                    {
                        'menuChineseName': '首页',
                        'MenuForwardUrl': '#/',
                        "matchPath": ["/"],
                        'menuImage': 'homeIcon'
                    }, {
                        'menuChineseName': '我要投资',
                        'MenuForwardUrl': '#/invest',
                        "matchPath": ["/invest"],
                        'menuImage': ''
                    },
                    {
                        'menuChineseName': '我的贷款',
                        'MenuForwardUrl': '#/loan',
                        'matchPath': [
                            "/loan"
                        ],
                        'menuImage': ''
                    }, {
                        'menuChineseName': '安全保障',
                        'MenuForwardUrl': '',
                        'matchPath': [],
                        'menuImage': ''
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
                            "/account/myinvest"
                        ],
                        'menuImage': 'accountIcon'
                    }
                ];
                var logout = [
                    {
                        'menuChineseName': '首页',
                        'MenuForwardUrl': '/',
                        "matchPath": ["/"],
                        'menuImage': 'homeIcon'
                    }, {
                        'menuChineseName': '我要投资',
                        'MenuForwardUrl': '#/invest',
                        "matchPath": ["/invest"],
                        'menuImage': ''
                    }, {
                        'menuChineseName': '我要贷款',
                        'MenuForwardUrl': '',
                        'matchPath': [""],
                        'menuImage': ''
                    }, {
                        'menuChineseName': '安全保障',
                        'MenuForwardUrl': '',
                        'matchPath': [],
                        'menuImage': ''
                    }
                ];

                //defer.resolve(AccountService.isLogin() ? login : logout);
                //return defer.promise;

                return AccountService.checkLoginStatus()
                    .then(function () {
                        return login;
                    })
                    .catch(function (err) {
                        return logout;
                    })
            },
            announcements: function () {
                var defer = $q.defer();
                //var array = [
                //    {"content": "1平台公告：十一期间，系统升级，网站暂时无法使用，谢谢！", "show": true},
                //    {"content": "2系统升级", "show": false},
                //    {"content": "3网站暂时无法使用，谢谢！", "show": false}
                //];
                //defer.resolve(array);
                //return defer.promise;
                var cacheName = "announcentsList";
                return UtilsService.cache(cacheName)
                    .then(function (obj) {
                        if (obj) {
                            return obj;
                        } else {
                            return $resource(baseAPI + "/message/queryMessageAll", null, {
                                "list": {
                                    "method": "POST"
                                }
                            })
                                .list("").$promise.then(function (t) {
                                    if (t && t.status === "000") {
                                        var tmp = t.data;
                                        //if (tmp && tmp.length > 0) {
                                        //    tmp = tmp.slice(0, Math.min(tmp.length, 20));
                                        //}
                                        return UtilsService.cache(cacheName, tmp.slice(0))
                                            .then(function (t) {
                                                return tmp;
                                            })
                                        //return t.data;
                                    } else {
                                        return [];
                                    }
                                })
                                .catch(function (err) {
                                    console.log(err);
                                    return [];
                                })
                        }
                    })

            },
            publishTimes: function () {
                var times = [
                    {"time": "10:30", "current": false},
                    {"time": "13:30", "current": false},
                    //{"time": "16:45", "current": false},
                    {"time": "17:30", "current": false},
                    {"time": "20:30", "current": false}
                ];
                var defer = $q.defer();
                defer.resolve(times);
                return defer.promise;
            },
            tradingData: function () {
                var defer = $q.defer();
                defer.resolve({});
                return defer.promise;
            },
            secure: function (path) {
                var loginPath = ["/account", "/account/details", "/account/fund", "/account/message"
                    , "/account/packet", "/account/security", "/loan", "/invest/auto"];
                if (_.contains(loginPath, path)) {
                    return AccountService.isLogin();
                } else {
                    return true;
                }
            },
            showLoading: function () {
                $rootScope.loadingShow = true;
            },
            hideLoading: function () {
                $rootScope.loadingShow = false;
            },
            validate: function (_captcha) {
                var defer = $q.defer();
                $http.get(baseAPI + "/sudoor/captcha/validate?_captcha=" + _captcha)
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            bulletin: function () {
                return ODataService.getDB()
                    .then(function (p2pDB) {
                        var array = [];
                        return p2pDB.Messages
                            .filter("it.MessageIssueType===type && it.MessageStatus === this.status", {
                                "type": 4,
                                "status": 0
                            })
                            .forEach(function (obj) {
                                array.push(obj.initData);
                            })
                            .then(function (t) {
                                return array;
                            })
                    })
                    //.catch(function (err) {
                    //    console.error(err);
                    //    return null;
                    //})

            }
        };
    });
