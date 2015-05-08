'use strict';

angular.module('p2pClientApp')
    .controller('ModifyemailCtrl', function ($scope, AccountService, UtilsService) {
//    $scope.message = 'Hello';
//        UtilsService.cache("account").then(function(Account){
//            $scope.email_old = Account.Email;
//        }).catch(function(err){
//            console.log(err);
//        });
        $scope.sendEmailSuccess = false;
        $scope.show=true;
        $scope.emailEqual= true;

        var promise = AccountService.getAccountById();
        promise.then(function (obj) {//resolve
            UtilsService.showLoading();
            if (obj && obj.status === '000') {
                $scope.user = obj.data;
                $scope.email_old = $scope.user.email;
            }
        }).finally(function () {
            UtilsService.hideLoading();
        }).catch(function (err) {
            console.log(err);
        });


        $scope.judgeEmail=function(){
//            $scope.show=false;
            if($scope.email === $scope.email_old){
                $scope.emailEqual= true;
            }else{
                $scope.emailEqual= false;
            }
        };

        $scope.submitForm = function (isValid) {
            if (isValid) {
                var promise = AccountService.modifyAccountEmail($scope.email, '2');
                promise.then(function (obj) {//resolve
                    if (obj && obj.status === '000') {//modify success
                        $scope.sendEmailSuccess = true;
//                        alert("修改成功");
                    } else if (obj && obj.status === '217') {//modify failed
                        $scope.sendEmailSuccess = false;
                        alert(obj.msg);
                    } else {
                        $scope.sendEmailSuccess = false;
                        alert(obj.msg);
                    }
                }).catch(function (err) {
                    $scope.sendEmailSuccess = false;
                    console.log(err);
                });
            }
        }


    });
