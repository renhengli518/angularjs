'use strict';

angular.module('p2pClientApp')
    .factory('AccountFundService', function ($q, ODataService, $resource, ConstantService, $http) {
        var baseAPI = ConstantService.APIRoot();

        var ViewHelper = {
            "2": "投资放款",
            "3": "投资资金解冻",
            "4": "本息收入 ",
            "14": "网银充值",
            "15": "提现",
            "21": "提现手续费",
            "22": "投资管理费支出",
            "23": "投资冻结 ",
            "27": "垫付本息收入 ",
            "29": "罚息收入 ",
            "13": "红包奖励"
        }
        var typePlus = [0, 4, 13, 14, 29, 27]; // 0 is for  AccountCashOperationRecords  topup
        var typeMinus = [1, 2, 15, 21, 22]; // 1 is for AccountCashOperationRecords withdrawal
        var typeNo = [3, 23];

        var _getMark = function (type, status) {
            var a = typePlus.filter(function (item) {
                return item === type;
            });
            var b = typeMinus.filter(function (item) {
                return item === type;
            });
            //return (a || b) ? ( a ? "plus" : "minus") : "no";
            if (a && a.length > 0) {
                if (status === 3 || status === 0) {
                    return "plus";
                } else {
                    return "no";
                }
            } else if (b && b.length > 0) {
                if (status === 3 || status === 0) {
                    return "minus";
                } else {
                    return "no";
                }
            } else {
                return "no";
            }
        }
        var _convert = function (item1) {
            var defer = $q.defer();
            var promise = defer.promise;
            defer.resolve(item1);
            promise = promise.then(function (item) {
                return ODataService.dictionary("t_act_rdrcd")
                    .then(function (dicTable) {
                        if (dicTable) {
                            if (item.operateStats || item.operateStats === 0) {
                                item.operateStatsReal = dicTable.getValue("ard_stat", item.operateStats);
                            } else if (item.OperateStats || item.OperateStats === 0) {
                                item.OperateStatsReal = dicTable.getValue("ard_stat", item.OperateStats);
                            }

                        }
                        return item;
                    })
            }).then(function (item) {
                return ODataService.dictionary("t_dic")
                    .then(function (dicTable) {
                        if (dicTable) {
                            if (item.bankCode || item.bankCode === 0) {
                                item.bankCode = dicTable.getValue("bank_code", item.bankCode);
                            } else if (item.BankCode || item.BankCode === 0) {
                                item.BankCode = dicTable.getValue("bank_code", item.BankCode);
                            }
                        }
                        return item;
                    });
            }).then(function (item) {
                return ODataService.dictionary("t_act_order")
                    .then(function (dicTable) {
                        if (dicTable) {
                            //item.TradeTypeReal = dicTable.getValue("trade_type", item.TradeType);
                            if (item.TradeType) {
                                item.TradeTypeReal = ViewHelper[item.TradeType] || dicTable.getValue("trade_type", item.TradeType);
                            } else if (item.tradeType) {
                                item.tradeTypeReal = ViewHelper[item.tradeType] || dicTable.getValue("trade_type", item.tradeType);
                            }

                        }
                        return item;
                    });

            }).then(function (item) {
                return ODataService.dictionary("t_inv")
                    .then(function (dicTable) {
                        if (dicTable) {
                            if (item.InvestmentPeriod) {
                                item.InvestmentPeriod = dicTable.getValue("inv_period", item.InvestmentPeriod);
                            } else if (item.investmentPeriod) {
                                item.investmentPeriod = dicTable.getValue("inv_period", item.investmentPeriod);
                            }

                        }
                        return item;
                    });

            })


            return promise
                .then(function (t) {
                    if (t.TradeAmount) {
                        t.TradeAmount = parseFloat(t.TradeAmount);
                    }

                    if (t.OrderStatus || t.OrderStatus === 0) {
                        t.OrderMark = _getMark(t.TradeType, t.OrderStatus);
                    }

                    //if (t.tradeAmount) {
                    //    t.tradeAmount = parseFloat(t.tradeAmount);
                    //}
                    if (t.orderStatus || t.orderStatus === 0) {
                        t.OrderMark = _getMark(t.tradeType, t.orderStatus);
                    }

                    if (t.OperateType || t.OperateType === 0) {
                        t.OrderMark = _getMark(t.OperateType, t.OperateStats);
                    }

                    var reg = /^([\d]{4})([\d]{11})([\d]{4})$/;
                    if (t.BankCardNumber && reg.test(t.BankCardNumber)) {
                        var card = t.BankCardNumber;
                        card = card.replace(reg, "$1********$3");
                        t.BankCardNumber = card;
                    }
                    return t;
                })
        };

        var _odata = function (type, userId, dateFrom, dateTo, currentPage, pageNumber, status) {
            var defer = $q.defer();
            currentPage = currentPage || 1;
            pageNumber = pageNumber || 10;
            function _getJayDataQuery() {
                return ODataService.getDB()
                    .then(function (p2pDB) {
                        var array = [];
                        var queryString = "";
                        if (!dateFrom) {
                            queryString = "it.AccountSequence === this.currentUser";
                        } else {
                            queryString = "(it.OperateDate >= this.dateFrom) && (it.OperateDate <= this.dateTo) && (it.OperateStats in this.status) &&  " +
                            "(it.AccountSequence === this.currentUser) && (it.OperateType === this.type)";
                        }

                        //queryString = "(it.AccountSequence === this.currentUser) && (it.OperateType === this.type)&& (it.OperateStats in this.status)";
                        return p2pDB.AccountCashOperationRecords
                            //.filter("it.OperateType === " + type + " && it.OperateDate >= '2000-11-05T00:00:00.000'" )
                            .filter(queryString, {
                                "type": type,
                                "status": status,
                                "dateFrom": dateFrom || new Date(),
                                "dateTo": dateTo || new Date(),
                                "currentUser": userId
                            })
                    });
            };

            _getJayDataQuery()
                .then(function (obj) {
                    var array = [];
                    return obj.count()
                        .then(function (totalN) {
                            obj.skip((currentPage - 1) * pageNumber)
                                .take(pageNumber)
                                .forEach(
                                function (t) {
                                    array.push(_convert(t.initData));
                                }
                            )
                                .then(function (results) {
                                    return $q.all(array)
                                        .then(function (list) {
                                            defer.resolve({
                                                "total": totalN,
                                                "data": list
                                            });

                                        });
                                })
                        });
                });
            return defer.promise;
        }
        // Public API here
        return {
            "transaction": function (userId, dateFrom, dateTo, currentPage, pageNumber, status, types) {
                var defer = $q.defer();
                currentPage = currentPage || 1;
                pageNumber = pageNumber || 10;
                //var queryString = "(it.TradeDate >= this.dateFrom) && (it.TradeDate <= this.dateTo) && (it.PayAccountSequence === this.currentUser ||  " +
                //    "it.GatherAccountSequence === this.currentUser) && ((it.TradeType in [14,15] && it.OrderStatus in  [3,4]) || (it.TradeType in [21,23,3,2,4,22,29,27] && it.OrderStatus === 3))";
                var queryString = "(it.TradeDate >= this.dateFrom) && (it.TradeDate <= this.dateTo) && (it.PayAccountSequence === this.currentUser ||  " +
                    "it.GatherAccountSequence === this.currentUser)";

                var topUp = [];
                if (_.contains(types, 14)) {
                    topUp.push(14);
                }
                if (_.contains(types, 15)) {
                    topUp.push(15);
                }
                types = types.filter(function (t) {
                    return (t !== 14 && t !== 15);
                });

                queryString += " && ( ";
                if (topUp.length > 0) {
                    queryString += " (it.TradeType in this.types1 && it.OrderStatus in  [3,4]) ";
                    if (types.length > 0) {
                        queryString += " || ";
                    }
                }
                if (types.length > 0) {
                    queryString += "(it.TradeType in this.types && it.OrderStatus === 3)"
                }
                queryString += " )"


                function _getJayDataQuery() {
                    return ODataService.getDB()
                        .then(function (p2pDB) {
                            return p2pDB.AccountOrders
                                .filter(queryString, {
                                    "dateFrom": dateFrom,
                                    "dateTo": dateTo,
                                    "currentUser": userId,
                                    "types": types,
                                    "types1": topUp
                                })
                                .orderBy(function (t) {
                                    return t.TradeDate;
                                })
                        });
                };
                var array = [];
                _getJayDataQuery()
                    .then(function (obj) {
                        return obj.count()
                            .then(function (totalN) {
                                obj.skip((currentPage - 1) * pageNumber)
                                    .take(pageNumber)
                                    .forEach(
                                    function (t) {
                                        array.push(_convert(t.initData));
                                    }
                                )
                                    .then(function (results) {
                                        return $q.all(array)
                                            .then(function (list) {
                                                defer.resolve({
                                                    "total": totalN,
                                                    "data": list
                                                });
                                            });
                                    })
                            });
                    })

                return defer.promise;
            },
            "topup": function (userId, dateFrom, dateTo, currentPage, pageNumber, status, types) {
                return _odata(0, userId, dateFrom, dateTo, currentPage, pageNumber, status);//充值
            }
            ,
            "withdrawal": function (userId, dateFrom, dateTo, currentPage, pageNumber, status, types) {
                return _odata(1, userId, dateFrom, dateTo, currentPage, pageNumber, status);//提现
            }, "fundDetails": function (type, userId, dateFrom, dateTo, currentPage, pageNumber, status, types) {
                var defer = $q.defer();
                currentPage = currentPage || 1;
                pageNumber = pageNumber || 10;
                var queryString = "(it.TradeDate >= this.dateFrom) && (it.TradeDate <= this.dateTo) && (it.PayAccountSequence === this.currentUser ||  " +
                    "it.GatherAccountSequence === this.currentUser)";
                if (types && types.length > 0) {
                    queryString += " && (";
                    queryString += "it.TradeType in this.types"
                    queryString += ")";
                }
                if (status && status.length > 0 && type !== "transaction") {
                    queryString += " && (";
                    queryString += "it.OrderStatus in this.status"
                    queryString += ")";
                }
                function _getJayDataQuery() {
                    return ODataService.getDB()
                        .then(function (p2pDB) {
                            return p2pDB.AccountOrders
                                //.filter(function (rs) {
                                //    //return (rs.TradeDate >= this.dateFrom) && (rs.TradeDate <= this.dateTo)
                                //    //    && (rs.TradeType === "2" || rs.TradeType === "4" || rs.TradeType === "16" || rs.TradeType === "17" || rs.TradeType === "23")
                                //    //return rs.OperateType === this.type;
                                //    //return queryString
                                //    return (rs.TradeDate >= this.dateFrom) && (rs.TradeDate <= this.dateTo) && rs.TradeType in this.types;
                                //}, {
                                .filter(queryString, {
                                    "types": types,
                                    "dateFrom": dateFrom,
                                    "dateTo": dateTo,
                                    "status": status,
                                    "currentUser": userId
                                })
                        });
                };
                var array = [];
                _getJayDataQuery()
                    .then(function (obj) {
                        return obj.count()
                            .then(function (totalN) {
                                obj.skip((currentPage - 1) * pageNumber)
                                    .take(pageNumber)
                                    .forEach(
                                    function (t) {
                                        array.push(_convert(t.initData));
                                    }
                                )
                                    .then(function (results) {
                                        return $q.all(array)
                                            .then(function (list) {
                                                defer.resolve({
                                                    "total": totalN,
                                                    "data": list
                                                });
                                            });
                                    })
                            });
                    })

                return defer.promise;
            },
            wdzh02MyInvest: function () {
                //return $resource(baseAPI + "/deal/wdzh02MyInvest", null, {
                //    retrieve: {
                //        "method": "POST"
                //    }
                //})
                //    .retrieve()
                //    .$promise;
                //var defer = $q.defer();
                //$http.post(baseAPI + "/deal/wdzh02MyInvest")
                //    .success(function (re) {
                //        defer.resolve(re);
                //    })
                //    .error(function (err) {
                //        defer.reject(err);
                //    });
                //return defer.promise;
                return $resource(baseAPI + "/deal/wdzh02MyInvest", null, {
                    list: {
                        "method": "POST"
                    }
                }).list({}).$promise
                    .then(function (data) {
                        if (data && data.status === "000") {
                            return data.data;
                        } else {
                            return $q.reject(data.msg);
                        }
                    })
            },
            "accountTransaction": function (userId, dateFrom, dateTo, currentPage, pageNumber, status, types) {
                status = [3, 4];// 当 tab选择 充值申请或者取现申请的时候， 成功和失败分别是0,1 。
                                // 为了页面统一， 统一使用0,1， 而在资金明细这张表，又是使用的3,4
                return $resource(baseAPI + "/deal/findAccountOrderList", null, {
                    "list": {
                        "method": "POST"
                    }
                }).list({
                    "dateFrom": dateFrom,
                    "dateTo": dateTo,
                    "currentPage": currentPage,
                    "pageNumber": pageNumber,
                    "status": status,
                    "types": types
                }).$promise
                    .then(function (re) {
                        if (re && re.status === "000") {
                            return re.data;
                        } else {
                            return $q.reject(re.msg);
                        }
                    })
                    .then(function (result) {
                        var array = [];
                        result.items.forEach(function (item) {
                            array.push(_convert(item));
                        });
                        return $q.all(array)
                            .then(function (list) {
                                function _captial(item) {
                                    var json = {};
                                    for (var key in item) {
                                        var tmpKey = key.substring(0, 1).toUpperCase() + key.substring(1);
                                        json[tmpKey] = item[key];
                                    }
                                    return json;
                                }

                                result.items = list.map(function (item) {
                                    return _captial(item);
                                });
                                return {
                                    "total": result.total,
                                    "data": result.items
                                };
                            })
                    })
            }
        }
    })
