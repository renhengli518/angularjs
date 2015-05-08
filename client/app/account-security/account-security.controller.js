'use strict';

angular.module('p2pClientApp')
    .controller('AccountSecurityCtrl', function ($scope, ConstantService, UtilsService, AccountService, CapitalService) {
        $scope.message = 'Hello';
        //跳汇富开通用户
        $scope.openAccount = function () {
            var url = '/acct/postnroute?jsonStr={"url":"-channelPay-registerparam"}';
            window.open(ConstantService.RouteUrl() + url);
        };
        $scope.flag = false;
        UtilsService.cache("username")
            .then(function (username) {
                // 检查用户是否设置了问题
                if (username) {
                    var promise = AccountService.checkAccountIsSetQuestion(username);
                    return promise.then(function (data) {//resolve
                        if (data && data.status === '226') {
                            $scope.flag = true;

                        } else if (data && data.status === '227') {
                            $scope.flag = false;
                        } else if (data && data.status === '200') {
                            $scope.flag = false;
//                        alert(data.msg);
                        } else {
                            $scope.flag = false;
//                        alert(data.msg);
                        }
                    })
                }
            }).catch(function (err) {
                console.log(err);
            });


        UtilsService.cache("thirdAccount").then(function (thirdAccount) {
            if (thirdAccount) {
                $scope.thirdAccount = thirdAccount;
                $scope.showThirdAccount = true;
            } else {
                return  CapitalService.queryCapitalInfo()
                    .then(function (data) {
                        if (data.status === "000") {
                            data = data.data;
                            $scope.accountFund = data;
                            $scope.account = $scope.accountFund.thirdAccount;
                        } else {
                            $scope.showThirdAccount = false;
                            console.error("Failed to retrieve basice info" + data.msg);
                        }
                    });
            }
        }).catch(function (err) {
            console.log(err);
        });

        /*  UtilsService.cache("account").then(function (account) {
         if (account && account.Safety) {
         $scope.checkPasswordSecurity(account.Safety);
         }
         }).catch(function (err) {
         console.log(err);
         });*/

        AccountService.getAccountById().then(function (obj) {//resolve
            if (obj && obj.status === '000') {
                if (obj.data && obj.data.safety) {
                    $scope.checkPasswordSecurity(obj.data.safety);
                    if (obj.data.safety === 1) {
                        $scope.safety = '低';
                    } else if (obj.data.safety === 2) {
                        $scope.safety = '中';
                    } else if (obj.data.safety === 3) {
                        $scope.safety = '高';
                    }
                }
            }
        });


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


    });
