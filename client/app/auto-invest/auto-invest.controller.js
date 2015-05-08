'use strict';

angular.module('p2pClientApp')
    .controller('AutoInvestCtrl', function (CapitalService, ConstantService, $scope, UtilsService, InvestService) {

        //跳汇富开通用户
        $scope.openAccount = function () {
            var url = '/acct/postnroute?jsonStr={"url":"-channelPay-registerparam"}';
            window.open(ConstantService.RouteUrl() + url);
        };
        CapitalService.queryCapitalInfo()
            .then(function (data) {
                if (data.status === "000") {
                    data = data.data;
                    $scope.thirdAccount = data.thirdAccount;
                }
            }).catch(function (err) {
                console.log(err);
            }).finally(function () {
                UtilsService.hideLoading();
            })

        //judge current user if open or close auto invest
        UtilsService.cache("username")
            .then(function (username) {
                if (username) {
                    return InvestService.getAccountSequenceByUsername(username).then(
                        function (list) {
                            if (list && list.length > 0) {
                                var accountSequence = list[0].AccountSequence;
                                return InvestService.judgeOpenOrCloseInvest(accountSequence)
                                    .then(function (list) {
                                        if (list.length == 0) {//close
                                            $scope.flag = false;
                                        } else {
                                            list.forEach(function (r) {
                                                if (r.Status === 0) {//open
                                                    $scope.flag = true;
                                                } else {//close
                                                    $scope.flag = false;
                                                }
                                            });
                                        }
                                    })
                            }

                        }
                    )
                }
            }).catch(function (err) {
                console.log(err);
            })
            .finally(function () {
                UtilsService.hideLoading();
            })

    });
