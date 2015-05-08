'use strict';

angular.module('p2pClientApp').controller('AccountCtrl', function (ConstantService, AccountService, $scope, $rootScope, CapitalService, AccountFundService, $sessionStorage, UtilsService, InvestService, $q, $timeout) {
    var calendarLoaded = false;
    $scope.currentDate = new Date();
    $scope.visiable1 = false;
    $scope.visiable2 = false;
    var _chart1 = function (dataArray) {
        /*if (!dataArray) {
         dataArray = [
         {
         name: '预计收益',
         data: [0, 14, 0]
         },
         {
         name: '本金',
         data: [0, 10, 20, 0]
         },
         {
         name: '已收益',
         data: [0, 5, 15, 30, 0]
         }
         ];
         }*/
        $('#container').highcharts({
            chart: {
                type: 'areaspline'
            },
            colors: ['#ffb299', '#7fd8ff', '#b4dfa7'],
            title: {
                text: ''
            },
            exporting: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            legend: {
				width: '200px',
				symbolWidth : 8,
				symbolHeight : 8
            },
            xAxis: {
                labels: {
                    formatter: function () {
                        return null
                    }
                },
                gridLineWidth: 0
            },
            yAxis: {
                title: {
                    text: ''
                },
                labels: {
                    formatter: function () {
                        return null;
                    }
                },

                gridLineWidth: 0,
                lineColor: '#fff',
                lineWidth: 0
            },
            tooltip: {
                pointFormat: '{series.name}'
            },
            series: dataArray
        });
    };
    var _chart2 = function (dataArray, category) {
        if (!dataArray) {
            dataArray = [
                {
                    name: '月总收益额变动趋势图',
                    data: [0, 5, 22, 40, 30, 10, 60]
                }
            ];
        }
        /*      else{
         dataArray.forEach(function(t){
         t.name='';
         });
         }*/
        $('#container1').highcharts({
            chart: {
                type: 'areaspline',
                width: 680
            },
            colors: ['#caeeca'],
            title: {
                text: ''
            },
            exporting: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: category || [
                    '1月',
                    '2月',
                    '3月',
                    '4月',
                    '5月',
                    '6月',
                    '7月'
                ],
                gridLineWidth: 1,
                gridLineColor: '#e6eaee'
            },
            credits: {
                enabled: false
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineWidth: 1,
                gridLineColor: '#e6eaee'
            },
            tooltip: {
                pointFormat: '{series.name} {point.x}'
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            series: dataArray
        });
    };
    $scope.eventSources = [];
    /*$scope.uiConfig = {
     calendar: {
     height: 300,
     editable: true,
     header: {
     left: 'prev',
     center: 'title',
     right: 'next'
     },
     eventLimit: true,
     events: [
     {
     id: 999,
     title: 'Repeating Event',
     start: '2015-01-09T16:00:00'
     },
     {
     id: 999,
     title: 'Repeating Event',
     start: '2015-01-16T16:00:00'
     },
     {
     title: 'Conference',
     start: '2015-01-11',
     end: '2015-01-13'
     }
     ],

     eventClick: $scope.alertOnEventClick,
     eventDrop: $scope.alertOnDrop,
     eventResize: $scope.alertOnResize,
     eventRender: $scope.eventRender
     }
     };
     $scope.uiConfig.calendar.dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
     $scope.uiConfig.calendar.dayNamesShort = ["日", "一", "二", "三", "四", "五", "六"];
     $scope.uiConfig.calendar.monthNames = ["01", "02", "03", "04", "05", "06", "07","08", "09", "10", "11", "12"];
     $scope.uiConfig.calendar.titleFormat = 'yyyy 年 MMMM 月';*/


    //get user account info
    var _getUserAccountInfo = function () {
        return CapitalService.queryCapitalInfo()
            .then(function (data) {
                ///**三方账号*/
                //private String thirdAccount;
                ///**可用余额*/
                //private BigDecimal availableBalance;
                ///**冻结资金*/
                //private BigDecimal forzenCapital;
                //
                ///**持有项目*/
                //private Integer holdProject;
                ///**预期总收益*/
                //private BigDecimal investCapital;
                ///**今日总收益*/
                //private BigDecimal yield;
                ///**累计收益*/
                //private BigDecimal totalIncome;
                //
                ///**今日投资项目*/
                //private Integer investProjectToday;
                ///**今日投资金额*/
                //private BigDecimal investCapitalToday;
                ///**今日逾期投资项目*/
                //private Integer investProjectOverdue;
                ///**今日逾期投资金额*/
                //private BigDecimal investCapitalOverdue;
                ///**预计本月待收*/
                //private BigDecimal totalIncomeMonth;
                ///**本月已收*/
                //private BigDecimal haveIncomeMonth;
                if (data.status === "000") {
                    data = data.data;
                    $scope.accountFund = data;
                    $scope.visiable1 = !($scope.accountFund.thirdAccount);
                    //alert($scope.visiable1);
                    //$scope.thirdAccount = data.thirdAccount;
                    //$scope.availableBalance = data.availableBalance;
                    //$scope.forzenCapital = data.forzenCapital;
                    UtilsService.cache("thirdAccount", $scope.accountFund.thirdAccount);
                    return AccountFundService.wdzh02MyInvest()
                        .then(function (data) {
                            $scope.fundDetail = data;
                        });

                    $rootScope.thirdAccount = data.thirdAccount;
                    //$scope.noThirdAccount = !$scope.accountFund.thirdAccount;
                } else {
                    console.info("Failed to retrieve basice info " + data.msg);
                }

            })
            .then(function () {
                return CapitalService.calcProfitMonth()
                    .then(function (d) {
                        if (d && d.status === "000") {
                            return d.data;
                        } else {
                            console.info(d.msg);
                        }
                    })
            })
            .then(function (calcProfitMonth) {
                var thirdAccount = $scope.accountFund;
                //var fundDetail = $scope.fundDetail || {
                //        benefitAmt: 4,
                //        expectedReturnAmt: 5
                //    };
                var fundDetail = $scope.fundDetail;
                if (thirdAccount && fundDetail) {
                    var array = [];

                    var benefitAmt = Number(fundDetail.investTtlAmt);//在投本金
                    var totalIncome = fundDetail.accumulatedIncome;//总收益
                    var expectedReturnAmt = fundDetail.expectedReturnAmt;//expectedReturnAmt  预期总收益
                    var total = benefitAmt + totalIncome + expectedReturnAmt;
                    array.push({
                        name: '预期收益',
                        data: [0, parseFloat(expectedReturnAmt / total).toFixed(2) * 100, 0, 0, 0]
                    });
                    array.push({
                        name: '在投本金',
                        data: [0, 0, parseFloat(benefitAmt / total).toFixed(2) * 100, 0, 0]
                    });
                    array.push({
                        name: '已收收益',
                        data: [0, 0, 0, parseFloat(totalIncome / total).toFixed(2) * 100, 0]
                    });
                    _chart1(array);
                    //investCapital
                    var array1 = [
                        {
                            name: '月总收益额变动趋势图',
                            data: [0, 5, 22, 40, 30, 10, 60]
                        }
                    ];

                    var o = {
                        name: '月总收益额变动趋势图',
                        data: []
                    }
                    var categories = [];
                    if (calcProfitMonth) {
                        calcProfitMonth.forEach(function (calcProfitMonth1) {
                            for (var key in calcProfitMonth1) {
                                o.data.push(calcProfitMonth1[key]);
                                categories.push(key);
                            }
                        })

                    }
                    o.data.reverse();
                    categories.reverse();
                    _chart2([o], categories);
                }
            })
            .then(function () {
                var start = new Date();
                var end = new Date();
                start.setMonth(start.getMonth() - 36);
                start.setDate(0);
                //start.setYear(start.getYear() - 3)
                end.setMonth(end.getMonth() + 24, 0);
                return _getUserDeals(start, end)
                    .then(function () {
                        _showDateDeal();
                    })
            })
    };

    $scope.currentMonthDeals = null;
    function _getUserDeals(start, end) {
        return AccountService.currentUserDeals(start, end)
            .then(function (data) {
                if (data && data.status === "000") {
                    $scope.currentMonthDeals = _sortDealData(data.data);

                } else {
                    return $q.reject(data.msg);
                }
            })
            .catch(function (err) {
                console.info(err);
            })
    }

    function _showDateDeal(date, noEvent) {
        var currentDate = new Date();
        if (!date) {
            date = new Date();
        }

        if (date.getMonth() === currentDate.getMonth() && date.getDate() === currentDate.getDate()) {
            $scope.currentDate = true;
        } else {
            $scope.currentDate = false;
        }

        var month = date.getMonth() + 1 + "";
        if (month.length === 1) {
            month = "0" + month;
        }
        var monthKey = date.getFullYear() + "/" + month;
        var dayKey = date.getDate();
        var result = _extractEvents(monthKey, dayKey);
        if (!noEvent) {
            _initDatePicker();
        }

        delete result.events;
        calendarLoaded = true;
        result.date = monthKey.split("/")[1] + "/" + dayKey;
        $scope.currentDateDeal = result;
        $timeout(function () {//add by renhengli 2015-04-10
            $scope.$apply()
        });
    }


    function _sortDealData(obj) {
        if (obj && Object.keys(obj).length > 0) {
            for (var monthKey in obj) {
                var dateMap = obj[monthKey]["date"];
                for (var dayKey in dateMap) {
                    var t = {
                        "overdue": [],
                        "paid": [],
                        "hold": []
                    };
                    dateMap[dayKey].forEach(function (item) {
                        if (item.claimGatherPlanStatus === 3) {
                            t.overdue.push(item);
                        } else if (item.claimGatherPlanStatus === 4) {
                            t.paid.push(item);
                        } else {
                            t.hold.push(item);
                        }
                    });
                    dateMap[dayKey] = t;
                }
            }
        }
        return obj;
    }

    function _extractEvents(monthKey, dayKey) {
        var result = {
            "expectTotal": 0,
            "expectNumber": 0,
            "paidTotal": 0,
            "paidNumber": 0,
            "monthExpectTotal": 0,
            "monthPaidTotal": 0,
            "holdNumber": 0,
            "holdTotal": 0
        };
        if ($scope.currentMonthDeals) {
            var events = [];
            var total = _.cloneDeep($scope.currentMonthDeals);
            //if (!date) {
            //    date = new Date();
            //}
            //var monthKey = moment(date, "YYYY/MM");
            //var dayKey = date.getDate()+1;
            var monthMap = total[monthKey];


            //get current month information
            if (monthMap) {
                result.monthExpectTotal = monthMap.expect;
                result.monthPaidTotal = monthMap.paid;
                for (var d in monthMap["date"]) {
                    var d1 = monthKey.replace("/", "-") + "-" + d;
                    var tmp = monthMap.date[d];
                    if (tmp.overdue && tmp.overdue.length > 0) {
                        events.push({
                            title: '逾',
                            start: d1,
                            className: 'beyond'
                        })
                    }
                    if (tmp.paid && tmp.paid.length > 0) {
                        events.push({
                            title: '￥',
                            start: d1,
                            className: 'dollar'
                        })
                    }
                    if (tmp.hold && tmp.hold.length > 0) {
                        events.push({
                            title: '￥',
                            start: d1,
                            className: 'dollar'
                        })
                    }
                }

                if (dayKey) {
                    var t1 = monthMap["date"][dayKey];
                    if (t1 && t1.paid) {
                        result.paidNumber = t1.paid.length;
                        if (t1.paid.length > 0) {
                            t1.paid.push({
                                claimGatherPlanActualTotalAmount: 0
                            })
                            result.paidTotal = t1.paid.reduce(function (pre, current) {
                                return pre.claimGatherPlanActualTotalAmount || pre + current.claimGatherPlanActualTotalAmount;
                            })
                        }

                    }
                    if (t1 && t1.overdue) {
                        result.expectNumber = t1.overdue.length;
                        if (t1.overdue.length) {
                            t1.overdue.push({
                                claimGatherPlanActualTotalAmount: 0
                            })
                            result.expectTotal = t1.overdue.reduce(function (pre, current) {
                                return pre.claimGatherPlanActualTotalAmount || pre + current.claimGatherPlanActualTotalAmount;
                            })
                        }

                    }
                    if (t1 && t1.hold) {
                        result.holdNumber = t1.hold.length;
                        if (t1.hold.length) {
                            t1.hold.push({
                                claimGatherPlanActualTotalAmount: 0
                            })
                            result.holdTotal = t1.hold.reduce(function (pre, current) {
                                return pre.claimGatherPlanActualTotalAmount || pre + current.claimGatherPlanActualTotalAmount;
                            })
                        }

                    }
                }
            }

            //get all months events
            for (var monthkey1 in total) {
                monthMap = total[monthkey1];
                if (monthMap) {
                    for (var d in monthMap["date"]) {
                        var d1 = monthkey1.replace("/", "-") + "-" + d;
                        var tmp = monthMap.date[d];
                        if (tmp.overdue && tmp.overdue.length > 0) {
                            events.push({
                                title: '逾',
                                start: d1,
                                className: 'beyond'
                            })
                        }
                        if (tmp.paid && tmp.paid.length > 0) {
                            events.push({
                                title: '￥',
                                start: d1,
                                className: 'dollar'
                            })
                        }
                    }
                }
            }
            result.events = events;
        }

        return result;
    }


    function _initDatePicker() {
        var events = [];

        var t = _.cloneDeep($scope.currentMonthDeals)
        for (var monthKey in t) {
            for (var dateKey in t[monthKey].date) {
                var e = _extractEvents(monthKey, dateKey);
                e = e ? (e.events ? e.events : []) : [];
                if (e) {
                    Array.prototype.push.apply(events, e);
                }
            }
        }

        if (!events) {
            events = [
                {
                    title: '逾',
                    start: '2015-01-01',
                    className: 'beyond'
                },
                {
                    title: '逾',
                    start: '2015-01-05'
                },
                {
                    title: '￥',
                    start: '2015-01-09',
                    className: 'dollar'
                },
                {
                    title: '￥',
                    start: '2015-01-29',
                    className: 'dollar'
                }
            ];
        }

        $('#calendar').fullCalendar({
            height: 300,
            editable: true,
            eventLimit: true,
            header: {
                left: 'prev',
                center: 'title',
                right: 'next'
            },
            dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
            monthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            titleFormat: 'yyyy 年 MMMM 月',
            selectable: true,
            selectHelper: true,
            select: function (start, end) {
                _showDateDeal(start, true);
            },
            eventClick: function (t1, t2) {
                _showDateDeal(t1.start, true);
            },
            //viewRender: function (t) {
            //    if(calendarLoaded) {
            //        calendarLoaded = false;
            //        var start = t.start;
            //        var end = t.end;
            //        _getUserDeals(start,end);
            //    }
            //
            //},
            events: events
        });
    }

    function _changeEvents(events) {
        if (events) {
            events.forEach(function (event) {
                $('#calendar').fullCalendar("renderEvent", event);
            })
        }

    }

    var _initAccount = function () {
        return AccountService.getAccountById().then(function (data) {
            if (data && data.status === '000' && data.data) {
                var account = data.data;
                $scope.checkPasswordSecurity(account.safety);
                $scope.username = account.userName;
                $scope.email = account.email;
                $scope.gender = account.gender;
                //TODO dk 4.2 begin
                var mobile = account.mobile;
                //eg:123****1234
                $scope.formatmobile = mobile.substring(0, 3) + "****" + mobile.substring(7);
                console.log(account);
                //TODO dk 4.2 end
                if (account.safety === 1) {
                    $scope.safety = '低';
                } else if (account.safety === 2) {
                    $scope.safety = '中';
                } else if (account.safety === 3) {
                    $scope.safety = '高';
                }
                if (account.emailBindStatus === 0) {
                    $scope.emailBindStatus = true;
                } else if (account.emailBindStatus === 1) {
                    $scope.emailBindStatus = false;
                }
                return AccountFundService.topup(account.accountSequence).then(function (obj) {
                    if (obj.total === 0) {
                        $scope.chongzhi = false;
                    } else {
                        $scope.chongzhi = true;
                    }
                    //TODO dk 2015.4.13 begin
                    //alert($scope.accountFund);
                    if ($scope.accountFund) {
                        if ($scope.accountFund.thirdAccount) {
                            $scope.visiable2 = !($scope.isInvested) && !($scope.chongzhi);
                        } else {
                            $scope.visiable2 = false;
                        }
                    } else {
                        $scope.visiable1 = true;
                    }

                    //$scope.visiable2 = $scope.accountFund.thirdAccount?(!($scope.isInvested)&&!($scope.chongzhi)):false
                    //$scope.visiable1 = !($scope.accountFund.thirdAccount);
                    //TODO dk 2015.4.13 end
                }).finally(function () {
                    return $scope._getCurrentUserLoginLog(account.accountSequence);
                });


            }
        })
    }

    $scope.checkPasswordSecurity = function (safety) {
        var levels = ["1", "2", "3"];
        if (safety) {
            if (safety === 3) {
                levels = [
                    "normalGreenBg1",
                    "normalGreenBg2",
                    "normalGreenBg3"
                ];
            } else if (safety === 2) {
                levels = [
                    "normalOrangeBg1",
                    "normalOrangeBg2",
                    "3"
                ];

            } else if (safety === 1) {
                levels = [
                    "normalRedBg",
                    "2",
                    "3"
                ];
            }
        }
        $scope.levels = levels;
    };
    $scope._getCurrentUserLoginLog = function (accountSequence) {
        return AccountService.getCurrentUserLoginLog(accountSequence).then(
            function (list) {
                if (list.length >= 2) {
                    $scope.loginDate = list[list.length - 2].AccountLoginDate;
                } else {//首次登陆时间
                    $scope.loginDate = list[0].AccountLoginDate;
                }

            }
        )
    }

    $scope.loginThirdPayAccount = function () {
        if ($scope.accountFund.thirdAccount) {
            window.open('/p2p/app/acct/postnroute?jsonStr={"url":"-capital-getUserLoginParam","param":{}}', "_blank");
        }
    };
    /*_calendar*/


    var width1 = 0;
    var width2 = 0;
    $scope.hideChart = function () {
        width1 = $("#container1 .highcharts-container").width();
        width2 = $(".hasborder").width();
        $(".hasborder").animate({
            "width": 0
        }, "slow", function () {
            $(".hasborder").hide()
        });
    };
    $scope.openChart = function () {
        $(".hasborder").show()
        $(".hasborder").animate({
            "width": width2
        }, "slow");
    };
    $scope.hideChart();

    //跳汇富开通用户
    $scope.openAccount = function () {
        var url = '/acct/postnroute?jsonStr={"url":"-channelPay-registerparam"}';
        window.open(ConstantService.RouteUrl() + url);
    };

    var _checkCurrentInvest = function () {
        return InvestService.isCurrentAccountInvested().then(function (data) {
            UtilsService.showLoading();
            if (data && data.status === '000') {
                if (data.data.isInvested) {
                    $scope.isInvested = true;
                } else {
                    $scope.isInvested = false;
                }
            } else {
                $scope.isInvested = false;
            }
        }).catch(function (err) {
            console.log(err);
        });
    }


    var _init = function () {
        UtilsService.showLoading();
        var t = $rootScope;
        $q.all([
            _checkCurrentInvest(),
            _getUserAccountInfo(),
            _initAccount()
        ])
            .catch(function (err) {
                console.error(err);
            })
            .finally(function () {
                UtilsService.hideLoading();

            })
    }
    _init();
});
