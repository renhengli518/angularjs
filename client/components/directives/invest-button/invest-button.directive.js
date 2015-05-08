'use strict';

angular.module('p2pClientApp')
    .directive('investButton', function (_, AccountService, UtilsService) {
        return {
            templateUrl: 'components/directives/invest-button/invest-button.html',
            restrict: 'EA',
            scope: {
                "details": "=investment",
                "type":"=showtype"
                 
            },
            link: function (scope, element, attrs) {
                var config = [
                    {
                        "displayName": "立即投资",//招标中
                        "values": [12]
                    }, {
                        "displayName": "已满标",//已满标、满标放款中、满标放款失败、
                        "values": [6, 13, 14]
                    }, {
                        "displayName": "还款中",//满标放款成功，还款中，自动提现中、自动提现失败,,满标放款成功
                        "values": [15, 18, 19, 20, 21]
                    }, {
                        "displayName": "已流标",//流标中，已流标
                        "values": [5, 16]
                    }
                ]




                if (scope.details) {
                    _init();
                }

                function _init() {
                    scope.id = scope.details.investmentSequence || scope.details.InvestmentSequence
                    var investmentStatus = scope.details.investmentStatus || scope.details.InvestmentStatus;
                    var t = _.filter(config, function (item) {
                        return _.contains(item.values, investmentStatus);
                    })[0];
                    if (t) {
                        scope.displayName = t.displayName;
                    }
                    scope.show = scope.type;
                }
            }
        };
    });
