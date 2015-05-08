'use strict';

angular.module('p2pClientApp')
    .controller('FindquestionCtrl', function ($scope, $interval, $timeout, AccountService) {
        $scope.step = 1;
        $scope.initStatus = true;
        $scope.judgeMobile = false;
        $scope.show_msg = false;
        //---step 1 start
        $scope.mobileFormat_1 = function (mobile) {
            if (mobile.length >= 11) {
                $scope.mobile = mobile.substr(0, 11);
            }
        };

        $scope.judgeMobileIfPass = function (isValid,mobile) {
            if (mobile.length > 11) {
                $scope.mobile = mobile.substr(0, 11);
            } else {
                $scope.mobileFormat = true;
                if (isValid) {
                    $("#sendXXX").removeAttr("disabled");// enable button
                    var promise = AccountService.checkMobile($scope.mobile);
                    promise.then(function (data) {//resolve
                        if (data && data.status === '000') {
                            $scope.judgeMobile = true;
                            $scope.initStatus = false;
                        } else if (data && data.status === '238') {//手机号码不正确
                            $scope.judgeMobile = false;
                            $scope.initStatus = false;
                            $("#sendXXX").removeAttr("disabled");// enable button
                            $("#sendXXX").attr("disabled", "true");// disable button
                        } else {
                            $scope.judgeMobile = false;
                            $scope.initStatus = false;
                            $("#sendXXX").removeAttr("disabled");// enable button
                            $("#sendXXX").attr("disabled", "true");// disable button
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                } else {
                    $("#sendXXX").removeAttr("disabled");// enable button
                    $("#sendXXX").attr("disabled", "true");// disable button
                }
            }
        };
        $scope.initFlag = function () {
            $scope.judgeMobile = true;
            $scope.mobileFormat = false;
            $scope.initStatus = true;
        };

        //send Mobile VerificationCode
        $scope.sendMobileVerificationCode = function () {
            if ($scope.mobile) {
                var promise = AccountService.sendMobileVerificationCode($scope.mobile, '5');
                promise.then(function (data) {//resolve
                    if (data && data.status === '000') {//send mobile verificationCode success

                    } else if (data && data.status === '213') {//send mobile verificationCode failed
                        alert(data.msg);
                    }
                }, function (data) {//reject
//                    if(data&&data.status==='000'){
                    console.log(data);
//                    }
                }).catch(function (err) {
                    console.log(err);
                });
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
            if ($scope.mobile) {
                $scope.sendMobileVerificationCode();//invoke send mobile verificationCode
                curCount = count;
                $("#sendXXX").attr("disabled", "true");
                $("#sendXXX").removeClass("sendChkVerification");
                $("#sendXXX").addClass("sendVerification");
                $("#sendXXX").text(curCount + "秒");
                InterValObj = $interval($scope.SetRemainTime, 1000);
//            InterValObj = window.setInterval($scope.SetRemainTime, 1000); // 启动计时器，1秒执行一次
                // 向后台发送处理数据
            } else {
                alert("请输入正确手机号码");
            }

        };

        //timer处理函数
        $scope.SetRemainTime = function () {
            if (curCount == 0) {
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


        //Validate mobile VerificationCode
        $scope.afterSubmit = false;
        $scope.next_1 = function (isValid) {
            $scope.msg_afterSubmit = "";
            if (isValid) {
                var promise = AccountService.validMobileVerificationCode($scope.mobile, $scope.mobileVerificationCode);
                promise.then(function (data) {//resolve
                    if (data && data.status === '211') {//valid success
                        $scope.step = 2;
                        $scope.afterSubmit = false;
//                       alert(data.msg);
                    } else if (data && data.status === '212') {//valid error
                        $scope.afterSubmit = true;
                        $scope.msg_afterSubmit = "输入手机动态码不正确";
//                        alert(data.msg);
                    } else if (data && data.status === '207') {
                        $scope.afterSubmit = true;
                        $scope.msg_afterSubmit = data.msg;
//                        alert(data.msg);
                    } else {
                        $scope.afterSubmit = true;
                        $scope.msg_afterSubmit = data.msg;
//                        alert(data.msg);
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            } else {
                alert("请输入正确信息后提交");
            }

        };


        $scope.questionObjList = [];
        //add question
        $scope.addQuestion = function () {
            if ($scope.questionObjList.length < $scope.systemQuestion.length && $scope.questionObjList.length <= 2) {
                $scope.questionObjList.push({
                    "id": new Date().getTime(),
                    "question": $scope.systemQuestion[0].SystemQuestionSequence,
                    "answer": ""
                });
            }
        };

        $scope.removeQuestion = function (id) {
            for (var i = 0; i < $scope.questionObjList.length; i++) {
                if ($scope.questionObjList[i].id === id) {
                    $scope.questionObjList.splice(i, 1);
                }
            }
        };

        //获取后台所有问题列表
        AccountService.getAllSystemQuestion(0).then(function (list) {
            $scope.systemQuestion = list;
            $scope.addQuestion();
        }).catch(function (err) {
            console.log(err);
        });

        $scope.msg_flag = false;
        $scope.submitForm = function (isValid) {
            if (isValid) {
                var data = [];
                $scope.questionObjList.forEach(function (t) {
                    if (t.question > 0) {
                        data.push({
                            "systemQuestionSequence": t.question,
                            "answer": t.answer
                        });
                    }
                });
                if (data.length > 0) {
                    var promise = AccountService.saveAccountQuestionAnswer(data, $scope.password)
                        .then(function (data) {
                            if (data.status === "000") {
                                $scope.msg_flag = false;
                                $scope.step = 3;
                            } else {
                                $scope.msg_flag = true;
                                $scope.msg = data.msg;
//                                alert(data.msg);
                            }
                        }).catch(function (err) {
                            console.log(err);
                        });
                }

            }

        }


    });
