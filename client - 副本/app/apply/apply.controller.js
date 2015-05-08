'use strict';

angular.module('p2pClientApp')
    .controller('ApplyCtrl', function (ConstantService, $scope, $interval, $rootScope, CapitalService, UtilsService, AccountService, $q) {
        $scope.flag_x = true;
        $scope.result_1 = false;
        /**
         * 资金提现
         * @param ThirdPaymentAccount 三方账号
         * @param bankCard 银行卡号
         * @param price 金额
         * @returns {*}
         */
            //TODO
        $scope.depositCapital = function () {
            //var bankN = _.find($scope.cardList, {"bankCode": $scope.bank});
            /*  CapitalService.depositCapital($scope.thirdAccount, $scope.bank, $scope.money)
             .then(function (data) {
             if (data && data.status === '000') {
             alert(data.data);//recharge success
             }
             }).catch(function (err) {
             console.log(err);
             });*/
            window.open(ConstantService.APIUrl() + '/p2p/app/acct/postnroute?jsonStr={"url":"-channelPay-depositCapital","param":{"transAmt":"' +
            $scope.money + '","bankCardSeq":"' + $scope.bankCardSequence + '"}}');
        };

        $scope.inputEnable = false;


        $scope.selectCard = function (bankCardSequence) {
            $scope.bankCardSequence = bankCardSequence;
        }
        $scope.addCard = function () {
            window.open('/p2p/app/acct/postnroute?jsonStr={"url":"-channelPay-bindCard","param":{}}', "_blank");
        }


        //col_value	col_cvcn
        //10	工商银行
        //11	农业银行
        //12	中国银行
        //13	建设银行
        //14	交通银行
        //15	中信银行
        //16	广东发展银行
        //17	民生银行
        //18	招商银行
        //19	华夏银行
        //20	光大银行
        //21	兴业银行
        //22	浦东发展银行
        //23	中国邮政储蓄银行
        //24	北京银行
        //25	上海银行
        //26	平安银行
        //27	渤海银行
        //28	南京银行
        //29	杭州银行
        //30	浙商银行
        //31	北京农村商业银行
        //32	上海农村商业银行
        //33	华夏银行
        var bankImage = [
            {
                "bankCode": 10,
                "bankName": "工商银行",
                "image": "assets/images/gongshangyinhang.png"
            },
            {
                "bankCode": 11,
                "bankName": "农业银行",
                "image": "assets/images/nongyeyinhang.png"
            },
            {
                "bankCode": 12,
                "bankName": "中国银行",
                "image": "assets/images/zhongguoyinhang.png"
            },
            {
                "bankCode": 13,
                "bankName": "建设银行",
                "image": "assets/images/jiansheyinhang.png"
            },
            {
                "bankCode": 14,
                "bankName": "交通银行",
                "image": "assets/images/jiaotongyinhang.png"
            },
            {
                "bankCode": 15,
                "bankName": "中信银行",
                "image": ""
            },
            {
                "bankCode": 16,
                "bankName": "广东发展银行",
                "image": ""
            },
            {
                "bankCode": 17,
                "bankName": "民生银行",
                "image": "assets/images/minshengyinhang.png"
            },
            {
                "bankCode": 18,
                "bankName": "招商银行",
                "image": "assets/images/zhaoshangyinhang.png"
            },
            {
                "bankCode": 19,
                "bankName": "华夏银行",
                "image": ""
            },
            {
                "bankCode": 20,
                "bankName": "光大银行",
                "image": "assets/images/guangdayinhang.png"
            },
            {
                "bankCode": 21,
                "bankName": "兴业银行",
                "image": "assets/images/xingyeyinhang.png"
            },
            {
                "bankCode": 25,
                "bankName": "上海银行",
                "image": "assets/images/shanghaiyinhang.png"
            }, {
                "bankCode": 22,
                "bankName": "浦发银行",
                "image":"assets/images/spd.png"
            }, {
                "bankCode": 23,
                "bankName": "中国邮政银行",
                "image":"assets/images/postal.png"
            }
        ]

        CapitalService.queryCapitalInfo()
            .then(function (data) {
                if (data.status === "000") {
                    var a = data.data;
                    $scope.thirdAccount = a.thirdAccount;
                    $scope.availableBalance = a.availableBalance;
                } else {
                    return $q.reject(data.msg);
                }
            })
            .then(function () {
                return CapitalService.bankCardList()
                    .then(function (cardList) {
                        //{"status":"000","msg":"请求数据成功!","data":[{"thirdPaymentId":"武大郎","bankCode":13,"bankCardNumber":6217001212354568546,"bankCardDefaultDrawStatus":0,"bankProvince":0,"bankCity":0,"bankTown":0,"accountSequnece":1,"bankName":null,"bankMobile":"13916143511","bankPrivateZone":"","bankDataCharacterSet":"","bankCardSequence":1}]}
                        if (cardList) {
                            $scope.cardList = cardList.map(function (item) {
                                var bank = _.find(bankImage, {"bankCode": item.bankCode});
                                if (bank) {
                                    bank = _.cloneDeep(bank);
                                    //bank.cardNumber = item.bankCardNumber;
                                    bank.bankCardSequence = item.bankCardSequence;
                                    bank.lastFour = item.bankCardNumber.substr(-4);
                                    bank.unique = bank.bankCode + "-" + bank.lastFour;
                                    bank.bankCardDefaultDrawStatus = item.bankCardDefaultDrawStatus;
                                    return bank;
                                } else {
                                    return {};
                                }
                            });
                            var defaultCard = _.find(cardList, {"bankCardDefaultDrawStatus": 0});
                            //var defaultCard = $scope.cardList.filter(function (t) {
                            //    return t.bankCardDefaultDrawStatus === 0;
                            //})
                            $scope.bankCardSequence = defaultCard ? defaultCard.bankCardSequence : $scope.cardList[0].bankCardSequence;
                        }

                        $scope.inputEnable = cardList && cardList.length > 0;
                    });
            })
            .catch(function (err) {
                console.info(err);
            });

        $scope.getAccountById = function () {
            var promise = AccountService.getAccountById();
            promise.then(function (obj) {//resolve
                if (obj && obj.status === '000') {
                    $scope.mobile = obj.data.mobile;
                    $scope.mobileS = UtilsService.hashMobile(obj.data.mobile);
                } else {
                    alert("获取手机号码失败！");
                }
            }).catch(function (err) {
                console.log(err);
            });
        };
        $scope.getAccountById();

        $scope.checkAmount = function () {
            alert("取现金额最低为5元")
        }

        //send Mobile VerificationCode
        $scope.sendMobileVerificationCode = function () {
            if ($scope.mobile) {
                var promise = AccountService.sendMobileVerificationCode($scope.mobile, '3');
                promise.then(function (data) {//resolve
                    if (data && data.status === '000') {//send mobile verificationCode success

                    } else if (data && data.status === '213') {//send mobile verificationCode failed
                        alert(data.msg);
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }
        };

        $scope.$watch("money", function (newV, oldV) {
            $scope.availableBalanceError = false;
            if (newV && newV >= 5) {
                //$scope.charge = Math.max(newV * 0.003, 2);
                CapitalService.topupFees(newV)
                    .then(function (obj) {
                        var fee = obj.data;
                        if ((parseFloat(newV) + fee) > $scope.availableBalance) {
                            $scope.availableBalanceError = true;
                            $scope.inputEnable = false;
                            $scope.charge = null;
                        } else {
                            $scope.inputEnable = true;
                            $scope.charge = obj.data;
                        }

                    })
                    .catch(function (err) {
                        $scope.inputEnable = false;
                        console.error(err);
                    })

            }
        })

        //Validate mobile VerificationCode
        $scope.validMobileVerificationCode = function () {
            $scope.flag_x = false;
            var mobileVerificationCode = $scope.mobileVerificationCode;
            if (mobileVerificationCode && mobileVerificationCode.length === 6 && $scope.mobile.length === 11) {
                var promise = AccountService.validMobileVerificationCode($scope.mobile, $scope.mobileVerificationCode);
                promise.then(function (data) {//resolve
                    if (data && data.status === '211') {//valid success
                        $scope.result_1 = true;
                    } else if (data && data.status === '212') {//valid error
                        $scope.result_1 = false;
                    } else if (data && data.status === '207') {
                        $scope.result_1 = false;
                    } else {
                        $scope.result_1 = false;
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            } else {
                $scope.result_1 = false;
            }
        };


        var InterValObj; //timer变量，控制时间
        var count = 120; //间隔函数，1秒执行
        var curCount;//当前剩余秒数
        $scope.$on('$destroy', function () {
            $interval.cancel(InterValObj);
        });
        //发送验证码
        $scope.sendSecurityCode = function () {
//            $("#mobile").attr("disabled", "true");
            $scope.sendMobileVerificationCode();//invoke send mobile verificationCode
            curCount = count;
            $("#send_apply").attr("disabled", "true");
            $("#send_apply").removeClass("sendChkVerification");
            $("#send_apply").addClass("sendVerification");
            $("#send_apply").text(curCount + "秒");
            InterValObj = $interval($scope.SetRemainTime, 1000);
//            InterValObj = window.setInterval($scope.SetRemainTime, 1000); // 启动计时器，1秒执行一次
            // 向后台发送处理数据
        };

        //timer处理函数
        $scope.SetRemainTime = function () {
            if (curCount == 0) {
//                $("#mobile").removeAttr("disabled");
                $interval.cancel(InterValObj);
//                window.clearInterval(InterValObj);// 停止计时器
                $("#send_apply").removeAttr("disabled");// 启用按钮
                $("#send_apply").removeClass("sendVerification");
                $("#send_apply").addClass("sendChkVerification");
                $("#send_apply").text("发送动态码");
            } else {
                curCount--;
                $("#send_apply").text(curCount + "秒");
            }
        };

        $scope.moneyBlur = function () {
            var moeny = $scope.money;
            moeny = parseFloat(moeny)
            if (moeny < 5) {
                //$scope.money = null;
                $scope.moneyMinError = true;
                $scope.inputEnable = false;
            } else if (moeny > parseFloat($scope.availableBalance)) {
                // $scope.money = null;
                $scope.moneyMaxError = true;
            }
        }

        $scope.moneyFocus = function () {
            $scope.moneyMinError = null;
            $scope.moneyMaxError = null;
        }

        $scope.moneyKeyUp = function () {
            var newV = $scope.money;
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
                $scope.money = t;
            }
        };
    });
