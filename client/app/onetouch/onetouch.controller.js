'use strict';

angular.module('p2pClientApp')
    .controller('OnetouchCtrl', function (CapitalService, $scope, UtilsService, InvestService, ConstantService) {
        //add get current accountSequence
        $scope.show1 = true;
        $scope.show2 = false;
        $scope.showOpenThird = false;
        /*  InvestService.oneKeyInvest().then(function (data) {
         if (data&&data.status === "000") {
         $scope.showOpenThird=false;
         } else if(data&&data.status === "300"){
         $scope.thirdMsg="未开通第三方支付";
         $scope.showOpenThird=true;
         }else{

         alert(data.status);
         }
         }
         ).catch(function (err) {
         console.log(err);
         });*/

        CapitalService.queryCapitalInfo()
            .then(function (data) {
                if (data.status === "000") {
                    data = data.data;
                    $scope.accountFund = data;
                    $scope.thirdAccount = $scope.accountFund.thirdAccount;
                    if ($scope.thirdAccount) {
                        $scope.showOpenThird = false;
                    } else {
                        $scope.thirdMsg = "未开通第三方支付";
                        $scope.showOpenThird = true;
                    }
                } else if(data.status === "491"){
                    $scope.thirdMsg = "未开通第三方支付";
                    $scope.showOpenThird = true;
                    console.error("Failed to retrieve basice info" + data.msg);
                }else{
                    console.error("Failed to retrieve basice info" + data.msg);
                }

            }).catch(function (err) {
                console.log(err);
            });

        //跳汇富开通用户
        $scope.openAccount = function () {
            var url = '/acct/postnroute?jsonStr={"url":"-channelPay-registerparam"}';
            window.open(ConstantService.RouteUrl() + url);
        };

        UtilsService.cache("username")
            .then(function (username) {
                InvestService.getAccountSequenceByUsername(username).then(
                    function (list) {
                        var accountSequence = list[0].AccountSequence;
                        InvestService.judgeOpenOrCloseInvest(accountSequence)
                            .then(function (list) {
                                if (list.length == 0) {//close
                                    $scope.show1 = false;
                                    $scope.show2 = false;
                                } else {
                                    list.forEach(function (r) {
                                    	//TODO 3.31 dk begin
                                    	if(r.Status === 0){
                                            $scope.show1 = true;
                                            $scope.show2 = true;
                                            if (r.Type === 0) {//0-自动投资-一键式 1-自动投资-自助式
                                            	 $scope.ivstype="一键";
                                            }else{
                                            	$scope.ivstype="自助";
                                            }
                                            
                                            $scope.perMaxAmount = r.PerMaxAmount;
                                            $scope.periods_1= [];
                                            var x=r.Period.split(",");
                                            for(var i=0;i< x.length;i++){
                                                $scope.periods_1.push({
                                                    "value": i,
                                                    "text": x[i]
                                                });
                                            }
                                            $scope.creditLevels_1 = [];
                                            var y=r.CreditLevel.split(",");
                                            for(var w=0;w< y.length;w++){
                                                if(y[w]==='1'){
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "A"
                                                    });
                                                }else if(y[w]==='2'){
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "B"
                                                    });
                                                }else if(y[w]==='3'){
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "C"
                                                    });
                                                }else if(y[w]==='4'){
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "D"
                                                    });
                                                }else if(y[w]==='5'){
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "E"
                                                    });
                                                }else if(y[w]==='6'){
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "U"
                                                    });
                                                }else if (y[w]==='0'){
                                                    $scope.creditLevels_1.push({
                                                        "value": w,
                                                        "text": "A+"
                                                    });
                                                }

                                            }
                                    	}else{
                                    		  $scope.show1 = false;
                                              $scope.show2 = false;
                                    	}
                                    	
                                    	//TODO 3.31 dk end
                                    	
                                    	
                                    	
                                    	
                                    	
//                                        if (r.Type === 0) {//0-自动投资-一键式 1-自动投资-自助式
//                                            if (r.Status === 0) {//0-已启用 1-未启用
//                                                $scope.show1 = true;
//                                                $scope.show2 = true;                                         
//                                            } else {
//                                                $scope.show1 = false;
//                                                $scope.show2 = false;
//                                            }
//                                        } else {
//                                            $scope.show1 = false;
//                                            $scope.show2 = false;
//                                        }
                                    });
                                }
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    }
                ).catch(function (err) {
                        console.log(err);
                    });
            }).catch(function (err) {
                console.log(err);
            });
        
        $scope.periods = [
                          {
                              "name": "6期",
                              "value": "6",
                              "checked": true
                          },
                          {
                              "name": "12期",
                              "value": "12",
                              "checked": false
                          },
                          {
                              "name": "18期",
                              "value": "18",
                              "checked": false
                          },
                          {
                              "name": "24期",
                              "value": "24",
                              "checked": false
                          },
                          {
                              "name": "36期",
                              "value": "36",
                              "checked": false
                          }
                      ];

                      $scope.creditLevels = [
                          {
                              "name": "A",
                              "value": "1",
                              "checked": true
                          },
                          {
                              "name": "B",
                              "value": "2",
                              "checked": false
                          },
                          {
                              "name": "C",
                              "value": "3",
                              "checked": false
                          },
                          {
                              "name": "D",
                              "value": "4",
                              "checked": false
                          },
                          {
                              "name": "E",
                              "value": "5",
                              "checked": false
                          },
                          {
                              "name": "U",
                              "value": "6",
                              "checked": false
                          }
                      ];

        //获取可用余额
        UtilsService.cache("accountFund")
            .then(function (a) {
                if (a) {
                    $scope.thirdAccount = a.thirdAccount;
                    $scope.availableBalance = a.availableBalance;
                }
            })
            .catch(function (err) {
                console.log(err);
            });

        //submit form
        $scope.MsgInfo = false;
        $scope.submitForm_open = function () {
            var promise = InvestService.oneKeyInvest();
            promise.then(function (data) {
                    if (data && data.status === "000") {
                        var url = '/acct/postnroute?jsonStr={"url":"-channelPay-autoInvestmentStart","param":{"tenderPlanType":"W"}}';
                        window.open(ConstantService.RouteUrl() + url);
                        //TODO dk 3.24 bug747 begin*********
//                        $scope.show1 = true;
//                        $scope.show2 = true;
//                        $scope.MsgInfo = false;
                        //***********end 
                    } else if (data && data.status === "300") {
                        $scope.show1 = false;
                        $scope.show2 = false;
                        $scope.MsgInfo = true;
                    } else {
                        alert(data.msg);
                    }
                }
            ).catch(function (err) {
                    console.log(err);
                });
        };

        //submit form
        $scope.submitForm_close = function () {
//            var promise = InvestService.colseAutoInvest();
//            promise.then(function (data) {
//                    if (data.status === "000") {
//                        $scope.show1 = false;
//                        $scope.show2 = false;
//                    } else {
//                        $scope.show1 = true;
//                        $scope.show2 = true;
//                        alert(data.msg);
//                    }
//                }
//            ).catch(function (err) {
//                    console.log(err);
//                });
            var url = '/acct/postnroute?jsonStr={"url":"-channelPay-autoInvestmentClose","param":{}}';
            window.open(ConstantService.RouteUrl() + url);
        };

    });
