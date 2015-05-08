'use strict';

angular.module('p2pClientApp')
    .controller('HeaderCtrl', function ($sessionStorage,$rootScope, InvestService, $scope, $location, AccountService, CMSService, UtilsService, AccountMessageService, _, $state) {

        $rootScope.refreshUnReadMail = function () {
            setTimeout(function () {
                $scope.$apply(function () {
                    AccountService.checkLoginStatus()
                        .then(function () {
                            $scope.login = true;
                            return AccountMessageService.accountMail()
                                .then(function (res) {
                                    if (res && res.status === "000") {
                                        $scope.unreadMail = res.data;
                                    }
                                })
                        })
                        .catch(function (err) {
                            $scope.login = false;
                        })
                        .finally(function () {
                            //UtilsService.hideLoading();
                        })
                });
            }, 2000);
        };

        $rootScope.refreshHeader = function () {

            if ($sessionStorage.login) {
                AccountService.getAccountById().then(function (data) {
                    if (data && data.status === '000' && data.data) {
                        var account = data.data;
                        $rootScope.username_1 = account.userName;
                    }
                }).then(function () {
                    return AccountMessageService.accountMail()
                        .then(function (res) {
                            if (res && res.status === "000") {
                                $scope.unreadMail = res.data;
                            }
                        })
                })
                    .catch(function (err) {
                        $scope.login = false;
                    })
            }
            /*AccountService.checkLoginStatus()
             .then(function () {
             $scope.login = true;
             //return UtilsService.cache("account").then(function (account) {
             //    if (account) {
             //        $scope.username_1 = account.UserName;
             //    }
             //});
             return AccountService.getAccountById().then(function (data) {
             if (data && data.status === '000' && data.data) {
             var account = data.data;
             $scope.username_1 = account.userName;
             }
             });
             })
             .then(function () {
             return AccountMessageService.accountMail()
             .then(function (res) {
             if (res && res.status === "000") {
             $scope.unreadMail = res.data;
             }
             })
             })
             .catch(function (err) {
             $scope.login = false;
             })
             .finally(function () {
             //UtilsService.hideLoading();
             })*/
            $scope.isActive = function (route) {
                return route === $location.path();
            };

            $scope.isHomePage = function (route) {
                return $location.path() === "/";
            };


            var _showH = [
                "/register",
                "/login"
            ]
            $scope.showHouse = function () {
                var currentPath = $location.path();
                return _.contains(_showH, currentPath);
            }

            $scope.refreshRegister = function () {
                var currentPath = $location.path();
                if (currentPath === "/register") {
                    $state.reload();
                    //window.location.href = "#/register";
                } else {
                    $state.go("register");
                }
            }
        };
        $rootScope.refreshHeader();

        $rootScope.autoInvestButton = function () {
            if ($rootScope.login) {
                var accountSequence = $rootScope.accountSequence;
                InvestService.judgeOpenOrCloseInvest(accountSequence)
                    .then(function (list) {
                        if (list.length == 0) {//close
                            //$scope.show = true;
                            //$scope.show1 = false;
                            //$scope.show2 = false;
                            $state.go("auto-invest");
                        } else {
                            var r = list[0];
                            if (r.Type === 0) {//0-自动投资-一键式 1-自动投资-自助式
                                if (r.Status === 0) {//0-已启用 1-未启用
                                    //$scope.show = false;
                                    //$scope.show1 = true;
                                    $state.go("onetouch");
                                }
                                //else {
                                //    $scope.show1 = false;
                                //}
                            } else {
                                if (r.Status === 0) {//0-已启用 1-未启用
                                    $state.go("buffet");
                                    //$scope.show = false;
                                    //$scope.show2 = true;
                                }
                                //else {
                                //    $scope.show2 = false;
                                //}
                            }
                        }
                    })
            } else {
                $state.go("auto-invest");
            }
        }
    });
