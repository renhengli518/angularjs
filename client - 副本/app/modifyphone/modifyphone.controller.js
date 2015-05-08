'use strict';

angular.module('p2pClientApp')
    .controller('ModifyphoneCtrl', function ($scope, $interval, AccountService) {
        $scope.step = 1;
        $scope.initStatus = true;
        $scope.judgeMobile = false;
        $scope.flag_3 = false;
        $scope.allow = false;
        $scope.allow_1 = false;
        $scope.flag_x = true;
        //---step 1 start

        //linsner mobile should be 11
        $scope.resetMobile = function (mobile) {
            if (mobile.length >= 11) {
                $scope.mobile = mobile.substr(0, 11);
            }
        };

        //linsner mobile should be 11
        $scope.resetMobile_step2 = function (mobile) {
            if (mobile.length > 11) {
                $scope.mobile_new = mobile.substr(0, 11);
            }
        };

        $scope.judgeMobileIfPass = function (isValid, mobile) {
            $scope.allow = true;
            if (isValid) {
                $("#sendYYY").removeAttr("disabled");// enable button
                var promise = AccountService.checkMobile($scope.mobile);
                promise.then(function (data) {//resolve
                    if (data && data.status === '000') {
                        $scope.judgeMobile = true;
                        $scope.initStatus = false;
                        $scope.flag_3 = true;
                    } else if (data && data.status === '238') {//手机号码不正确
                        $scope.judgeMobile = false;
                        $scope.initStatus = false;
                        $("#sendYYY").removeAttr("disabled");// enable button
                        $("#sendYYY").attr("disabled", "true");// disable button
                    } else {
                        $scope.judgeMobile = false;
                        $scope.initStatus = false;
                        $("#sendYYY").removeAttr("disabled");// enable button
                        $("#sendYYY").attr("disabled", "true");// disable button
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            } else {
                $("#sendYYY").removeAttr("disabled");// enable button
                $("#sendYYY").attr("disabled", "true");// disable button
            }
        };


        //send Mobile VerificationCode
//        $scope.sendMobileVerificationCode = function () {
//            if ($scope.mobile) {
//                var promise = AccountService.sendMobileVerificationCode($scope.mobile);
//                promise.then(function (data) {//resolve
//                    if (data && data.status === '000') {//send mobile verificationCode success
//
//                    } else if (data && data.status === '213') {//send mobile verificationCode failed
//                        alert(data.msg);
//                    }
//                }).catch(function (err) {
//                    console.log(err);
//                });
//            }
//        };

        //Validate mobile VerificationCode
//        $scope.validMobileVerificationCode = function () {
//            if($scope.mobile){
//                var promise = AccountService.validMobileVerificationCode($scope.mobile, $scope.mobileVerificationCode);
//                promise.then(function (data) {//resolve
//                    if (data && data.status === '211') {//valid success
//
//                    } else if (data && data.status === '212') {//valid error
//                        alert(data.msg);
//                    } else if (data && data.status === '207') {
//                        alert(data.msg);
//                    } else {
//                        alert(data.msg);
//                    }
//                }).catch(function (err) {
//                    console.log(err);
//                });
//            }
//        };

        var InterValObj; //timer变量，控制时间
        var count = 120; //间隔函数，1秒执行
        var curCount;//当前剩余秒数
        $scope.$on('$destroy', function () {//自动摧毁定时器
            $interval.cancel(InterValObj);
        });
        //发送验证码
        $scope.sendSecurityCode = function () {
            $scope.sendMobileVerificationCode();//invoke send mobile verificationCode
            curCount = count;
            $("#sendYYY").attr("disabled", "true");
            $("#sendYYY").removeClass("sendChkVerification");
            $("#sendYYY").addClass("sendVerification");
            $("#sendYYY").text(curCount + "秒");
            InterValObj = $interval($scope.SetRemainTime, 1000);
//            InterValObj = window.setInterval($scope.SetRemainTime, 1000); // 启动计时器，1秒执行一次
            // 向后台发送处理数据
        };

        //timer处理函数
        $scope.SetRemainTime = function () {
            if (curCount == 0) {
                $interval.cancel(InterValObj);
//                window.clearInterval(InterValObj);// 停止计时器
                $("#sendYYY").removeAttr("disabled");// 启用按钮
                $("#sendYYY").removeClass("sendVerification");
                $("#sendYYY").addClass("sendChkVerification");
                $("#sendYYY").text("发送动态码");
            } else {
                curCount--;
                $("#sendYYY").text(curCount + "秒");
            }
        };
        $scope.next_1 = function () {
            $scope.msg_flag = false;
            if ($scope.mobile && $scope.password) {
                var promise = AccountService.checkMobileAndPwd($scope.mobile, $scope.password);
                promise.then(function (obj) {
                    if (obj && obj.status === '000') {
                        $scope.msg_flag = false;
                        $scope.step = 2;
                    } else {
//                        alert(obj.msg);
                        $scope.msg_flag = true;
                        $scope.msg = "请输入正确的密码";
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }
        };

        $scope.whenModifyMobile = function () {
            $scope.flag_x = true;
            $scope.allow_1 = false;
            $scope.mobileVerificationCode_new = null;
            $scope.result_1 = false;
            $scope.msg_1_flag = false;
        };

        $scope.next_2 = function () {
            $scope.msg_1_flag = false;
            AccountService.modifyAccountMobile($scope.mobile_new).then(function (data) {
                if (data && data.status === '000') {
                    $scope.step = 3;
                    $scope.msg_1_flag = false;
                } else {
//                    alert(data.msg);
                    $scope.msg_1_flag = true;
                    $scope.msg_1 = data.msg;
                }
            }).catch(function (err) {
                console.log(err);
            });
        };

        $scope.next_3 = function () {
            $scope.step = 1;
            $interval.cancel(InterValObj);
//            window.clearInterval(InterValObj);// 停止计时器
            $("#sendZZZ").removeAttr("disabled");// 启用按钮
            $("#sendZZZ").removeClass("sendVerification");
            $("#sendZZZ").addClass("sendChkVerification");
            $("#sendZZZ").text("发送动态码");
        };


        //---step 2 start
        $scope.flag_1 = false;
        $scope.flag_2 = false;//用于判断是否可以提交下一步
        $scope.judgeMobileIfPass_1 = function (isValid, mobile) {
            if (mobile.length > 11) {
                $scope.mobile_new = mobile.substr(0, 11);
            } else {
                $scope.allow_1 = true;
                $scope.msg_1_flag = false;
                if (isValid) {
                    if ($scope.mobile !== $scope.mobile_new) {
                        //TODO 3.23 dk add check mobile is exist in database begin----
                        //判断手机号是否已经存在
                        var promise = AccountService.checkMobileIsExist($scope.mobile_new);
                        promise.then(function (obj) {
                            if (obj && obj.status === "000") {//后台存在手机号码
                                //mobileIsExist = true;
                                $scope.msg_1_flag = true;
                                $scope.msg_1 = "此手机号码已存在";
                            } else {//后台不存在该手机号
                                //mobileIsExist = false;
                                $("#sendZZZ").removeAttr("disabled");// enable button
                                $scope.flag_1 = true;
                                $scope.msg_1_flag = false;
                            }
                        }).catch(function (err) {
                            console.log(err);
                        });
                        //------end
//            		$("#sendZZZ").removeAttr("disabled");// enable button
//    				$scope.flag_1 = true;
//    				$scope.msg_1_flag = false;
                    } else {
                        $scope.msg_1_flag = true;
                        $scope.msg_1 = "新手机号码与原手机号码相同";
                    }
                } else {
                    $("#sendZZZ").removeAttr("disabled");// enable button
                    $("#sendZZZ").attr("disabled", "true");// disable button
                    $scope.flag_1 = false;
                }
            }
        };

        //send Mobile VerificationCode
        $scope.sendMobileVerificationCode_1 = function () {
            if ($scope.mobile_new) {
                var promise = AccountService.sendMobileVerificationCode($scope.mobile_new, '4');
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

        //发送验证码
        $scope.sendSecurityCode_1 = function () {
            $scope.sendMobileVerificationCode_1();//invoke send mobile verificationCode
            curCount = count;
            $("#sendZZZ").attr("disabled", "true");
            $("#sendZZZ").removeClass("sendChkVerification");
            $("#sendZZZ").addClass("sendVerification");
            $("#sendZZZ").text(curCount + "秒");
            InterValObj = $interval($scope.SetRemainTime_1, 1000);
//            InterValObj = window.setInterval($scope.SetRemainTime, 1000); // 启动计时器，1秒执行一次
            // 向后台发送处理数据
        };

        //timer处理函数
        $scope.SetRemainTime_1 = function () {
            if (curCount == 0) {
                $interval.cancel(InterValObj);
//                window.clearInterval(InterValObj);// 停止计时器
                $("#sendZZZ").removeAttr("disabled");// 启用按钮
                $("#sendZZZ").removeClass("sendVerification");
                $("#sendZZZ").addClass("sendChkVerification");
                $("#sendZZZ").text("发送动态码");
            } else {
                curCount--;
                $("#sendZZZ").text(curCount + "秒");
            }
        };

        //Validate mobile VerificationCode
        $scope.validMobileVerificationCode_1 = function () {
            $scope.flag_x = false;
            if ($scope.mobile_new) {
                var promise = AccountService.validMobileVerificationCode($scope.mobile_new, $scope.mobileVerificationCode_new);
                promise.then(function (data) {//resolve
                    if (data && data.status === '211') {//valid success
                        $scope.flag_2 = true;
                        $scope.result_1 = true;
                    } else if (data && data.status === '212') {//valid error
//                        alert(data.msg);
                        $scope.flag_2 = false;
                        $scope.result_1 = false;
                    } else if (data && data.status === '207') {
//                        alert(data.msg);
                        $scope.flag_2 = false;
                        $scope.result_1 = false;
                    } else {
//                        alert(data.msg);
                        $scope.flag_2 = false;
                        $scope.result_1 = false;
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }
        };

    });
