'use strict';

angular.module('p2pClientApp')
    .factory('FinanceService', function (ConstantService, $resource, $q, ODataService) {
        var baseUrl = ConstantService.APIRoot() + "/finance";
        return {
            calculate: function (capital, period, rate, isRolling) {
                return $resource(baseUrl + "/queryYieldComparison")
                    .save({
                        pv: capital,
                        nper: period,
                        rate: rate,
                        isRoll: isRolling
                    }).$promise
                    .then(function (d) {
                        if (d && d.status === "000") {
                            var data = d.data;
                            var json = {};
                            for (var key in data) {
                                switch (key) {
                                    case "1":
                                    {
                                        json.platform = {
                                            "description": "平台贷款项目",
                                            "result": data[key]
                                        }
                                    }
                                    case "2":
                                    {
                                        json.demand = {
                                            "description": "银行活期",
                                            "result": data[key]
                                        }
                                    }
                                    case "3":
                                    {
                                        json.deposit = {
                                            "description": "银行定期",
                                            "result": data[key]
                                        }
                                    }
                                    case "4":
                                    {
                                        json.fund = {
                                            "description": "货币基金",
                                            "result": data[key]
                                        }
                                    }
                                    case "5":
                                    {
                                        json.custom = {
                                            "description": "用户自定义",
                                            "result": data[key]
                                        }
                                    }
                                }
                            }
                            return json;
                        } else {
                            return $q.reject(d.msg);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        return null;
                    })
            },
            "imprest": function () {
                return ODataService.getDB()
                    .then(function (p2pDB) {
                        return p2pDB.ThirdPaymentAccounts.ThirdPaymentAccount
                            //.filter("it.ThirdPaymentIdType===6")
                            .readAll()
                            .then(function (results) {
                                var list = results.filter(function (item) {
                                    return item.ThirdPaymentIdType === 6;
                                })
                                return list && list[0] ? list[0].ThirdPaymentIdBalance : 0;
                            })
                        //return p2pDB.ThirdPaymentAccounts
                        //    .filter("it.ThirdPaymentIdType == 6")
                        //    .then(function (results) {
                        //        console.log(results);
                        //    })
                    })
            }
        };
    });
