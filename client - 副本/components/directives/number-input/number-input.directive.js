'use strict';

angular.module('p2pClientApp')
    .directive('numberInput', function () {
        return {
            templateUrl: 'components/directives/number-input/number-input.html',
            restrict: 'EA',
            scope: {
                "money": "=outputModel",
                "blur":"@blur"
            },
            link: function (scope, element, attrs) {
                scope.cssStyle = attrs["css-class"];
                scope._disabled = (attrs["disabled"] === "true");
                var max = parseFloat(attrs["max"]) || 0;
                var min = parseFloat(attrs["min"]) || 0;
                var oldMoney = 0;
                if (max) {
                    scope.$watch("money", function (newV, oldV) {
                        oldMoney = oldV || 0;
                    })
                }

                //var ngBlur = attrs["ngBlur"];
                //if(ngBlur && typeof ngBlur === "function") {
                //    element.onBlur(function(){
                //        ngBlur.call();
                //    });
                //}
                var type = attrs["type"];
                scope.unit = attrs["unit"];
               // var defaultV = attrs["default"];
              //  scope.defaultValue = (defaultV || defaultV === 0) ? defaultV : "";
                scope.onKeyUp = function () {
                    var newV = scope.money;
                    if (newV) {
                        var t = newV.replace(/[^\.^\d]/g, '');
                        if (t) {
                            if (t.length > 10) {
                                t = t.substring(0, 10);
                            }
                            var tmp = t.split(".");
                            if (tmp[1] && tmp[1].length > 2) {
                                tmp[1] = tmp[1].substring(0, 2);
                                t = tmp[0] + "." + tmp[1];
                            }
                        }
                        if (max && (parseFloat(t) > parseFloat(max))) {
                            t = oldMoney;
                        }
                        scope.money = t;
                    }
                };
                //scope.onBlur = function () {
                //    var m = "";
                //    if (scope.money) {
                //        m = parseFloat(scope.money);
                //        if (min && (m < parseFloat(min))) {
                //            m=parseFloat(min);
                //        }
                //        if (type === "int") {
                //            m = Math.round(m-0.5);
                //        } else {
                //            m = m.toFixed(2);
                //        }
                //    }
                //    if(min&&!scope.money){
                //        m=parseFloat(min);
                //    }
                //    scope.money = m;
                //}
            }
        };
    });
