'use strict';

angular.module('p2pClientApp')
    .factory('CapitalService', function ($resource, $q, ConstantService, UtilsService) {
        var url = ConstantService.APIRoot() + "/capital";
        return {
            /**检索当前用户的资金账户
             * @param accountSequence 账户Id
             * @returns {*}
             */
            queryCapitalInfo: function () {

                // UtilsService.cache("accountFund", data);
                var query = {};
                return $resource(url + "/queryCapitalInfo", null, {
                    "query": {
                        "method": "POST"
                    }
                }).query(query).$promise
                    .then(function (t) {
                        if (t && t.status === "000") {
                            UtilsService.cache("accountFund", t.data);
                        }
                        return t;
                    });

            },
            /**
             * 资金账户开户
             * @param accId 账户ID
             * @param isborrower 是否是借款人
             */
            openCapitalAccount: function (accId, isborrower) {
                var defer = $q.defer();
                if (accId && isborrower) {
                    return $resource(url + "/openCapitalAccount")
                        .save({"accId": accId, "isborrower": isborrower}).$promise;
                } else {
                    defer.reject("isborrower and accid are required");
                    return defer.promise;
                }
            },
            /**
             * 资金充值
             * @param thirdPaymentAccount 三方账号
             * @param bankCard 银行卡号
             * @param price 金额
             * @returns {*}
             */
            rechargeCapital: function (thirdPaymentAccount, bankCard, price) {
                var defer = $q.defer();
                if (thirdPaymentAccount && bankCard && price) {
                    return $resource(url + "/rechargeCapital")
                        .save({
                            "thirdPaymentAccount": thirdPaymentAccount,
                            "bankCard": bankCard,
                            "price": price
                        }).$promise;
                } else {
                    defer.reject("thirdPaymentAccount and bankCard and price  are required");
                    return defer.promise;
                }
            },
            /**
             * 资金提现
             * @param ThirdPaymentAccount 三方账号
             * @param bankCard 银行卡号
             * @param price 金额
             * @returns {*}
             */
            depositCapital: function (ThirdPaymentAccount, bankCard, price) {
                var defer = $q.defer();
                if (ThirdPaymentAccount && bankCard && price) {
                    return $resource(url + "/depositCapital")
                        .save({
                            "ThirdPaymentAccount": ThirdPaymentAccount,
                            "bankCard": bankCard,
                            "price": price
                        }).$promise;
                } else {
                    defer.reject("ThirdPaymentAccount and bankCard and price  are required");
                    return defer.promise;
                }
            },
            capitalMath: function () {

            },
            calcProfitMonth: function () {
                return $resource(ConstantService.APIRoot() + "/deal/calcProfitMonth").save({}).$promise;
            },
            bankCardList: function () {
                return $resource(ConstantService.APIRoot() + "/accountBankCard/queryAccountBankCard").save({}).$promise
                    .then(function (d) {
                        if (d && d.status === "000") {
                            return d.data;
                        } else {
                            return $q.reject(d.msg);
                        }
                    })
            },
            topupFees: function (amount) {//calculate topup fees
                return $resource(ConstantService.APIRoot() + "/channelPay/feeIncome")
                    .save({
                        "amount": amount
                    }).$promise
            }
        }
    });
