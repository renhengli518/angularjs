'use strict';

angular.module('p2pClientApp')
    .controller('BuffetCtrl', function ($scope, InvestService, UtilsService, ConstantService) {
        $scope.errorMessage = "";
//        $scope.perMaxAmount = 50;
        //todo
        //add get current accountSequence
        $scope.initNeedInfo = function () {
            UtilsService.cache("username")
                .then(function (username) {
                    InvestService.getAccountSequenceByUsername(username).then(
                        function (list) {
                            var accountSequence = list[0].AccountSequence;
                            InvestService.judgeOpenOrCloseInvest(accountSequence)
                                .then(function (list) {
                                    if (list.length == 0) {//close
                                        $scope.flag = false;
                                    } else {
                                        list.forEach(function (r) {
                                            if (r.Status === 0) {//open  0 -- 已启用
                                                if (r.Type === 1) {//-- 1 自动投资-自助式
                                                    $scope.flag = true;
                                                } else {// -- 0 自动投资-一键式
                                                    $scope.flag = false;
                                                }
                                            } else {//close    1 -- 未启用
                                                $scope.flag = false;
                                            }
                                            $scope.perMaxAmount = r.PerMaxAmount;
                                            $scope.periods_1 = [];
                                            var x = r.Period.split(",");
                                            for (var i = 0; i < x.length; i++) {
                                                $scope.periods_1.push({
                                                    "value": i,
                                                    "text": x[i]
                                                });
                                            }
                                            $scope.creditLevels_1 = [];
                                            var y = r.CreditLevel.split(",");
                                            for (var w = 0; w < y.length; w++) {
                                                if (y[w] === '1') {
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "A"
                                                    });
                                                } else if (y[w] === '2') {
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "B"
                                                    });
                                                } else if (y[w] === '3') {
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "C"
                                                    });
                                                } else if (y[w] === '4') {
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "D"
                                                    });
                                                } else if (y[w] === '5') {
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "E"
                                                    });
                                                } else if (y[w] === '6') {
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "U"
                                                    });
                                                }else if (y[w] === '0') {
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "A+"
                                                    });
                                                }

                                            }

                                        });
                                    }
                                })
                                .catch(function (err) {
                                    console.log(err);
                                })
                                .finally(function () {
                                    CMSService.hideLoading();
                                });
                        }
                    ).catch(function (err) {
                            console.log(err);
                        });
                }).catch(function (err) {
                    console.log(err);
                });
        };
        $scope.initNeedInfo();

        //获取可用余额
        UtilsService.cache("accountFund")
            .then(function (a) {
                if (a) {
                    $scope.thirdAccount = a.thirdAccount;
                    $scope.availableBalance = a.availableBalance;
                }
            })
            .catch(function (err) {
                console.log(err);
            });

        $scope.periods = [
            {
                "name": "6期",
                "value": "6",
                "checked": false,
                "disabled": true
            },
            {
                "name": "12期",
                "value": "12",
                "checked": false,
                "disabled": true
            },
            {
                "name": "18期",
                "value": "18",
                "checked": false,
                "disabled": true
            },
            {
                "name": "24期",
                "value": "24",
                "checked": true,
                "disabled": false
            },
            {
                "name": "36期",
                "value": "36",
                "checked": false,
                "disabled": false
            }
        ];

        $scope.creditLevels = [
            {
                "name": "A+",
                "value": "0",
                "checked": true
            },
            {
                "name": "A",
                "value": "1",
                "checked": false
            },
            {
                "name": "B",
                "value": "2",
                "checked": false
            },
            {
                "name": "C",
                "value": "3",
                "checked": false
            },
            {
                "name": "D",
                "value": "4",
                "checked": false
            },
            {
                "name": "E",
                "value": "5",
                "checked": false
            }
            ,
            {
                "name": "U",
                "value": "6",
                "checked": false
            }
        ];

        //submit form
        $scope.MsgInfo = false;
        $scope.submitForm_open = function (isValid) {
            // check to make sure the form is completely valid
            var periodList = $scope.periods.filter(function (t) {
                return t.checked;
            }).map(function (t) {
                return t.value;
            }) || [];
            var creditLevelList = $scope.creditLevels.filter(function (t) {
                return t.checked;
            }).map(function (t) {
                return t.value;
            }) || [];

            if(!$scope.perMaxAmount_1){
                $scope.msg_info = '单笔最大投资金额不能为空';
                return;
            }
            if (periodList.length === 0) {
                $scope.msg_info = '投资期限不能为空';
                return;
            }
            if (creditLevelList.length === 0) {
                $scope.msg_info = '信用等级不能为空';
                return;
            }
            if (isValid) {
                var promise = InvestService.selfHelpInvest(Number($scope.perMaxAmount_1), periodList.toString(), creditLevelList.toString());
                promise.then(function (data) {
                        if (data && data.status === "000") {
                            $scope.flag = true;
                            $scope.MsgInfo = false;
                            var url = '/acct/postnroute?jsonStr={"url":"-channelPay-autoInvestmentStart","param":{"tenderPlanType":"W"}}';
                            window.open(ConstantService.RouteUrl() + url);
                            $scope.initNeedInfo();
                        } else if (data && data.status === '300') {
                            $scope.flag = false;
//                            $scope.errorMessage = data.msg;
                            $scope.MsgInfo = true;
                        } else {
                            console.log(data.msg);
                        }
                    }
                ).catch(function (err) {
                        console.log(err);
                    });
            }
        };

        //submit form
        $scope.submitForm_close = function () {
            var url = '/acct/postnroute?jsonStr={"url":"-channelPay-autoInvestmentClose","param":{}}';
            window.open(ConstantService.RouteUrl() + url);
        };

        $scope.judgeNumber = function () {
            $scope.show = false;
            $scope.msg_info = null;
            if (Number($scope.perMaxAmount_1) < 50) {
                $scope.lessThenNumber = true;
            } else if (Number($scope.perMaxAmount_1) % 50 > 0) {
                $scope.notIntNumber = true;
            } else if (Number($scope.perMaxAmount_1) > 5000) {
                $scope.moreThenNumber = true;
            }
        }

    });
