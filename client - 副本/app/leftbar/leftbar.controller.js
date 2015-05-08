'use strict';

angular.module('p2pClientApp')
    .controller('LeftBarCtrl', function ($scope, $location, UtilsService, InvestService) {

        $scope.isActive = function (route) {
            return route === $location.path();
        };

        $scope.show = true;
        $scope.show1 = false;
        $scope.show2 = false;

        //judge current user if open or close auto invest
        UtilsService.cache("username")
            .then(function (username) {
                return InvestService.getAccountSequenceByUsername(username);
            })
            .then(function (list) {
                if (list && list.length > 0) {
                    var accountSequence = list[0].AccountSequence;
                    return InvestService.judgeOpenOrCloseInvest(accountSequence)
                        .then(function (list) {
                            if (list.length == 0) {//close
                                $scope.show = true;
                                $scope.show1 = false;
                                $scope.show2 = false;
                            } else {
                                list.forEach(function (r) {
                                    if (r.Type === 0) {//0-自动投资-一键式 1-自动投资-自助式
                                        if (r.Status === 0) {//0-已启用 1-未启用
                                            $scope.show = false;
                                            $scope.show1 = true;
                                        } else {
                                            $scope.show1 = false;
                                        }
                                    } else {
                                        if (r.Status === 0) {//0-已启用 1-未启用
                                            $scope.show = false;
                                            $scope.show2 = true;
                                        } else {
                                            $scope.show2 = false;
                                        }
                                    }
                                });
                            }
                        })
                }

            }).catch(function (err) {
                console.log(err);
            });
    });
