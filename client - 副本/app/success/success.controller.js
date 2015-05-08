'use strict';

angular.module('p2pClientApp')
    .controller('SuccessCtrl', function ($scope, UtilsService, $stateParams, $state, InvestService) {
        $scope.message = 'Hello';

        $scope.divParam = $stateParams.param;//param 是url中参数的key
        UtilsService.cache("account").then(function (account) {
            if (account) {
                $scope.refid = account.AccountSequence;
                $scope.refUrl = "http://www.vmoney.cn/#/register?refid=" + $scope.refid;
            }
        }).catch(function (err) {
            console.log(err);
        });

        $scope.shareWeibo = function () {
            var rnd = new Date().valueOf();
            $scope.refUrl = encodeURIComponent($scope.refUrl + "&reftype=2");
            window.open("http://service.weibo.com/share/share.php?url=" + $scope.refUrl + "&title=亲,你的钱还在银行定存吗？那就太out啦,推荐你高大上的理财平台---平xxx,12.5%以上预期年化利率,本息担保,维信旗下公司,资金安全有保障。戳右侧链接注册即送50元红包，让你的首笔投资收益再飙升！http://xxx.com&language=zh_cn&pic=&appkey=&rnd=" + rnd
                , "_blank",
                "width=615,height=505"
            )
            ;
        };
        
        $scope.autoInvest = function () {
            $state.go("auto-invest");
         }
        $scope.show=1;
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
                                //$scope.show = true;
                            	 $scope.show=1;
//                                $scope.show1 = false;
//                                $scope.show2 = false;
                            } else {
                                list.forEach(function (r) {
                                    if (r.Type === 0) {//0-自动投资-一键式 1-自动投资-自助式
                                        if (r.Status === 0) {//0-已启用 1-未启用
                                        	 $scope.show=2;
                                        } else {
                                           // $scope.show1 = false;
                                            //$scope.showtype=2;
                                        }
                                    } else {
                                        if (r.Status === 0) {//0-已启用 1-未启用
                                        	 $scope.show=3;
                                        } else {
                                        	//$scope.showtype=3;
                                            //$scope.show2 = false;
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
