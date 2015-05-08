'use strict';

angular.module('p2pClientApp')
    .factory('InvestService', function ($http, $resource, ConstantService, CMSService, _, $q, DateTimeService, ODataService, UtilsService) {
        var baseAPI = ConstantService.APIRoot();
        var url = baseAPI + "/merchant";
        var map = {
            "resource": {
                "InvestmentGuaranteedInterestDescriptionImage": "t_res_sseq", //保额保息说明图片, todo关联 T_res表 取匹配 地址
                "InvestmentGredibilityImage": "t_res_lseq" //项目信用评级说明图片, todo关联 T_res表 取匹配 地址
            },
            "dictionary": {
                "InvestmentGuaranteedInterestType": "inv_stype", //保额保息情况
                "InvestmentGuarantee": "inv_grt", //保障机构， todo 字典表暂无该字段，后续liuwei加
                "InvestmentAnnualInterestRate": "inv_irate", //年利率
                "InvestmentPeriod": "inv_period", //期数
                "InvestmentPayType": "inv_ptype", //还款方式
                "InvestmentStatus": "inv_stat", //项目状态
                "InvestmentType": "inv_type", //项目发布方式
                "InvestmentTarget": "inv_target", //项目用途
                "InvestmentLevel": "inv_lv"
            }
        };
        var _convert = function (item) {
            item.InvestmentStartDate = new Date(item.InvestmentStartDate);
            item.InvestmentEndDate = new Date(item.InvestmentEndDate);
            item.InvestmentCreateDate = new Date(item.InvestmentCreateDate);
            var defer = $q.defer();
            var promise = defer.promise;
            defer.resolve(item);
            if (map.dictionary) {
                promise = promise.then(function () {
                    return ODataService.dictionary("t_inv")
                        .then(function (dicTable) {
                            if (dicTable) {
                                Object.keys(item).forEach(function (key) {
                                    var field = map.dictionary[key];
                                    if (field) {
                                        item[key + "Map"] = dicTable.getValue(field, item[key]);
                                    }
                                });
                            }

                        })
                })
            }
            if (map.resource) {
                promise = promise.then(function () {
                    return ODataService.resource()
                        .then(function (resTable) {
                            Object.keys(item).forEach(function (key) {
                                var field = map.resource[key];
                                if (field) {
                                    item[key + "Map"] = resTable[item[key]];
                                }
                            });
                        })
                })
            }
            return promise
                .then(function () {
                    return item;
                })
                .catch(function (err) {
                    console.log(err);
                    return item;
                })
        };
        var _convertP2p = function (item, tableName) {
            item.investmentStartDate = new Date(item.investmentStartDate);
            item.investmentEndDate = new Date(item.investmentEndDate);
            item.investmentCreateDate = new Date(item.investmentCreateDate);
            var defer = $q.defer();
            var promise = defer.promise;
            defer.resolve(item);
            if (map.dictionary) {
                promise = promise.then(function () {
                    return ODataService.dictionary(tableName)
                        .then(function (dicTable) {
                            if (dicTable) {
                                Object.keys(item).forEach(function (key) {
                                    var field = map.dictionary[key];
                                    if (field) {
                                        item[key + "Map"] = dicTable.getValue(field, item[key]);
                                    }
                                });
                            }

                        })
                })
            }
            return promise
                .then(function () {
                    return item;
                })
                .catch(function (err) {
                    console.log(err);
                    return item;
                })
        };

        // Public API here
        var type1 = 0;
        return {
            /**
             * 检索在投资项目
             * @param types 投资项目状态
             * @param from 开始时间（指项目最早上线时间）
             * @param from 结束时间（指项目最晚上线时间）
             * @returns {*}
             */
            queryInvestProjectInfo: function (types, from, to) {
                var defer = $q.defer();
                ODataService.getDB().then(function (p2pDB) {
                    var array = [];
                    p2pDB.Investments
                        .orderByDescending("it.InvestmentStatus")
                        .filter("it.InvestmentStatus in this.status" ,{
                            "status":types
                        })
                        .forEach(
                        function (t) {
                            array.push(_convert(t.initData));
                        }).
                        then(function (res) {
                            return $q.all(array).then(function (list) {
                                //console.log(list);
                                defer.resolve(list);
                            });
                        });
                });
                return defer.promise;
            },
            //根据id查标的
            queryInvestProjectInfoById: function (id) {
                var defer = $q.defer();
                $http.post(baseAPI + "/merchant/queryInvestmentInfoById", {"investmentId": id})
                    .success(function (obj) {
                        var datas = new Array();
                        var array = [];
                        obj.data.forEach(
                            function (t) {
                                datas[0] = _convertP2p(t.investment, "t_inv");
                                datas[1] = _convertP2p(t.investment, "t_acct");
                                array.push(datas);
                            }
                        )
                        // then(function (res) {
                        //     return $q.all(array).then(function (list) {
                        //         defer.resolve(list);
                        //     });
                        // });
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });

                /*ODataService.getDB().then(function (p2pDB) {
                 var array = [];
                 p2pDB.Investments
                 .filter("it.InvestmentSequence === " + id)
                 .forEach(
                 function (t) {
                 array.push(_convert(t.initData));
                 }).
                 then(function (res) {
                 return $q.all(array).then(function (list) {
                 // console.log(list);
                 defer.resolve(list);
                 });
                 });
                 });*/
                return defer.promise;
            },
            query: function (periods, status, types) {
                if (periods && periods.length > 0 && status && status.length > 0 && types && types.length > 0) {
                    return $resource(baseAPI + "/merchant/queryInvestProjectInfo", null, {
                        "query": {
                            "method": "POST"
                        }
                    }).query({
                        "investmentPeriods": periods,
                        "investmentStatus": status,
                        "accountType": types
                    }).$promise
                        .then(function (re) {
                            if (re && re.status === "000") {
                                return re.data;
                            } else {
                                return $q.reject(re.msg);
                            }
                        });
                } else {
                    return $q.reject("missed required query condition");
                }

            },
            /**
             * 开启自动投资
             * @param perMaxAmount
             * @param period
             * @param creditLevel
             * @returns {*}
             */
            selfHelpInvest: function (perMaxAmount, period, creditLevel) {
                var defer = $q.defer();
                $http.post(baseAPI + "/deal/selfHelpInvest", {
                    "perMaxAmount": perMaxAmount,
                    "period": period,
                    "creditLevel": creditLevel
                })
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },

            /**
             * 关闭自动投资
             * @returns {*}
             */
            colseAutoInvest: function () {
                var defer = $q.defer();
                $http.post(baseAPI + "/deal/colseAutoInvest", {})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            judgeOpenOrCloseInvest: function (accountSequence) {
                var defer = $q.defer();
                ODataService.getDB().then(function (p2pDB) {
                    var array = [];
                    p2pDB.AccountInvestRules
                        .filter("it.AccountSequnece ===" + accountSequence)
                        .forEach(
                        function (t) {
                            array.push(t);
                        }).
                        then(function (res) {
                            return $q.all(array).then(function (list) {
                                defer.resolve(list);
                            });
                        });
                });
                return defer.promise;
            },
            getAccountSequenceByUsername: function (username) {
                var defer = $q.defer();
                ODataService.getDB().then(function (p2pDB) {
                    var array = [];
                    p2pDB.Accounts
                        .filter("it.UserName === '" + username + "'" + " || it.Mobile==='" + username + "'")
                        .forEach(
                        function (t) {
                            array.push(t);
                        })
                        .then(function (res) {
                            return $q.all(array).then(function (list) {
                                defer.resolve(list);
                            });
                        });
                });
                return defer.promise;
            },
            oneKeyInvest: function () {
                var defer = $q.defer();
                $http.post(baseAPI + "/deal/oneKeyInvest", {})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            //计算金额
            capitalMath: function (price, periods, yearRate) {
                // console.log(price+'-'+periods+'-'+yearRate)
                var defer = $q.defer();
                $http.post(baseAPI + "/capital/capitalMath", {"price": price, "periods": periods, "yearRate": yearRate})
                    .success(function (obj) {
                        defer.resolve(obj)
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            //手动投资chk
            manualInvestChk: function (seq, amt) {
                var defer = $q.defer();
                $http.post(baseAPI + "/deal/manualInvestChk", {"investmentSequence": seq, "amount": amt})
                    .success(function (obj) {
                        defer.resolve(obj)
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            //判断当前用户是否存在理财
            isCurrentAccountInvested: function () {
                var defer = $q.defer();
                $http.post(baseAPI + "/deal/isCurrentAccountInvested", {})
                    .success(function (obj) {
                        defer.resolve(obj)
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            }
        };
    });
