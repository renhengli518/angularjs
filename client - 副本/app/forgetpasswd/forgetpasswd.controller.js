'use strict';

angular.module('p2pClientApp')
    .controller('ForgetpasswdCtrl', function ($interval, $scope, AccountService) {

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

        $scope.message = 'Hello';
        $scope.xxx = false;
        $scope.isNameMatchMobile=false;
        $scope.judgeMobileIfPass = function (isValid) {
            $scope.isNameMatchMobile=false;
            if (isValid) {
                AccountService.isUserNameMatchMobile($scope.username,$scope.mobile).then(function(obj){
                    if(obj&&obj.status==='000'){
                        $scope.isNameMatchMobile=true;
                        $("#sendYYY").removeAttr("disabled");// enable button
                    }else{
                        $scope.isNameMatchMobile=false;
                        $("#sendYYY").removeAttr("disabled");// enable button
                        $("#sendYYY").attr("disabled", "true");// disable button
                    }
                }).catch(function(err){
                    console.log(err);
                });

            } else {
                $("#sendYYY").removeAttr("disabled");// enable button
                $("#sendYYY").attr("disabled", "true");// disable button
            }
        };

        //unable Chinese
        /*$scope.chineseForbidden = function(){
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

        $scope.accountIsExist = function () {
            var username = $scope.username;
            if (username) {
                var promise = AccountService.accountIsExist(username);
                promise.then(function (obj) {//resolve
                    if (obj && obj.status === '200') {//user do not exist
                        $scope.xxx = true;
                    } else if (obj && obj.status === '201') {//user does exist
                        $scope.xxx = false;
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }
        };

        $scope.getQuestionListByUserName = function () {
            $scope.list = [];
            var promise = AccountService.getQuestionListByUserName($scope.username);
            promise.then(function (data) {//resolve
                if (data && data.status === '000') {
                    $scope.systemQuestionSequence = data.data[0].systemQuestionSequence;
                    $scope.list = data.data;
                } else {
                    alert(data.msg);
                }
            }, function (data) {//reject
                alert(data.msg);
            }).catch(function (data) {
                alert(data.msg);
                console.log(data.msg);
            });
        };

        $scope.findPassword = function () {
            var promise = AccountService.findPassword($scope.username, $scope.password);
            promise.then(function (data) {//resolve
                if (data && data.status === '000') {
                    //if reset password success then go to next step
                    $scope.focusStep = 3;
                } else {
                    alert(data.msg);
                }
            }).catch(function (data) {
                console.log(data.msg);
            });
        };

        $scope.focusStep = 1;
        $scope.next_1 = function (isValid) {
            // check to make sure the form is completely valid
            if (isValid) {
                AccountService.isUserNameMatchMobile($scope.username, $scope.mobile).then(function (data) {
                    if (data.status === '000') {
                        $scope.focusStep = 2;
                        //do something to save message
                        $scope.checkAccountIsSetQuestion = false;
                        var promise = AccountService.checkAccountIsSetQuestion($scope.username);
                        promise.then(function (data) {//resolve
                            if (data && data.status === '226') {
                                $scope.checkAccountIsSetQuestion = true;
                                if ($scope.checkAccountIsSetQuestion) {
                                    //invoke method to getQuestionListByUserName
                                    $scope.getQuestionListByUserName();
                                }
                            } else if (data && data.status === '227') {
                                $scope.checkAccountIsSetQuestion = false;
                            } else if (data && data.status === '200') {
                                alert(data.msg);
                            } else {
                                alert(data.msg);
                            }
                        }).catch(function (err) {
                            console.log(err);
                        });
                    } else {
                        alert(data.msg);
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            } else {
                alert("表单验证不通过");
            }

        };
        $scope.answerResult = true;
        $scope.next_2 = function (isValid) {
            if (isValid) {
                var systemQuestionSequence = $scope.systemQuestionSequence;
                var accountQuestionAnswer = $scope.accountQuestionAnswer;
                if (accountQuestionAnswer) {//设置密保问题 需要校验答案
                    var promise = AccountService.checkAccountQuestionAnswer(String(systemQuestionSequence), accountQuestionAnswer, $scope.username);
                    promise.then(function (data) {//resolve
                        if (data && data.status === '228') {
                            //Answer to secret question is right,update password
                            //invoke findPassword to reset password
                            $scope.findPassword();
                            $scope.answerResult = true;
                        } else {//答案不正确
//                            alert(data.msg);
                            $scope.answerResult = false;
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                } else {//没设置密保问题 直接更新密码
                    $scope.findPassword();
                }
            } else {
                alert("表单验证不通过");
            }
        };
        $scope.next_3 = function () {
            $scope.focusStep = 1;
            $interval.cancel(InterValObj);
//            window.clearInterval(InterValObj);// 停止计时器
            $("#sendYYY").removeAttr("disabled");// 启用按钮
            $("#sendYYY").addClass("sendChk");
            $("#sendYYY").removeClass("send");
            $("#sendYYY").text("发送动态码");
        };

        //send Mobile VerificationCode
        $scope.sendMobileVerificationCode = function () {
            if ($scope.mobile) {
                var promise = AccountService.sendMobileVerificationCode($scope.mobile, '2');
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
        $scope.flag_1 = false;
        $scope.validMobileVerificationCode = function () {
            if ($scope.mobileVerificationCode && $scope.mobile) {
                $scope.flag_x = false;
                var promise = AccountService.validMobileVerificationCode($scope.mobile, $scope.mobileVerificationCode);
                promise.then(function (data) {//resolve
                    if (data && data.status === '211') {//valid success
//                    alert(data.msg);
                        $scope.flag_1 = true;
                    } else if (data && data.status === '212') {//valid error
                        $scope.flag_1 = false;
                    } else if (data && data.status === '207') {
                        $scope.flag_1 = false;
                    } else {
                        $scope.flag_1 = false;
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }
        };

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
            if($scope.password_confirm){
                $scope.passwordFuc();
            }

        };
        var PasswordSecurityReg = function () {
            var numberReg = /[\d]/;
            var lcReg = /[a-z]/;
            var ucReg = /[A-Z]/;
            this.high = function (str) {
                return lcReg.test(str) && ucReg.test(str) && numberReg.test(str);
            };
            this.low = function (str) {
                return /^[\d]*$/.test(str) || /^[a-z]*$/.test(str) || /^[A-Z]*$/.test(str);
            };
            this.medium = function (str) {
                return ((numberReg.test(str) && lcReg.test(str)) || (numberReg.test(str) && ucReg.test(str)) || (lcReg.test(str) && ucReg.test(str))) && !this.high(str);
            };
            return this;
        };

        var InterValObj; //timer变量，控制时间
        var count = 120; //间隔函数，1秒执行
        var curCount;//当前剩余秒数
        $scope.$on('$destroy', function () {//自动摧毁定时器
            $interval.cancel(InterValObj);
        });
        //发送验证码
        $scope.sendSecurityCode = function () {
            $scope.sendMobileVerificationCode();//invoke send mobile verificationCode
            $("#mobile").attr("disabled", "true");
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
                $("#mobile").removeAttr("disabled");
            } else {
                curCount--;
                $("#sendYYY").text(curCount + "秒");
            }
        };
    });
