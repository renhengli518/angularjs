'use strict';

angular.module('p2pClientApp')
    .controller('InvestCtrl', function (UtilsService,$scope, CMSService, DateTimeService, $interval, InvestService, _, $timeout, $log, ODataService, $q, AccountService, $state) {
        $scope.globalDataList = [];
        $scope.projectList = [];
        $scope.customeType = [
            {
                "name": "不限",
                "value": [1, 2, 3],
                "checked": true
            },
            {
                "name": "工薪族",
                "value": [1],
                "checked": false
            }, {
                "name": "私营企业主",
                "value": [2],
                "checked": false
            }, {
                "name": "个体户",
                "value": [3],
                "checked": false
            }
        ];
        $scope.bidProgress = [
            {
                "name": "不限",
                "value": [5, 6, 12, 13, 14, 15, 16, , 18, 19, 20, 21],
                "checked": true
            },
            {
                "name": "招标中",
                "value": [12],
                "checked": false
            }, {
                "name": "已满标",
                "value": [6, 13, 14],
                "checked": false
            }
            , {
                "name": "还款中",
                "value": [15, 18, 19, 20, 21],
                "checked": false
            }
        ];
        $scope.monthRange = [
            {
                "title": "6个月",
                "value": 1,
                "selected": false
            }, {
                "title": "12个月",
                "value": 2,
                "selected": false
            }, {
                "title": "18个月",
                "value": 3,
                "selected": false
            }, {
                "title": "24个月",
                "value": 4,
                "selected": false
            }, {
                "title": "36个月",
                "value": 5,
                "selected": false
            }
        ];

        var _highlightM = function () {
            $scope.monthRange.forEach(function (item) {
                if (_.contains($scope.periods, item.value)) {
                    item.selected = true;
                } else {
                    item.selected = false;
                }
            })
        }

        var periodArray = [1, 2, 3, 4, 5];
        $scope.periods = [1, 5];
        _highlightM();
        $scope.slider = {
            'options': {
                //start: function (event, ui) {
                //    $log.info('Slider start');
                //},
                stop: function (event, ui) {
                    $log.info('Slider stop');
                    _highlightM();
                    loadRemote();
                },
                range: true
            }
        }
        $scope.tableTitles = [
            //{
            //    "title": "年利率",
            //    "width": "14%",
            //    "sortColumn": "investment.investmentAnnualInterestRate",
            //    "orderAsc": true
            //},
            {
                "title": "贷款期限",
                "width": "10%",
                "sortColumn": "investment.investmentPeriod",
                "orderAsc": true
            }, {
                "title": "信用等级",
                "width": "10%",
               // "sortColumn": "investment.investmentCredibilityScore",
                "sortColumn":"investment.investmentLevel",
                "orderAsc": true
            }, {
                "title": "贷款金额",
                "width": "10%",
                "sortColumn": "investment.investmentTotal",
                "orderAsc": true
            }, {
                "title": "发布时间",
                "width": "8%",
                "sortColumn": "investment.investmentStartDate",
                "orderAsc": true
            }, {
                "title": "完成度",
                "width": "13%",
                "sortColumn": "investment.investmentProgress",
                "orderAsc": true
            }
        ]


        function _getValue1(item, array) {
            var v = null;
            for (var i = 0; i < array.length; i++) {
                if (array[i]) {
                    v = (v || item)[array[i]];
                }
            }
            return v;
        }

        $scope.sortTable = function (titleObj) {
            if ($scope.projectList && $scope.projectList.length > 0) {
                var array = titleObj.sortColumn.split(".");
                $scope.sortedColumn = titleObj.sortColumn;
                var flag = false;
                var tmp = $scope.projectList.sort(function (item1, item2) {
                    var value1 = _getValue1(item1, array);
                    var value2 = _getValue1(item2, array);
                    return value1 > value2 ? -1 : 1;
                });


                //if (flag || flag === 0) {
                $scope.tableTitles.forEach(function (item) {
                    item.cssClass = "";
                });
                if (!titleObj.orderAsc) {
                    tmp = tmp.reverse();
                    titleObj.cssClass = "desc";
                } else {
                    titleObj.cssClass = "asc";
                }
                titleObj.orderAsc = !titleObj.orderAsc;
                $scope.projectList = tmp;
                // }

            }
        }

        $scope.selectedCheckbox = function (scopeName, t) {
            var unlimited = (t.name === "不限");
            var tmp = $scope[scopeName];
            t.checked = !t.checked;
            if (tmp && tmp.length > 0) {
                tmp.forEach(function (item) {
                    item.checked = (item.name === t.name);
                })
                //_filter();
                loadRemote();
            }
        }
        $scope.autoInvest = function () {
            //add by renhengli
//            if($scope.show){
//                $state.go("auto-invest");
//            }else if($scope.show1){
//                $state.go("onetouch");
//            }else if($scope.show2){
//                $state.go("buffet");
//            }

            //AccountService.checkLoginStatus()
            //    .then(function () {
            //        $state.go("auto-invest");
            //    })
            //    .catch(function (err) {
            //        $(".autoMsg").show();
            //    })

            //var login = AccountService.isLogin();
            //if (login) {
            //    $state.go('auto-invest');
            //} else {
            //    $('.autoMsg').show();
            //}
        }
        //$scope.selectedCheckbox = function (scopeName, t) {
        //    var unlimited = (t.name === "不限");
        //    var tmp = $scope[scopeName];
        //    t.checked = !t.checked;
        //    if (tmp && tmp.length > 0) {
        //        $scope[scopeName].forEach(function (t1) {
        //            if (unlimited) {
        //                t1.checked = (t1.name === t.name) && t.checked;
        //            } else if (t.name === t1.name) {
        //                t1.checked = (t1.name === t.name) && t.checked;
        //            } else {
        //                if (t1.name === "不限") {
        //                    t1.checked = false;
        //                }
        //            }
        //        });
        //        _filter();
        //    }
        //}

        //$scope.$watch("bidProgress", function (newV, oldV) {
        //    _filter();
        //}, true);
        //
        //$scope.$watch("customeType", function (newV, oldV) {
        //    _filter();
        //}, true);

        var _filter = function () {
            var slectedPV = [];
            $scope.bidProgress.filter(function (t) {
                return t.checked
            }).map(function (t) {
                Array.prototype.push.apply(slectedPV, t.value)
            })
            var tmp = _.cloneDeep($scope.globalDataList);
            if (slectedPV) {
                tmp = tmp.filter(function (t) {
                    return _.contains(slectedPV, t.investment.investmentStatus);
                })
            }
            var customeType = [];
            $scope.customeType.filter(function (t) {
                return t.checked
            }).map(function (t) {
                Array.prototype.push.apply(customeType, t.value)
            })
            if (customeType) {
                tmp = tmp.filter(function (t) {
                    return _.contains(customeType, t.account.loanType);
                })
            }
            $scope.projectList = [];
            $scope.projectListTemp = tmp;
            $scope.loadMore();
        }

        var loadRemote = function () {
            CMSService.showLoading();
            // InvestService.queryInvestProjectInfo(12)
            $scope.projectList = [];
            //var selectedP = _.find($scope.bidProgress, {"checked": true});
            var slectedPV = [];
            $scope.bidProgress.filter(function (t) {
                return t.checked
            }).map(function (t) {
                Array.prototype.push.apply(slectedPV, t.value)
            })
            var customeType = _.find($scope.customeType, {"checked": true});
            var periodList = periodArray.slice($scope.periods[0] - 1, $scope.periods[1]);
            InvestService.query(periodList, slectedPV, customeType.value)
                .then(function (list) {
                    var array = [];
                    if (list && list.length > 0) {
                        //list[3].investment.investmentCredibilityScore = 3;
                        //list[10].investment.investmentCredibilityScore = 4;
                        list.forEach(function (item) {
                            array.push(_convert(item));
                        })
                    }
                    return $q.all(array);
                })
                .then(function (list) {
                    return list;
                    //return AccountService.checkLoginStatus()
                    //    .then(function(){
                    //        return AccountService.myInvestments()
                    //            .then(function (obj) {
                    //                var holdList = [];
                    //                Array.prototype.push.apply(holdList,obj.hold || []);
                    //                Array.prototype.push.apply(holdList,obj.allying || []);
                    //                Array.prototype.push.apply(holdList,obj.end || []);
                    //                if (holdList) {
                    //                    holdList = holdList.map(function (t) {
                    //                        return t.Investment.investmentNumber;
                    //                    });
                    //                }
                    //                list.forEach(function (item) {
                    //                    item.bought = _.contains(holdList, item.investment.investmentNumber);
                    //                });
                    //                return list;
                    //            })
                    //
                    //    }) .catch(function(err){
                    //        return list;
                    //    })


                })
                .then(function (list) {

                    $scope.globalDataList = list;
                    if (list && list.length > 0) {
                        delete $scope.remoteError;
                        _filter();
                    } else {
                        $scope.remoteError = "没有找到结果";
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    $scope.remoteError = err ? (err.message || err) : "查询失败";
                })
                .finally(function () {
                    CMSService.hideLoading();
                })
        }

        var _convert = function (item) {
            item.bought = item.isInvestment;
            item.investment.investmentProgress = Math.floor((item.investment.investmentProgress * 100));
            return ODataService.dictionary("t_inv")
                .then(function (dicTable) {
                    if (dicTable) {
                        item.investment["investmentPeriodMap"] = parseInt(dicTable.getValue("inv_period", item.investment.investmentPeriod));
                        item.investment["investmentAnnualInterestRateMap"] = parseFloat(dicTable.getValue("inv_irate", item.investment.investmentAnnualInterestRate));
                        item.investment["investmentTargetMap"] = dicTable.getValue("inv_target", item.investment.investmentTarget);
                        item.investment["investmentLevelMap"] = dicTable.getValue("inv_lv", item.investment.investmentLevel);
                        item.investment["investmentCredibilityScoreMap"] = dicTable.getValue("inv_lv", item.investment.investmentCredibilityScore);
                        item.account["credibilityLevelMap"] = dicTable.getValue("inv_lv", item.investment.credibilityLevel);
                    }
                })
                .then(function () {
                    return ODataService.dictionary("t_acct");
                })
                .then(function (dicTable) {
                    if (dicTable) {
                        item.account["loanTypeMap"] = dicTable.getValue("tac_ltype", item.account.loanType);
                    }
                    var t = item.investment.investmentProgress;
                    item.investment.investmentProgress = t > 100 ? 100 : t;
                    return item;
                })
        }

        loadRemote();
        $scope.loadMore = function () {
            var list = $scope.projectListTemp;
            if (list && list.length > 0) {
                CMSService.showLoading();
                $timeout(function () {
                    CMSService.hideLoading();
                    $scope.projectList = $scope.projectList || [];

                    var tmp = list.splice(0, Math.min(10, list.length));

                    Array.prototype.push.apply($scope.projectList, tmp);
                }, 500);
            }
        }


        /*$scope.showProgress = function (t) {
         $(".animate-show").slideToggle(t || 400);
         if (!t) {
         $scope.showMore = !$scope.showMore;
         }
         $scope.collapseAll = !$scope.showMore;
         };
         $scope.showProgress(1);*/
        $scope.showMore = true;
        $scope.collapseAll = false;
        $scope.showProgress = function (ths) {
            //$(".animate-show").slideToggle();
            if ($scope.showMore) {
                $scope.showMore = !$scope.showMore;
                $scope.collapseAll = true;

            } else if ($scope.collapseAll) {
                $scope.collapseAll = !$scope.collapseAll;
                $scope.showMore = true;
            }
        }

        //publish time
        CMSService.publishTimes()
            .then(function (times) {
                $scope.publishTimes = times;
                _showLatestTime(times);
                $interval(function () {
                    _showLatestTime(times);
                }, 1000);
            });

        var _showLatestTime = function (times) {
            var c = DateTimeService.getNextPublishTime(times);
            var countDown = DateTimeService.countDown(c.date);
            var text1 = "距离下场开始仅剩 " + countDown.text;
            $("body > div.ng-scope > div.investWrapper.ng-scope > div.container > div.investProgress.mt20.f14.pr > div:nth-child(1) > div > p").html(text1);
            $("body > div.ng-scope > div.investWrapper.ng-scope > div.container > div.investProgress.mt20.f14.pr > div.animate-show > " +
            "div.fl.investProgressRight > div.ml20.mr20 > p.col999.ml50.mb10 > span:nth-child(1)").html(countDown.date.hours);
            $("body > div.ng-scope > div.investWrapper.ng-scope > div.container > div.investProgress.mt20.f14.pr > div.animate-show >" +
            " div.fl.investProgressRight > div.ml20.mr20 > p.col999.ml50.mb10 > span:nth-child(2)").html(countDown.date.minutes);
            $("body > div.ng-scope > div.investWrapper.ng-scope > div.container > div.investProgress.mt20.f14.pr > div.animate-show >" +
            " div.fl.investProgressRight > div.ml20.mr20 > p.col999.ml50.mb10 > span:nth-child(3)").html(countDown.date.seconds);
        }

        //judge current user if open or close auto invest
        // add by renhengli
        $scope.show = true;
        $scope.show1 = false;
        $scope.show2 = false;
        $scope.showtype=1;
        UtilsService.cache("username")
            .then(function (username) {
                return InvestService.getAccountSequenceByUsername(username);
            })
            .then(function (list) {
                if (list && list.length > 0) {
                    var accountSequence = list[0].AccountSequence;
                    return InvestService.judgeOpenOrCloseInvest(accountSequence)
                        .then(function (list) {
                            if (list.length == 0) {//close
                                $scope.show = true;
                                $scope.showtype=1;
                                $scope.show1 = false;
                                $scope.show2 = false;
                            } else {
                                list.forEach(function (r) {
                                    if (r.Type === 0) {//0-自动投资-一键式 1-自动投资-自助式
                                        if (r.Status === 0) {//0-已启用 1-未启用
                                            $scope.show = false;
                                            $scope.show1 = true;
                                            $scope.showtype=2;
                                        } else {
                                            $scope.show1 = false;
                                            //$scope.showtype=2;
                                        }
                                    } else {
                                        if (r.Status === 0) {//0-已启用 1-未启用
                                            $scope.show = false;
                                            $scope.show2 = true;
                                            $scope.showtype=3;
                                        } else {
                                        	//$scope.showtype=3;
                                            $scope.show2 = false;
                                        }
                                    }
                                });
                            }
                        })
                }

            }).catch(function (err) {
                console.log(err);
            });

    });
