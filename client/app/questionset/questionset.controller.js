'use strict';

angular.module('p2pClientApp')
    .controller('QuestionsetCtrl', function ($scope, AccountService) {
        $scope.step = 1;
        $scope.questionObjList = [];
        //add question
        $scope.addQuestion = function () {
            if ($scope.questionObjList.length < $scope.systemQuestion.length&&$scope.questionObjList.length<=2) {
                $scope.questionObjList.push({
                    "id": new Date().getTime(),
                    "question": "",
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
        $scope.submitForm =function(isValid){
            if(isValid){
                var data=[];
                $scope.questionObjList.forEach(function(t){
                    if(t.question>0){
                        data.push({
                                "systemQuestionSequence": t.question,
                                "answer" : t.answer
                            });
                    }
                });
                if(data.length>0){
                    var promise = AccountService.saveAccountQuestionAnswer(data,$scope.password)
                        .then(function(data){
                            if(data.status==="000"){
                                $scope.step = 2;
                                $scope.msg_flag = false;
                            }else {
//                                alert(data.msg);
                                $scope.msg_flag = true;
                                $scope.msg= "请输入正确的密码！";
                            }
                        }).catch(function(err){
                            console.log(err);
                        });
                }

            }

        }
        // 删除select下拉框 默认第一个空白选项 --无语
        $scope.removeInfo= function(){
            $('select ').each(function(obj){
                if($($(this).find('option')[0]).attr("value")==="? string: ?"){
                    $($(this).find('option')[0]).remove();
                }

            });
        }

    });
