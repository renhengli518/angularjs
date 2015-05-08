'use strict';
angular.module('p2pClientApp')
    .controller('LoginCtrl', function (md5, $state, InvestService, UtilsService, CMSService, ConstantService, $scope, $location, AccountService, $rootScope, $localStorage, $sessionStorage) {
        $sessionStorage.$reset();
        //if ($rootScope.login) {
        //    $state.go("account")
        //}
        AccountService.checkLoginStatus()
            .then(function () {
                $state.go("account");
            })
            .catch(function (err) {
                console.log(err);
            });
//       $scope.message={};
//        $scope.x1=function(){
//            if(!$scope.username){
//                $scope.message.push(['1','用户名不能为空']);
//            }
//        };
        //首先清空session
//        $localStorage.$reset();
//        AccountService.exitBeforeLogin();

        $scope.rememberUsername = false;
        $scope.rememberU = function () {
            $scope.rememberUsername = !$scope.rememberUsername;
        };

        $scope.refresh1 = function () {
            var url = ConstantService.APIUrl();
            var src = url + "/p2p/app/sudoor/captcha-image.html?" + Math.random();
            $("#captcha-validate").attr("src", src);
            $scope.verificationCode = null;
            $scope.flag_x = true;
        };

        UtilsService.cacheLocal("username_")
            .then(function (obj) {
                if (obj) {
                    $scope.rememberUsername = true;
                    if (obj.username) {
                        $scope.username = obj.username;
                        $scope.usernameReal = obj.usernameReal;
                    } else if (obj.usernameReal) {
                        $scope.username = obj.usernameReal;
                        $scope.usernameReal = obj.usernameReal;
                    }
                }
            })
            .catch(function (err) {
                console.error(err);
            });


        $scope.result_1 = false;
        $scope.show = false;
        //captcha-validate
        $scope.validate = function () {
            if ($scope.verificationCode && String($scope.verificationCode).length >= 5) {
                $scope.flag_x = false;
                var promise = CMSService.validate($scope.verificationCode);
                promise.then(function (data) {
                        if (data === "true") {
                            $scope.flag1 = true;
                            $scope.flag2 = false;
                            $scope.result_1 = true;
                        } else {
                            $scope.flag1 = false;
                            $scope.flag2 = true;
                            $scope.result_1 = false;

                            //TODO dk 3.30 bug 813 begin
                            var url = ConstantService.APIUrl();
                            var src = url + "/p2p/app/sudoor/captcha-image.html?" + Math.random();
                            $("#captcha-validate").attr("src", src);
                            $scope.verificationCode = null;
                            $scope.flag_x = true;
                            //end
                        }
                    }
                ).catch(function (err) {
                        console.log(err);
                    });
            }

        };
        $scope.validate_1 = function () {
            if ($scope.verificationCode) {
                $scope.flag_x = false;
                var promise = CMSService.validate($scope.verificationCode);
                promise.then(function (data) {
                        if (data === "true") {
                            $scope.flag1 = true;
                            $scope.flag2 = false;
                            $scope.result_1 = true;
                        } else {
                            $scope.flag1 = false;
                            $scope.flag2 = true;
                            $scope.result_1 = false;

                            //TODO dk 3.30 bug 813 begin
                            var url = ConstantService.APIUrl();
                            var src = url + "/p2p/app/sudoor/captcha-image.html?" + Math.random();
                            $("#captcha-validate").attr("src", src);
                            $scope.verificationCode = null;
                            $scope.flag_x = true;
                            //end
                        }
                    }
                ).catch(function (err) {
                        console.log(err);
                    });
            }

        };


        //validate username whether exist
        /* $scope.$watch("username", function () {
         accountIsExist();
         });
         var accountIsExist = function () {
         var username = $scope.username;
         if (username) {
         if (username.indexOf("****") !== -1) {
         username = $scope.usernameReal;
         }
         var promise = AccountService.accountIsExist(username);
         promise.then(function (obj) {//resolve
         if (obj && obj.status === '200') {//user do not exist
         $scope.accountIsExist = true;
         } else if (obj && obj.status === '201') {//user does exist
         $scope.accountIsExist = false;
         }
         }).catch(function (err) {
         console.log(err);
         });
         }
         };*/


        //submit form
        $scope.submitForm = function (isValid) {
            //$sessionStorage.login = true;
            ////TODO for testing
            //$location.url("/account");
//            alert(md5.createHash($scope.password));
            var username = $scope.username;
            if ($scope.rememberUsername && username.indexOf("****") === -1) {//save username
                var obj = {
                    "usernameReal": username
                };
                //var reg = /^(1)([2-9]{2})([0-9]{4})([0-9]{4})$/;
                //if (reg.test(username)) {
                //    var usernameReal = username.replace(reg, "$1$2****$4");
                //    obj.username = usernameReal;
                //}
                obj.username = UtilsService.hashMobile(username);
                UtilsService.cacheLocal("username_", obj);
            } else {                // set username  is ""
                UtilsService.cacheLocal("username_", null, true);
            }
            $scope.submitted = true;
            $scope.xxx = true;
            // check to make sure the form is completely valid
            if (isValid) {
                if ($scope.flag1) {

                    if (username.indexOf("****") !== -1) {
                        username = $scope.usernameReal;
                    }
                    var promise = AccountService.login(username, $scope.password, $scope.verificationCode);
                    promise.then(function (data) {
                            UtilsService.showLoading();
                            if (data && data.status === '000') {
                                //login success
                                $rootScope.username_1 = username;
                                $sessionStorage.login = true;
                                //invoke afterLogin to save account in sessionStorage
                                //return $scope.afterLogin(username)
                                //    .then(function () {
                                //        return UtilsService.cache("username", username);
                                //    })
                                //    .then(function () {
//                                        UtilsService.hideLoading();
                                UtilsService.cache("username", username).then(function () {
                                    if ($rootScope.historyPath) {
                                        //window.location.href = $rootScope.historyPath;
                                        $location.path($rootScope.historyPath);
                                        delete $rootScope.historyPath;
                                    } else {
                                        $state.go("account");
                                    }
                                });

                                //});
                            } else {
                                $scope.refresh1();
                                UtilsService.hideLoading();
                                if (data.status === "205") {//password error
                                    $scope.judgePassword = true;
                                } else if (data.status === "206") {//save login info failed
//                                    alert(data.msg);
                                    console.log(data.msg);
                                } else if (data.status === '200') {//user do not exist
                                    $scope.show = true;
                                }
                            }
                        }
                    ).catch(function (err) {
                            $scope.refresh1();
                            UtilsService.hideLoading();
                            console.log(err);
                        });
                } else {
                    UtilsService.hideLoading();
                }
            } else {
                UtilsService.hideLoading();
            }
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

    });
