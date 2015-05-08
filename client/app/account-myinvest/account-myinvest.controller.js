'use strict';

angular.module('p2pClientApp')
    .controller('AccountMyinvestCtrl', function ($scope, AccountService, $filter, ngTableParams, AccountFundService, CMSService, $q, $sessionStorage, _, UtilsService) {
        $scope.selection = 'hold';
        $scope.totalData = {};

        $scope.$watch("selection", function (newV, oldV) {
            if (newV && oldV && (newV !== oldV)) {
                _filter();
            }
        });
        $scope.display = true;
        var filter = false;

        $scope.filterItems = {
            "hold": {
                "items": [
                    {
                        "name": "还款中",
                        "value": [1]
                    }, {
                        "name": "逾期",
                        "value": [15],
                        "selected": false
                    }
                ],
                "searchKey": "AccountInvestment.accountInvestmentStatusKey"
            }, "allying": {
                "items": [
                    {
                        "name": "招标中",
                        "value": ["招标中"],
                        "selected": false
                    }, {
                        "name": "已满标",
                        "value": ["满标", "已满标", "满标放款中"],
                        "selected": false
                    }, {
                        "name": "已流标",
                        "value": ["已流标"],
                        "selected": false
                    }
                ],
                "searchKey": "InvestmentStatus"
            }, "end": {
                "items": [
                    {
                        "name": "已结清",
                        "value": ["已结清"],
                        "selected": false
                    }
                ],
                "searchKey": "accountInvestmentEndForm"
            }
        };

        $scope.listItems = _.cloneDeep($scope.filterItems[$scope.selection].items);
        $scope.selectFilter = function (obj) {
            var f = $scope.filterItems[$scope.selection];
            if (f) {
                f.items.forEach(function (t) {
                    t.selected = (t.name === obj.name)
                })
            }
            if (obj.name !== "全部") {
                _filter(f.searchKey, obj.value);
            } else {
                _filter();
            }

        }

        $scope.$watch("somethingHere", function (newV, oldV) {
            if (oldV && !newV) {
                _filter();
            }
        }, true);

        var _filter = function (key, value) {
            filter = true;
            var selection = $scope.selection;
            if ($scope.globalTotalData) {
                var tmp = $scope.globalTotalData[selection].slice(0);
                var tmp1 = [];
                if (key) {
                    tmp1 = tmp.filter(function (item) {
                        var k = key;
                        var c = null;
                        if (k.indexOf(".") !== -1) {
                            k = k.split(".");
                            c = item[k[0]][k[1]];
                        } else {
                            c = item[key];
                        }
                        return _.contains(value, c);
                    })
                    $scope.totalData[selection] = tmp1;
                } else {
                    $scope.totalData[selection] = _.cloneDeep(tmp);
                }
            }
            _reloadTableParams();
        }


        var _reloadTableParams = function () {
            var newValue = $scope.selection;
            $scope.listItems = $scope.filterItems[newValue].items;
            if (newValue === "allying") {
                $scope.applyingTableParams.reload();
            } else if (newValue === "hold") {
                $scope.holdTableParams.reload();
                //$scope.topupTableParams.reloadPages();
            } else if (newValue === "end") {
                $scope.endTableParams.reload();
                //$scope.withdrawalTableParams.reloadPages();
            }
        }
        $scope.applyingTableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10          // count per page
        }, {
            total: 0,           // length of data
            getData: function ($defer, params) {
                if ($scope.totalData) {
                    var currentPage = params.page();
                    if (filter) {
                        currentPage = 1;
                        filter = false;
                    }
                    var data = $scope.totalData[$scope.selection].slice(0) || [];
                    var data = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;
                    params.total(data.length);
                    data = data.map(function (item) {
                        item.Investment.investmentProgress1 = Math.floor(item.Investment.investmentProgress * 100);
                        return item;
                    })
                    // set new data
                    $defer.resolve(data.slice((currentPage - 1) * params.count(), currentPage * params.count()));
                }

            }
        });
        $scope.holdTableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10          // count per page
        }, {
            total: 0,           // length of data
            getData: function ($defer, params) {
                if ($scope.totalData && $scope.totalData[$scope.selection]) {
                    var currentPage = params.page();
                    if (filter) {
                        currentPage = 1;
                        filter = false;
                    }
                    var data = $scope.totalData[$scope.selection].slice(0) || [];
                    var data = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;
                    data = data.map(function (t) {
                        if (t.nextPayDay) {
                            var tmp = new Date(t.nextPayDay);
                            if (tmp) {
                                tmp.setDate(tmp.getDate() + 1);
                            } else {
                                tmp = t.nextPayDay;
                            }
                            t.nextPayDay1 = tmp;
                        }

                        return t;
                    })
                    params.total(data.length);
                    // set new data
                    $defer.resolve(data.slice((currentPage - 1) * params.count(), currentPage * params.count()));
                }

            }
        });
        $scope.endTableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10          // count per page
        }, {
            total: 0,           // length of data
            getData: function ($defer, params) {
                if ($scope.totalData) {
                    var currentPage = params.page();
                    if (filter) {
                        currentPage = 1;
                        filter = false;
                    }
                    var data = $scope.totalData[$scope.selection].slice(0) || [];
                    var data = params.sorting() ?
                        $filter('orderBy')(data, params.orderBy()) :
                        data;
                    params.total(data.length);
                    // set new data
                    $defer.resolve(data.slice((currentPage - 1) * params.count(), currentPage * params.count()));
                }

            }
        });
        var _get = function () {
            //var t = $sessionStorage.tmp;
            var promise = UtilsService.cache("accountFund")
                .then(function (accountFund) {
                    $scope.accountFund = accountFund;
                });
            //if (t) {
            //    var defer = $q.defer();
            //    defer.resolve(_.cloneDeep(t));
            //    promise = promise.then(function () {
            //        return defer.promise;
            //    });
            //} else {
            CMSService.showLoading();
            promise = promise.then(function () {
                return AccountService.myInvestments()
                    .then(function (obj) {
                        $sessionStorage.tmp = obj;
                        return _.cloneDeep(obj);
                    })
            })
            //}
            promise.then(function (obj) {
                $scope.totalData = _.cloneDeep(obj);
                $scope.globalTotalData = _.cloneDeep(obj);
                var display = false;
                for (var key in obj) {
                    display |= obj[key] && obj[key].length > 0;
                }
                $scope.display = display;
                //$scope.showList = obj[$scope.selection];
                // return $scope.totalData[$scope.selection];
                _filter();
            })
                .catch(function (err) {
                    console.error(err);
                })
                .finally(function () {
                    CMSService.hideLoading();
                });

            //CMSService.showLoading();
            //return AccountService.myInvestments()
            //    .then(function (obj) {
            //        $scope.totalData = obj;
            //        $scope.globalTotalData = obj;
            //        $sessionStorage.tmp = obj;
            //        var display = true;
            //        for (var key in obj) {
            //            display |= obj[key];
            //        }
            //        $scope.display = display;
            //        //$scope.showList = obj[$scope.selection];
            //        // return $scope.totalData[$scope.selection];
            //        _reloadTableParams();
            //    })
            //    .catch(function (err) {
            //        console.error(err);
            //    })
            //    .finally(function () {
            //        CMSService.hideLoading();
            //    });


        }
        AccountFundService.wdzh02MyInvest()
            .then(function (data) {
                $scope.fundDetail = data;
            })
            .then(function () {
                return UtilsService.cache("accountFund")
                    .then(function (accountFund) {
                        $scope.accountFund = accountFund;
                    })
            })
            .catch(function (err) {
                console.error(err);
            })
            .finally(function () {
                _get();
            })
    });
