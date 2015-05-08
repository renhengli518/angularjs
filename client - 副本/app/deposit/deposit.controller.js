'use strict';

angular.module('p2pClientApp').controller('DepositCtrl', function ($scope, $rootScope, CapitalService, _, ConstantService) {
//    $scope.message = 'Hello';
    /**
     * 资金充值
     * @param thirdPaymentAccount 三方账号
     * @param bankCard 银行卡号
     * @param price 金额
     * @returns {*}
     */
        //TODO
    $scope.selectedBank1 = '';
    var bankImage = [
        {
            "bankCode": 10,
            "bankName": "工商银行",
            "image": "assets/images/gongshangyinhang.png",
            "name": "gongshangyinhang"
        },
        {
            "bankCode": 11,
            "bankName": "农业银行",
            "image": "assets/images/nongyeyinhang.png",
            "name": "nongyeyinhang"
        },
        {
            "bankCode": 12,
            "bankName": "中国银行",
            "image": "assets/images/zhongguoyinhang.png",
            "name": "zhongguoyinhang"
        },
        {
            "bankCode": 13,
            "bankName": "建设银行",
            "image": "assets/images/jiansheyinhang.png",
            "name": "jiansheyinhang"
        },
        {
            "bankCode": 14,
            "bankName": "交通银行",
            "image": "assets/images/jiaotongyinhang.png",
            "name": "jiaotongyinhang"
        },
        {
            "bankCode": 15,
            "bankName": "中信银行",
            "image": "",
            "name": "zhongxinyinhang"
        },
        {
            "bankCode": 16,
            "bankName": "广东发展银行",
            "image": "",
            "name": "gongdongfazhanyinhang"
        },
        {
            "bankCode": 17,
            "bankName": "民生银行",
            "image": "assets/images/minshengyinhang.png",
            "name": "minshengyinhang"
        },
        {
            "bankCode": 18,
            "bankName": "招商银行",
            "image": "assets/images/zhaoshangyinhang.png",
            "name": "zhaoshangyinhang"
        },
        {
            "bankCode": 20,
            "bankName": "光大银行",
            "name": "guangdayinhang"
        },
        {
            "bankCode": 19,
            "bankName": "华夏银行",
            "image": "",
            "name": "huaxiayinhang"
        },
        {
            "bankCode": 21,
            "bankName": "兴业银行",
            "image": "assets/images/xingyeyinhang.png",
            "name": "xingyeyinhang"
        },
        {
            "bankCode": 25,
            "bankName": "上海银行",
            "image": "assets/images/shanghaiyinhang.png",
            "name": "shanghaiyinhang"
        }, {
            "bankCode": 22,
            "bankName": "浦发银行",
            "name": "spd"
        }, {
            "bankCode": 23,
            "bankName": "中国邮政银行",
            "name": "postal"
        }
    ]
    $scope.deposit = function () {
        var selectedBank = _.find(bankImage, {"name": $scope.selectedBank1})
        if ($scope.topupMoney) {

            if (selectedBank) {
                window.open(ConstantService.APIUrl() + '/p2p/app/acct/postnroute?jsonStr={"url":"-channelPay-rechargeCapital","param":{"transAmt":"' + $scope.topupMoney + '","openBankId":"' + selectedBank.bankCode + '"}}');
            } else {
                window.open(ConstantService.APIUrl() + '/p2p/app/acct/postnroute?jsonStr={"url":"-channelPay-rechargeCapital","param":{"transAmt":"' + $scope.topupMoney + '"}}');
            }


            //+ '","openBankId":"' + selectedBank.bankCode


        }
    };

    //$scope.$watch("bank", function (newV, oldV) {
    //    if (newV) {
    //        $scope.selectedBank = _.find(bankList, {
    //            "bankShortName": newV
    //        });
    //    }
    //});


});
