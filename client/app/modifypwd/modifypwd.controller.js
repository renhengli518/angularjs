'use strict';

angular.module('p2pClientApp')
    .controller('ModifypwdCtrl', function ($scope, AccountService, $state) {
        $scope.step = 1;
        $scope.pwdErr = true;//判断输入当前登陆密码是否正确
        $scope.pass = false;//判断两次输入密码是否一致
        $scope.newAndOldEqual = false;
        $scope.judgePwdIfEqual = function (isValid) {
            $scope.show = false;
            $scope.newAndOldEqual = false;
            $scope.show1 = false;
            if(isValid){
                if ($scope.oldpwd === $scope.newpwd) {
                    $scope.newAndOldEqual = true;
                } else {
                    $scope.newAndOldEqual = false;
                    if ($scope.newpwd === $scope.newpwd_confirm) {
                        $scope.pass = true;
                    } else {
                        $scope.pass = false;
                    }
                }
            }
        };

        $scope.relogin = function () {
            AccountService.logout();
            $state.go("login");
        };
        //submit form
        $scope.submitForm = function (isValid) {
            if (isValid) {
                var promise = AccountService.resetPassword($scope.oldpwd, $scope.newpwd);
                promise.then(function (obj) {
                    //todo
                    if (obj && obj.status === '000') {
                        $scope.step = 2;
                    } else if (obj && obj.status === '205') {
                        $scope.pwdErr = false;
                    } else {
                        console.log(obj.msg);
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }
        };


        $scope.checkPasswordSecurity = function () {
            var pa = $scope.newpwd;
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
        }

    });

