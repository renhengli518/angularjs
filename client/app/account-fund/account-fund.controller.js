'use strict';

angular.module('p2pClientApp')
    .controller('AccountFundCtrl', function ($scope, _, CMSService, $filter, $q, AccountFundService, ngTableParams, UtilsService, CapitalService, AccountService) {
        $scope.selection = 'transaction';
        $scope.today = new Date();
        $scope.startdate = new Date("2015-03-01");
        $scope.enddate = new Date();
        var resetPagination = false;
        var changeTab = false;
        var loaded = false;
        $scope.$watch("selection", function (newValue, oldValue) {
            if (newValue && loaded) {
                $scope.global[_map[$scope.selection]] = [];
                _reloadTableParams();
            }
        });
        var _map = {
            "transaction": "transactionList",
            "topup": "topupList",
            "withdrawal": "withdrawalList"
        }

        $scope.$watch("statusList", function (newVal, oldVal) {
            if (newVal && loaded) {
                _reloadTableParams();
            }
        }, true);
        $scope.$watch("typeList", function (newVal, oldVal) {
            if (newVal && loaded) {
                _reloadTableParams();
            }
        }, true);

        var _reloadTableParams = function () {
            resetPagination = true;
            var newValue = $scope.selection;
            changeTab = true;
            if (newValue === "transaction") {
                $scope.transactionTableParams.reload();
                //$scope.transactionTableParams.reloadPages();
            } else if (newValue === "topup") {
                $scope.topupTableParams.reload();
                //$scope.topupTableParams.reloadPages();
            } else if (newValue === "withdrawal") {
                $scope.withdrawalTableParams.reload();
                //$scope.withdrawalTableParams.reloadPages();
            }
        }


        var _filter = function () {
            var historyData = _.cloneDeep($scope.global[_map[$scope.selection]]);
            if (historyData && historyData.length > 0) {
                var status = _.find($scope.statusList, {"selected": true});
                if (status && status.name !== "全部") {
                    historyData = historyData.filter(function (item) {
                        if ($scope.selection === "topup" || $scope.selection === "withdrawal") {
                            return item.OperateStats === status.name;
                        } else {
                            return item;
                        }
                    });
                }
                var type = _.find($scope.typeList, {"selected": true});
                if (type && type.name !== '全部') {
                    historyData = historyData.filter(function (item) {
                        if ($scope.selection === "transaction") {
                            return item.TradeType === status.value;
                        } else {
                            return item;
                        }
                    });
                }
                $scope[_map[$scope.selection]] = historyData;
                return historyData;
            } else {
                return null;
            }


        }

        $scope.global = {};

        var _init = function () {
            UtilsService.showLoading();
            return CapitalService.queryCapitalInfo()
                .then(function (obj) {
                    if (obj && obj.status === "000") {
                        $scope.accountFund = obj.data;
                    } else {
                        console.info("Failed to retrieve basic info " + obj ? obj.msg : "");
                        return $q.reject();
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
                .finally(function () {
                    // UtilsService.hideLoading();
                });
        }
        _init();
        var _retrieve = function (currentPage, pageCount) {
            if (changeTab) {
                currentPage = 1;
                changeTab = false;
            }
            // return UtilsService.cache("accountFund")
            UtilsService.showLoading();
            return AccountService.checkLoginStatus()
                .then(function (obj) {
                    if (obj.authenticated) {
                        //var enddata = $scope.enddate.toUTCString();
                        $scope.enddata = $scope.enddate || new Date()
                        var enddata = "";
                        if (typeof $scope.enddata === "object") {
                            enddata = $scope.enddata.toUTCString();
                        } else {
                            enddata = $scope.enddata;
                        }

                        enddata = new Date(enddata);
                        enddata.setDate(enddata.getDate() + 1);
                        enddata.setHours(8, 0, 0);
                        $scope.startdate = $scope.startdate || new Date()
                        var startDate = "";
                        if (typeof $scope.startdate === "object") {
                            startDate = $scope.startdate.toUTCString();
                        } else {
                            startDate = $scope.startdate;
                            var reg = /^[0-9]*$/;
                            if (reg.test(startDate)) {
                                startDate = parseInt(startDate);
                            }
                        }
                        startDate = new Date(startDate);
                        startDate.setHours(8, 0, 0);
                        var status = _.find($scope.statusList, {"selected": true}).values;
                        var types = _.find($scope.typeList, {"selected": true}).values;

                        var fnName = $scope.selection;
                        if (fnName === "transaction") {
                            fnName = "accountTransaction";
                        }
                        currentPage = currentPage - 1;
                        return AccountFundService[fnName](obj.name, startDate, enddata, currentPage, pageCount, status, types)
                            .then(function (obj) {
                                $scope[_map[$scope.selection]] = obj.data;
                                $scope.global[_map[$scope.selection]] = obj.data;
                                return obj;
                            })
                    } else {
                        console.info("用户未登录");
                        AccountService.reLogin();
                    }

                })
                .catch(function (err) {
                    $scope[_map[$scope.selection]] = null;
                })
                .finally(function () {
                    UtilsService.hideLoading();
                });
        }


        $scope.transactionTableParams = $scope.withdrawalTableParams = $scope.topupTableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10          // count per page
        }, {
            total: 0,           // length of data
            getData: function ($defer, params) {
                loaded = true;
                if (resetPagination) {
                    params.page(1);
                    resetPagination = false;
                }
                _retrieve(resetPagination ? 1 : params.page(), params.count())
                    .then(function (obj) {
                        if (obj) {
                            var data = obj.data;
                            data = data.map(function (t) {
                                if (t && ( t.GatherAccountSequence || t.gatherAccountSequence)) {
                                    //var secondType = [4, 22, 29];
                                    //if (secondType.some(function (t1) {
                                    //        return t1 === t.TradeType;
                                    //    })) {
                                    //    t.secondType = true;
                                    //}

                                    if (t.TradeType === 4 || t.TradeType === 22 || t.TradeType === 29 || t.TradeType === 27) {
                                        t.secondType = true;
                                    } else {
                                        t.secondType = false;
                                    }
                                }
                                return t;
                            })
                            //var data = params.sorting() ?
                            //    $filter('orderBy')(data, params.orderBy()) :
                            //    data;
                            params.total(obj.total);
                            $defer.resolve(data);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
            }
        });


        $scope.selectType = function (name) {
            $scope.typeList.forEach(function (t) {
                t.selected = (t.name === name);
            })
        }

        $scope.selectStatus = function (name) {
            $scope.statusList.forEach(function (t) {
                t.selected = (t.name === name);
            })
        }

        $scope.statusList = [
            {
                "name": "全部",
                "selected": true,
                "values": [0, 1]
            }, {
                "name": "失败",
                "selected": false,
                "values": [1]
            }, {
                "name": "成功",
                "selected": false,
                "values": [0]
            }
        ];
        //网银充值 trade_type = 14 and order_stat in (3 , 4)
        //提现  trade_type = 15 and order_stat in (3 , 4)
        //提现手续费 trade_type= 21 and order_stat in (3 , 4)
        //投资冻结 trade_type =23  and order_stat in (3 , 4)
        //投资资金解冻  trade_type = 3 and order_stat in (3 , 4)
        //投资放款 trade_type = 2 and order_stat in (3 , 4)
        //本息收入 trade_type = 4  and order_stat in (3 , 4)
        //投资管理费 trade_type = 22 and order_stat in (3 , 4)
        //罚息收入 trade_type = 29 and order_stat in (3 , 4)
        //垫付本息收入 trade_type = 27 and order_stat in (3 , 4)

        $scope.typeList = [
            {
                "name": "全部",
                "values": [2, 3, 4, 13, 14, 15, 21, 22, 23, 27, 29],
                "selected": true
            },
            {
                "name": "充值",
                "selected": false,
                "values": [14]
            }, {
                "name": "提现",
                "selected": false,
                values: [15]
            }, {
                "name": "奖励",
                "selected": false,
                values: [13]
            }
        ]


        //date picker
        $scope.dateRange = [
            {
                "name": "今天",
                "value": 0,
                "selected": false
            }, {
                "name": "最近1个月",
                "value": 1,
                "selected": false
            }, {
                "name": "3个月",
                "value": 3,
                "selected": false
            }, {
                "name": "半年",
                "value": 6,
                "selected": false
            }, {
                "name": "一年",
                "value": 12,
                "selected": false
            }
        ];
        $scope.selectRange = function (d) {
            $scope.dateRange = _.map($scope.dateRange, function (t) {
                t.selected = (t.name === d.name);
                return t;
            });
            var startD = $('#end').datepicker("getDate");
            $scope.enddate = _.cloneDeep(startD);
            startD.setMonth(startD.getMonth() - d.value);
            $scope.startdate = _.cloneDeep(startD);
            $("#start").datepicker("setDate", startD);
            _reloadTableParams();
        }

        $scope.startDateOptions = {
            dateFormat: 'yy-mm-dd',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            onClose: function (selectedDate) {
                var end = $('#end');
                //var d = $('#start').datepicker("getDate");
                //end.datepicker("setDate", new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
                end.datepicker("option", "minDate", new Date(selectedDate));
                //$scope.enddate = parseInt($scope.startdate) + 24 * 60 * 60 * 1000;
                $scope.startdate = new Date(selectedDate);
                if ($scope.enddate < $scope.startdate) {
                    $scope.enddate = $scope.startdate;
                }
                _reloadTableParams();
            }
        };
        $scope.endDateOptions = {
            dateFormat: 'yy-mm-dd',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            onClose: function (selectedDate) {
                var start = $("#start");
                //if (start.val() == '') {
                //    var d = $('#end').datepicker("getDate");
                //    start.datepicker("setDate",
                //        new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
                //    $scope.startdate = parseInt($scope.enddate) - 24 * 60 * 60 * 1000;
                //}
                start.datepicker("option", "maxDate", new Date(selectedDate));
                $scope.enddate = new Date(selectedDate);
                if ($scope.enddate < $scope.startdate) {
                    $scope.startdate = $scope.enddate;
                }

                _reloadTableParams();
            }
        };
    });
