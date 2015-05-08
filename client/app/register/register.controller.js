'use strict';

angular.module('p2pClientApp')
    .controller('RegisterCtrl', function (CMSService, ConstantService, $rootScope, UtilsService, InvestService, $scope, $interval, $timeout, AccountService, $location, $sessionStorage) {
        //初始隐藏注册成功页面内容
        $scope.registerSuccess = false;
        $scope.registerInit = true;
        $scope.result_1 = false;
        $scope.display = false;
        $scope.flag_x = true;
        $scope.flag_y = true;

        //跳汇富开通用户
        $scope.openAccount = function () {
            var url = '/acct/postnroute?jsonStr={"url":"-channelPay-registerparam"}';
            window.open(ConstantService.RouteUrl() + url);
        };

        //20150131 chenchang add
        $scope.addCookie = function () {
            var url = window.location.href;
            if (url.indexOf("?refid=") > -1 && url.indexOf("&reftype=") > -1) {
                var refid = url.substring(url.indexOf("refid=") + "refid=".length, url.indexOf("&"));
                var reftype = url.substring(url.indexOf("reftype=") + "reftype=".length);
                AccountService.setCookie("refid", refid, 60);
                AccountService.setCookie("reftype", reftype, 60);
            }
        };
        //20150131 chenchang end

        $scope.whenModifyMobile = function () {
            $scope.show_1 = true;
            $scope.mobileVerificationCode = null;
            $scope.result_1 = false;
            $scope.mobileIsExist = false;
        };

        $scope.mobileIsExist = false;
        $scope.checkMobileIsExist = function () {
            $scope.show_1 = false;
            AccountService.checkMobileIsExist($scope.mobile).then(function (obj) {
                if (obj && obj.status === "000") {//后台存在手机号码
                    $scope.mobileIsExist = true;
                } else {//后台不存在该手机号
                    $scope.mobileIsExist = false;
                }

            }).catch(function (err) {
                console.log(err);
            });
        };
        $scope.refresh1 = function () {
            var url = ConstantService.APIUrl();
            var src = url + "/p2p/app/sudoor/captcha-image.html?" + Math.random();
            $("#captcha-validate").attr("src", src);
            $scope.verificationCode = null;
        };

        $scope.judgeUser = function () {
            $scope.display = false;
            $scope.accountIsExist = false;
            $scope.bothChineseAndSpecial = false;
            $scope.hasChinese = false;
            $scope.hasSpecial = false;
            var username = $scope.username;
            $scope.minLength = false;
            $scope.maxLength = false;
            var x = username.length;
            var pattern = new RegExp("[`~!@#$^&*()=|{}'+:;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]");
            var reg = /[\u4e00-\u9fa5]/g;
            var numList = username.match(reg);
            var y = 0;
            if (numList !== null) {
                numList = numList.join('');
                y = numList.length;
            }
            var z = x - y;
            if (y * 2 + z < 6) {
                $scope.minLength = true;
                $scope.usernameLengthError = false;
            } else if (y * 2 + z > 18) {
                $scope.maxLength = true;
                $scope.usernameLengthError = false;
            } else if (username.match(reg) !== null && username.match(pattern) !== null) {
                $scope.bothChineseAndSpecial = true;
                $scope.usernameLengthError = false;
            } else if (username.match(reg) !== null) {
                $scope.hasChinese = true;
                $scope.usernameLengthError = false;
            } else if (username.match(pattern) !== null) {
                $scope.hasSpecial = true;
                $scope.usernameLengthError = false;
            } else {//校验通过后才进入用户与后台的判断
                if ($scope.minLength || $scope.maxLength || $scope.bothChineseAndSpecial || $scope.hasChinese || $scope.hasSpecial) {
                    $scope.usernameLengthError = false;
                } else {
                    $scope.usernameLengthError = true;
                    if (username) {
                        var promise = AccountService.accountIsExist(username);
                        promise.then(function (obj) {//resolve
                            if (obj && obj.status === '200') {//user do not exist
                                $scope.accountIsExist = false;
                            } else if (obj && obj.status === '201') {//user does exist
                                $scope.accountIsExist = true;
                            } else {
                                alert(obj.msg);
                            }
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                }
            }

        };

        //unable Chinese
        /*  $scope.chineseForbidden = function(){
         var newV = $scope.username;
         var reg = /[\u4e00-\u9fa5]/g;
         if (newV) {
         $scope.username = newV.replace(reg, '');
         }

         var pattern = new RegExp("[`~!@#$^&*()=|{}'+:;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]");
         var rs = "";
         for (var i = 0; i < $scope.username.length; i++) {
         rs = rs+$scope.username.substr(i, 1).replace(pattern, '');
         }
         $scope.username=rs.trim();
         };*/
        //captcha-validate
        $scope.validate = function () {
            if ($scope.verificationCode && String($scope.verificationCode).length >= 5) {
                $scope.flag_y = false;
                var promise = CMSService.validate($scope.verificationCode);
                promise.then(function (data) {
                        if (data === "true") {
                            $scope.flag1 = true;
                        } else {
                            $scope.flag1 = false;
                            $scope.refresh1();
                        }
                    }
                ).catch(function (err) {
                        console.log(err);
                    });
            }
        };

        $scope.validate_1 = function () {
            if ($scope.verificationCode) {
                $scope.flag_y = false;
                var promise = CMSService.validate($scope.verificationCode);
                promise.then(function (data) {
                        if (data === "true") {
                            $scope.flag1 = true;
                        } else {
                            $scope.flag1 = false;
                            $scope.refresh1();
                        }
                    }
                ).catch(function (err) {
                        console.log(err);
                    });
            }
        };

        $scope.judgeMobileIfPass = function (isValid, mobile) {
            if (String(mobile).length >= 11) {
                $scope.mobile = mobile.substr(0, 11);
            }
            if (isValid) {
                $("#sendXXX").removeAttr("disabled");// enable button
            } else {
                $("#sendXXX").removeAttr("disabled");// enable button
                $("#sendXXX").attr("disabled", "true");// disable button
            }
        };
        //send Mobile VerificationCode
        $scope.sendMobileVerificationCode = function () {
            if ($scope.mobile) {
                var promise = AccountService.sendMobileVerificationCode($scope.mobile, '1');
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
        $scope.judgePwd_x = false;
        $scope.judgePwd_1 = function () {
            $scope.show = true;
            if ($scope.password_confirm === $scope.password) {
                $scope.judgePwd_x = true;
            } else {
                $scope.judgePwd_x = false;
            }
        };
        $scope.passwordFuc = function () {
            $scope.showLevel = false;
            $scope.judgePwd_1();
        };

        $scope.submitForm = function (isValid) {
            $scope.submitted = true;
            // check to make sure the form is completely valid
            if (!$scope.agree) {
                alert("请阅读并同意协议");
            } else {
                if (isValid) {
                    if ($scope.agree) {
                        var promise = AccountService.register($scope.username, $scope.password, $scope.mobile);
                        promise.then(function (data) {//resolve
                            if (data && data.status === '000') {//register success
                                $scope.registerSuccess = true;
                                $scope.registerInit = false;
                                $scope.loginAfterRegister();//register success should be login success
                            } else if (data && data.status === '201') {//username has already exist
                                $scope.refresh1();
                                alert(data.msg);
                            } else if (data && data.status === '208') {//mobile has already exist
                                $scope.refresh1();
                                alert(data.msg);
                            } else if (data && data.status === '230') {//register failed
                                $scope.refresh1();
                                alert(data.msg);
                            } else {
                                $scope.refresh1();
                                alert(data.msg);
                            }
                        }).catch(function (err) {
                            $scope.refresh1();
                            console.log(err);
                        });
                    }
                }
            }
        };

        $scope.loginAfterRegister = function () {
            var username = $scope.username;
            $sessionStorage.login = true;
            $rootScope.login = true;
            //invoke afterLogin to save account in sessionStorage
            return $scope.afterLogin(username)
                .then(function () {

                    return UtilsService.cache("username", username)
                        .finally(function () {
                            $rootScope.refreshHeader();
                        })
                }).catch(function (err) {
                    console.error(err);
                });
        };
        //登陆成功后，根据用户名获取到整个account，并放入sessionStorage中
        $scope.afterLogin = function (username) {
            return InvestService.getAccountSequenceByUsername(username)
                .then(function (list) {
                    if (list.length > 0) {
                        return UtilsService.cache("account", list[0].initData ? list[0].initData : list[0]);
                    }
                });
        };

        var InterValObj; //timer变量，控制时间
        var count = 120; //间隔函数，1秒执行
        var curCount;//当前剩余秒数
        $scope.$on('$destroy', function () {
            $interval.cancel(InterValObj);
        });
        //发送验证码
        $scope.sendSecurityCode = function () {
            if ($scope.flag1 && !$scope.mobileIsExist) {
                $("#mobile").attr("disabled", "true");
                $scope.sendMobileVerificationCode();//invoke send mobile verificationCode
                curCount = count;
                $("#sendXXX").attr("disabled", "true");
                $("#sendXXX").removeClass("sendChkVerification");
                $("#sendXXX").addClass("sendVerification");
                $("#sendXXX").text(curCount + "秒");
                InterValObj = $interval($scope.SetRemainTime, 1000);
//            InterValObj = window.setInterval($scope.SetRemainTime, 1000); // 启动计时器，1秒执行一次
                // 向后台发送处理数据
            }
        };

        //timer处理函数
        $scope.SetRemainTime = function () {
            if (curCount == 0) {
                $("#mobile").removeAttr("disabled");
                $interval.cancel(InterValObj);
//                window.clearInterval(InterValObj);// 停止计时器
                $("#sendXXX").removeAttr("disabled");// 启用按钮
                $("#sendXXX").removeClass("sendVerification");
                $("#sendXXX").addClass("sendChkVerification");
                $("#sendXXX").text("发送动态码");
            } else {
                curCount--;
                $("#sendXXX").text(curCount + "秒");
            }
        };

//        $scope.user = {};
        $scope.checkPasswordSecurity = function () {
            var pa = $scope.password;
            var levels = ["1", "2", "3"];
            if (pa) {
                var securityReg = new PasswordSecurityReg();
                if (securityReg.high(pa)) {
                    levels = [
                        "normalGreenBg1",
                        "normalGreenBg2",
                        "normalGreenBg3"
                    ];
                } else if (securityReg.medium(pa)) {
                    levels = [
                        "normalOrangeBg1",
                        "normalOrangeBg2",
                        "3"
                    ];

                } else if (securityReg.low(pa)) {
                    levels = [
                        "normalRedBg",
                        "2",
                        "3"
                    ];
                }
            }
            $scope.levels = levels;
        };
        var PasswordSecurityReg = function () {
            var numberReg = /[\d]/;
            var lcReg = /[a-z]/;
            var ucReg = /[A-Z]/;

            //TODO 3.23 dk 添加特殊字符过滤
            var specialReg = /[^0-9a-zA-Z]/;
            this.high = function (str) {
                return (lcReg.test(str) && ucReg.test(str) && numberReg.test(str) && specialReg.test(str))
                    || (lcReg.test(str) && numberReg.test(str) && specialReg.test(str))
                    || (lcReg.test(str) && ucReg.test(str) && specialReg.test(str))
                    || (ucReg.test(str) && numberReg.test(str) && specialReg.test(str))
                    || (lcReg.test(str) && ucReg.test(str) && numberReg.test(str));
            };
            this.low = function (str) {
                return /^[\d]*$/.test(str) || /^[a-z]*$/.test(str) || /^[A-Z]*$/.test(str) || /^[^0-9a-zA-Z]*$/.test(str);
            };
            this.medium = function (str) {
                return ((numberReg.test(str) && lcReg.test(str))
                    || (numberReg.test(str) && ucReg.test(str))
                    || (lcReg.test(str) && ucReg.test(str))
                    || (numberReg.test(str) && specialReg.test(str))
                    || (specialReg.test(str) && ucReg.test(str))
                    || (lcReg.test(str) && specialReg.test(str))
                    ) && !this.high(str);
            };
            return this;
        }

    });



