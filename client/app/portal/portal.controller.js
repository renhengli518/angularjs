'use strict';

function subFn(a) {
    var _next = $(".stepWrapper");
    var _this = $(".upDown a");
    if (_next.children().length) {
        if (_next.is(':visible')) {
            _next.slideUp();
            _this.removeClass('pull').addClass('up');
        } else {
            _next.slideDown();
            _this.removeClass('up').addClass('pull');
        }
    }
}
angular.module('p2pClientApp')
    .controller('PortalCtrl', function ($scope, CMSService, $interval, ConstantService, DateTimeService, _, $timeout, UtilsService, InvestService, AccountService, $rootScope, $state, $localStorage, $sessionStorage, $q) {
        var allProjects = [];
        //背景动画
        $scope.myInterval = 3000;
        //$scope.sliders = ConstantService.PortalBackgroundImages;
        //媒体报道
        $scope.mediaInterval = 3000;
        $interval(function (old, newL) {
            var index1 = $("#mediaCarousel .active").index();
            $("#slides li a").each(function (index, item) {
                item = $(item);
                if (index === index1) {
                    item.parents('li').addClass('jflowselected');
                } else {
                    item.parents('li').removeClass('jflowselected');
                }
            })

        }, 200);


//        $timeout(function(){
//            $rootScope.rootScopeLogin = false;
//        },1000)


        var _displayProjects = function () {
            //allProjects = _.shuffle(allProjects);
            var perPage = 4;
            var currentPage = $sessionStorage.latestProjectCurrentPage || 0;
            var lastIndex = (currentPage + 1) * perPage;
            if (lastIndex > allProjects.length) {
                lastIndex = allProjects.length;
                currentPage = -1;
            }
            var tmp = allProjects.slice(perPage * currentPage, lastIndex);
            Array.prototype.push.apply(allProjects, tmp);
            $sessionStorage.latestProjectCurrentPage = currentPage + 1;
            $scope.productList = tmp;

            //console.log($scope.productList)
        }

        //$interval(function () {
        //    //_displayProjects();
        //}, 5000);

        $scope.isLogin = function () {
            return AccountService.isLogin();
        }


        //距离下个发布时间


        var _showLatestTime = function (times) {
            var c = DateTimeService.getNextPublishTime(times);
            var text = "距离下场开始 " + DateTimeService.countDown(c.date).text;
            $("body > div > div:nth-child(3) > div.itemWrapper > div > h2 > dl > dt").html(text);
        };


        $scope.earnMoney = function () {
            AccountService.checkLoginStatus()
                .then(function () {
                    $state.go("invest");
                })
                .catch(function (err) {
                    $scope.login = false;
                    $state.go("login");
                })
        }

        var defaultImages = [
            "assets/images/banner1.png",
            "assets/images/banner2.png",
            "assets/images/banner3.png",
            "assets/images/banner4.png"
        ]

        //.catch(function (err) {
        //    console.log(err);
        //})
        $scope.show = true;
        $scope.show1 = false;
        $scope.show2 = false;

        ////judge current user if open or close auto invest
        //UtilsService.cache("username")
        //    .then(function (username) {
        //        return InvestService.getAccountSequenceByUsername(username);
        //    })
        //    .then(function (list) {
        //        if (list && list.length > 0) {
        //            var accountSequence = list[0].AccountSequence;
        //            return InvestService.judgeOpenOrCloseInvest(accountSequence)
        //                .then(function (list) {
        //                    if (list.length == 0) {//close
        //                        $scope.show = true;
        //                        $scope.show1 = false;
        //                        $scope.show2 = false;
        //                    } else {
        //                        list.forEach(function (r) {
        //                            if (r.Type === 0) {//0-自动投资-一键式 1-自动投资-自助式
        //                                if (r.Status === 0) {//0-已启用 1-未启用
        //                                    $scope.show = false;
        //                                    $scope.show1 = true;
        //                                } else {
        //                                    $scope.show1 = false;
        //                                }
        //                            } else {
        //                                if (r.Status === 0) {//0-已启用 1-未启用
        //                                    $scope.show = false;
        //                                    $scope.show2 = true;
        //                                } else {
        //                                    $scope.show2 = false;
        //                                }
        //                            }
        //                        });
        //                    }
        //                })
        //        }
        //
        //    }).catch(function (err) {
        //        console.log(err);
        //    });



        function _init() {

            var promiseArray = [];
            var promise1 = CMSService.publishTimes()
                .then(function (times) {
                    $scope.publishTimes = times;
                    _showLatestTime(times);
                    $interval(function () {
                        _showLatestTime(times);
                    }, 1000);
                })
                .catch(function (err) {
                    console.error(err);
                })
            promiseArray.push(promise1);
            //公告栏 效果
            var promise2 = CMSService.announcements()
                .then(function (results) {
                    $scope.boards = results;
                    $interval(function () {
                        _animate();
                    }, 3000);
                    var _animate = function () {
                        var t = $($(".announcement ul.fl li")[0]);
                        var div = $(".announcement ul.fl");
                        div.append($(t).clone(true));
                        t.slideUp(800, function () {
                            t.remove();
                        });
                    }
                })
                .catch(function (err) {
                    console.error(err);
                });
            promiseArray.push(promise2)
            var promise3 = CMSService.bulletin()
                .then(function (imageList) {
                    if (imageList && imageList.length > 0) {
                        defaultImages = imageList;
                    }
                    $scope.imageSliders = defaultImages;
                })
            promiseArray.push(promise3);
            //精选贷款项目
            //CMSService.latestProjects()
            var promise4 = InvestService.queryInvestProjectInfo([6, 12, 13, 14, 15, 18, 19, 20, 21])
                .then(function (results) {
                    results.forEach(function (r) {
                        // r.InvestmentProgress = 0.1;
                        //r.InvestmentProgress = Math.min(parseFloat(r.InvestmentTotal - r.InvestmentSurplus).toFixed(0), 100);
                        //r.ProgressStyle = {"width": r.InvestmentProgress + "%"};
                        //r.ProgressLeft = {"margin-left": Math.max((r.InvestmentProgress - 16), -5) + "%"};
                        r.InvestmentProgress = Math.min(((r.InvestmentTotal - r.InvestmentSurplus) / r.InvestmentTotal * 100).toFixed(0), 100);
                    });

                    results.sort(function (item1, item2) {
                        return item2.InvestmentStatus === 12 ? 1 : -1;
                    });

                    allProjects = results;
                    _displayProjects();
                })
                .catch(function (err) {
                    console.error(err);
                });
            promiseArray.push(promise4);
            //$q.all(promiseArray)
            //    .then(function () {
            //        if ($rootScope.login) {
            //            UtilsService.cache("account")
            //                .then(function (account) {
            //                    if (account) {
            //                        $rootScope.accountInfo = account;
            //                    } else {
            //                        return AccountService.getAccountById().then(function (data) {
            //                            if (data && data.status === '000' && data.data) {
            //                                var account = data.data;
            //                                $scope.username_1 = account.userName;
            //                            }
            //                        });
            //                    }
            //                })
            //                .catch(function (err) {
            //                    console.log(err);
            //                });
            //        }
            //    })

        }

        _init();
    });
