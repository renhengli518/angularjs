'use strict';

angular.module('p2pClientApp')
    .factory('UtilsService', function ($q, $localStorage, $sessionStorage, _, md5, $state, $rootScope) {
        var _cache = function (type, cacheName, obj, remove) {
            var storage = type === "session" ? $sessionStorage : $localStorage;
            var deferred = $q.defer();
            cacheName = md5.createHash(cacheName);
            var cache = storage[cacheName];
            if (cacheName && obj) {
                storage[cacheName] = obj;
            }
            if (remove) {
                delete storage[cacheName];
            }
            deferred.resolve(_.cloneDeep(cache));
            return deferred.promise;
        };
        return {
            formatMoney: function (number, x, n) {//x:length of section , n length of decimal
                if (!number) {
                    number = 0;
                }
                try {
                    if (!n) {
                        n = 2;
                    }
                    if (!x) {
                        x = 3;
                    }
                    number = parseFloat(number);
                    if (!number || isNaN(number)) {
                        try {
                            number = parseFloat(number);
                        } catch (e) {
                            console.error(e);
                            return number;
                        }
                    }
                    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
                    return number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
                } catch (err) {
                    console.error(err);
                    return number;
                }

            },
            cache: function (cacheName, obj, remove) {
                return _cache("session", cacheName, obj);
            },
            cacheLocal: function (cacheName, obj, remove) {
                return _cache("local", cacheName, obj, remove);
            },
            chineseCost: function (numberValue1) {
                //numberValue1 = this.formatMoney(numberValue1,3,2).replace(/,/g,"");
                var numberValue = Math.round(numberValue1 * 100) + ""; // 数字金额
                var chineseValue = ""; // 转换后的汉字金额
                if (!isNaN(numberValue)) {
                    var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
                    var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
                    var len = numberValue.length; // numberValue 的字符串长度
                    var Ch1; // 数字的汉语读法
                    var Ch2; // 数字位的汉字读法
                    var nZero = 0; // 用来计算连续的零值的个数
                    var String3; // 指定位置的数值
                    if (len > 15) {
                        alert("超出计算范围");
                        return "";
                    }
                    if (numberValue == 0) {
                        chineseValue = "零元整";
                        return chineseValue;
                    }

                    String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
                    for (var i = 0; i < len; i++) {
                        String3 = parseInt(numberValue.substr(i, 1), 10); // 取出需转换的某一位的值
                        if (i != (len - 3) && i != (len - 7) && i != (len - 11) && i != (len - 15)) {
                            if (String3 == 0) {
                                Ch1 = "";
                                Ch2 = "";
                                nZero = nZero + 1;
                            }
                            else if (String3 != 0 && nZero != 0) {
                                Ch1 = "零" + String1.substr(String3, 1);
                                Ch2 = String2.substr(i, 1);
                                nZero = 0;
                            }
                            else {
                                Ch1 = String1.substr(String3, 1);
                                Ch2 = String2.substr(i, 1);
                                nZero = 0;
                            }
                        }
                        else { // 该位是万亿，亿，万，元位等关键位
                            if (String3 != 0 && nZero != 0) {
                                Ch1 = "零" + String1.substr(String3, 1);
                                Ch2 = String2.substr(i, 1);
                                nZero = 0;
                            }
                            else if (String3 != 0 && nZero == 0) {
                                Ch1 = String1.substr(String3, 1);
                                Ch2 = String2.substr(i, 1);
                                nZero = 0;
                            }
                            else if (String3 == 0 && nZero >= 3) {
                                Ch1 = "";
                                Ch2 = "";
                                nZero = nZero + 1;
                            }
                            else {
                                Ch1 = "";
                                Ch2 = String2.substr(i, 1);
                                nZero = nZero + 1;
                            }
                            if (i == (len - 11) || i == (len - 3)) { // 如果该位是亿位或元位，则必须写上
                                Ch2 = String2.substr(i, 1);
                            }
                        }
                        chineseValue = chineseValue + Ch1 + Ch2;
                    }

                    if (String3 == 0) { // 最后一位（分）为0时，加上“整”
                        chineseValue = chineseValue + "整";
                    }
                } else {
                    chineseValue = numberValue1;
                }

                return chineseValue;
            },
            handleAPIError: function (errorMessage) {
                if (errorMessage === "用户未登录") {
                    $rootScope.historyPath = $location.path();
                    $state.to("login");
                }
            },
            showLoading: function () {
                $rootScope.loadingShow = true;
            },
            hideLoading: function () {
                $rootScope.loadingShow = false;
            },
            hashMobile: function (phone) {
                var reg = /^(1)([2-9]{2})([0-9]{4})([0-9]{4})$/;
                if (reg.test(phone)) {
                    var phone = phone.replace(reg, "$1$2****$4");
                    phone = phone;
                }
                return phone;
            }
        };


    });
