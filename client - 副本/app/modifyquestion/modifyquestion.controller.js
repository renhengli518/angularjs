'use strict';

angular.module('p2pClientApp')
    .controller('ModifyquestionCtrl', function ($scope, AccountService, UtilsService) {
        $scope.step = 1;

        //首先判断当前用户是否有密保问题，有则获取当前用户问题列表，没有则不显示
        $scope.checkAccountIsSetQuestion = false;

        UtilsService.cache("username")
            .then(function (username) {
                $scope.username = username;
                // 检查用户是否设置了问题
                if (username) {
                    var promise = AccountService.checkAccountIsSetQuestion(username);
                    return promise.then(function (data) {//resolve
                        if (data && data.status === '226') {
                            $scope.checkAccountIsSetQuestion = true;
                            if ($scope.checkAccountIsSetQuestion) {
                                //invoke method to getQuestionListByUserName
                                $scope.getQuestionListByUserName(username);
                            }
                        } else if (data && data.status === '227') {
                            $scope.checkAccountIsSetQuestion = false;
                        } else if (data && data.status === '200') {
//                            alert(data.msg);
                            console.log(data.msg);
                        } else {
//                            alert(data.msg);
                            console.log(data.msg);
                        }
                    })
                }

            }).catch(function (err) {
                console.log(err);
            });

        // 通过用户名获取当前用户的问题列表
        $scope.getQuestionListByUserName = function (username) {
            $scope.list = [];
            var promise = AccountService.getQuestionListByUserName(username);
            promise.then(function (data) {//resolve
                if (data && data.status === '000') {
                    $scope.systemQuestionSequence = data.data[0].systemQuestionSequence;
                    $scope.list = data.data;
                } else {
                    alert(data.msg);
                }
            }).catch(function (err) {
                console.log(err);
            });
        };


        $scope.questionObjList = [];
        //add question
        $scope.addQuestion = function () {
            if ($scope.questionObjList.length < $scope.systemQuestion.length && $scope.questionObjList.length <= 2) {
                $scope.questionObjList.push({
                    "id": new Date().getTime(),
                    "question": $scope.systemQuestion[0].SystemQuestionSequence ,
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

        $scope.answerResult = true;
        $scope.submitForm = function (isValid) {
            if (isValid) {
                var systemQuestionSequence = $scope.systemQuestionSequence;
                var accountQuestionAnswer = $scope.accountQuestionAnswer;
                var promise = AccountService.checkAccountQuestionAnswer(String(systemQuestionSequence), accountQuestionAnswer, $scope.username);
                promise.then(function (obj) {//resolve
                    if (obj && obj.status === '228') {
                        // if  answer is ok then save new question and answer
                        $scope.answerResult = true;
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
                            var promise = AccountService.updateAccountQuestionAnswer(data)
                                .then(function (data) {
                                    if (data.status === "000") {
                                        $scope.step = 2;
                                    } else {
                                        alert(data.msg);
                                    }
                                }).catch(function (err) {
                                    console.log(err);
                                });
                        }
                    } else {
                        $scope.answerResult = false;
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            } else {
                alert("表单验证不通过");
            }
        };


    });

