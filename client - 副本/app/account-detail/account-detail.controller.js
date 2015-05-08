'use strict';

angular.module('p2pClientApp')
    .controller('AccountDetailCtrl', function (CapitalService, $scope, AccountService, UtilsService, $filter, ConstantService,$rootScope) {

        $scope.user = {};
        //跳汇富开通用户
        $scope.openAccount = function () {
            var url = '/acct/postnroute?jsonStr={"url":"-channelPay-registerparam"}';
            window.open(ConstantService.RouteUrl() + url);
        };


        $scope.loginThirdPayAccount = function () {
            if ($scope.thirdAccount) {
                window.open('/p2p/app/acct/postnroute?jsonStr={"url":"-capital-getUserLoginParam","param":{}}', "_blank");
            }
        };

        //最高学历 select
        $scope.user = {
            status: $scope.user.educationDegree,
            income_old: $scope.user.income
        };

        $scope.statuses = [
//            {value:0, text: '未选择'},
            {value: 8, text: '硕士及以上'},
            {value: 7, text: '本科'},
            {value: 6, text: '大专'},
            {value: 4, text: '高中'},
            {value: 5, text: '中专'},
            {value: 3, text: '技校'},
            {value: 2, text: '初中'},
            {value: 1, text: '小学'},
            {value: 9, text: '其他'}

        ];

        $scope.incomes = [
//            {value: 0, text: '未选择'} ,
            {value: 1, text: '0~3999元'} ,
            {value: 2, text: '4000~7999元'} ,
            {value: 3, text: '8000~11999元'} ,
            {value: 4, text: '12000~15999元'} ,
            {value: 5, text: '16000~19999元'} ,
            {value: 6, text: '20000元以上'}
        ];
        $scope.getAccountById = function () {
            var promise = AccountService.getAccountById();
            promise.then(function (obj) {//resolve
                UtilsService.showLoading();
                var t = $rootScope;
                if (obj && obj.status === '000') {
                    $scope.user = obj.data;
                    if ($scope.user.safety === 1) {
                        $scope.safety = '低';
                    } else if ($scope.user.safety === 2) {
                        $scope.safety = '中';
                    } else if ($scope.user.safety === 3) {
                        $scope.safety = '高';
                    }

                    if ($scope.user.mobileBindStatus === 1) {//是否绑定手机号--否
                        $scope.bindMobile_1 = false;
                        $scope.bindMobile_2 = true;
//                        $scope.user.mobile='';
                    } else if ($scope.user.mobileBindStatus === 0) {                               //--是
                        $scope.bindMobile_1 = true;
                        $scope.bindMobile_2 = false;
                    } else {
                        $scope.bindMobile_1 = false;
                        $scope.bindMobile_2 = true;
//                        $scope.user.mobile='';
                    }

                    if ($scope.user.emailBindStatus === 1) {//是否绑定邮箱--否
                        $scope.bindEmail_1 = false;
//                        $scope.bindEmail_2 = true;
//                        $scope.user.email='';
                    } else if ($scope.user.emailBindStatus === 0) {                              //--是
                        $scope.bindEmail_1 = true;
//                        $scope.bindEmail_2 = false;
                    } else {
                        $scope.bindEmail_1 = false;
//                        $scope.bindEmail_2 = true;
//                        $scope.user.email='';
                    }
                    $scope.checkPasswordSecurity($scope.user.safety);
                    var selected = $filter('filter')($scope.statuses, {value: $scope.user.educationDegree});
                    $scope.user.educationDegree = ($scope.user.educationDegree && selected.length) ? selected[0].text : '暂无';
                    var selected_1 = $filter('filter')($scope.incomes, {value: $scope.user.income});
                    $scope.user.income = ($scope.user.income && selected_1.length) ? selected_1[0].text : '暂无';
                    //从后台取到所有省份和直辖市
                    $scope.AccountTouchProvinces = [];
                    return AccountService.queryAreaProvinces().then(function (list) {
                            list.forEach(function (t) {
                                if (t.AddressProvinceCode && t.AddressProvinceChineseName) {
                                    $scope.AccountTouchProvinces.push({
                                        "value": t.AddressProvinceCode,
                                        "text": t.AddressProvinceChineseName,
                                        "addressLevel": t.AddressLevel
                                    });
                                } else {
                                    $scope.AccountTouchProvinces.push({
                                        "value": t.CityCode,
                                        "text": t.CityChineseName,
                                        "addressLevel": t.AddressLevel
                                    });
                                }
                            });
                        }
                    ).finally(function () {
                            var selected_1 = $filter('filter')($scope.AccountTouchProvinces, {value: $scope.user.accountTouchProvince});
                            $scope.user.accountTouchProvince_1 = ($scope.user.accountTouchProvince && selected_1.length) ? selected_1[0].text : '暂无';
                            //从后台取到所有城市列表
                            $scope.AccountTouchCitys_1 = [];
                            return AccountService.queryAreaCitys().then(function (list) {
                                    list.forEach(function (t) {
                                        $scope.AccountTouchCitys_1.push({
                                            "value": t.CityCode,
                                            "text": t.CityChineseName
                                        });
                                    });
                                }
                            ).finally(function () {
                                    var selected_1 = $filter('filter')($scope.AccountTouchCitys_1, {value: $scope.user.accountTouchCity});
                                    $scope.user.accountTouchCity_1 = ($scope.user.accountTouchCity && selected_1.length) ? selected_1[0].text : '';
                                    return CapitalService.queryCapitalInfo()
                                        .then(function (data) {
                                            if (data.status === "000") {
                                                data = data.data;
                                                $scope.accountFund = data;
                                                $scope.thirdAccount = $scope.accountFund.thirdAccount;
                                            } else {
                                                console.info("Failed to retrieve basic info " +  data ? data.msg : "");
                                            }

                                        }).finally(function(){
                                            $scope.getCitys();
                                            //add by renhengli 2015-04-21


                                            UtilsService.hideLoading();
                                        });

                                });
                        });


                } else {
//                    alert(obj.msg);
                }
            }).catch(function (err) {
                console.log(err);
            });
        };
        $scope.getAccountById();

        //根据省份获取城市
        $scope.getCitys = function () {
            $scope.AccountTouchCitys = [];
            if ($scope.AccountTouchCitys_1 && $scope.AccountTouchCitys_1.length > 0) {
                $scope.AccountTouchCitys_1.forEach(function (t) {
                    if (String(t.value).substr(0, 3) === String($scope.user.accountTouchProvince).substr(0, 3)) {
                        $scope.AccountTouchCitys.push({
                            "value": t.value,
                            "text": t.text
                        });
                    }
                });
            }
        };

        $scope.cancelModify = function () {
//            $scope.getAccountById();
            $scope.show = false;
        };
        $scope.cancelModifyDegree = function () {
//            $scope.getAccountById();
            $scope.show_1 = false;
        };
        $scope.cancelModifyIncome = function () {
//            $scope.getAccountById();
            $scope.show_2 = false;
        };

        $scope.editProAndCity = function () {
            $scope.show = !$scope.show;
//            $scope.getAccountById();
        };

        $scope.editEducationDegree = function () {
            $scope.show_1 = !$scope.show_1;
//            $scope.getAccountById();
        };
        $scope.editIncome = function () {
            $scope.show_2 = !$scope.show_2;
//            $scope.getAccountById();
        };

        //根据省份获取城市
        /*  $scope.getCitys = function (data) {
         $scope.province = data;
         $scope.AccountTouchCitys = [];
         if($scope.AccountTouchCitys_1&&$scope.AccountTouchCitys_1.length>0){
         $scope.AccountTouchCitys_1.forEach(function (t) {
         if (String(t.value).substr(0, 3) === String(data).substr(0, 3)) {
         $scope.AccountTouchCitys.push({
         "value": t.value,
         "text": t.text
         });
         }
         });
         }

         //            var selected = $filter('filter')($scope.AccountTouchProvinces, {value: data});
         //            return ($scope.user.accountTouchProvince && selected.length) ? selected[0].text : '暂无';
         };*/


        $scope.getCity = function (data) {
//            var selected = $filter('filter')($scope.AccountTouchCitys_1, {value: data});
//            $scope.user.accountTouchCity= ($scope.user.accountTouchCity && selected.length) ? selected[0].text : '暂无';
        };

        $scope.modifyProvinceAndCity = function () {
            var x = $scope.user.accountTouchProvince;
            var y = $scope.user.accountTouchCity;
            var selected_x = $filter('filter')($scope.AccountTouchProvinces, {value: x});
            if (x) {
                if (selected_x[0].addressLevel === 1) {
                    if (String(x).substr(0, 3) === String(y).substr(0, 3)) {
                        //todo  invoke save webservice
                        $scope.invokeAccountModify(x, y);
                    } else {
                        alert("请选择所在市");
                    }
                } else if (selected_x[0].addressLevel === 2) {
                    y = "";
                    $scope.invokeAccountModify(x, y);
                }

            } else {
//                alert("请选择所在省");
                $scope.invokeAccountModify("", "");
            }
        };

        //should be invoke by modify province and city
        $scope.invokeAccountModify = function (x, y) {
            return AccountService.modifyProvinceAndCity(String(x), String(y)).then(function (obj) {
                if (obj.status === '000') {
                    //修改成功把value转换为text 显示在文本框中
//                    var selected = $filter('filter')($scope.AccountTouchCitys_1, {value: y});
//                    $scope.user.accountTouchCity = ($scope.user.accountTouchCity && selected.length) ? selected[0].text : '暂无';
//                    var selected1 = $filter('filter')($scope.AccountTouchProvinces, {value: x});
//                    $scope.user.accountTouchProvince = ($scope.user.accountTouchProvince && selected1.length) ? selected1[0].text : '';
                    $scope.getAccountById();
                    $scope.show = false;
                } else {
                    alert(obj.msg);
                }
            }).catch(function (err) {
                console.log(err);
            });
        };

        $scope.modifyEducationDegree = function () {
            UtilsService.showLoading();
            if(String($scope.user.educationDegree).length>1){
                $scope.user.educationDegree='0';
            }
            var promise = AccountService.modifyEducationDegree(String($scope.user.educationDegree));
            promise.then(function (obj) {//resolve
                if (obj && obj.status === '000') {//modify success
                    //todo
                    var selected = $filter('filter')($scope.statuses, {value: String($scope.user.educationDegree)});
                    $scope.user.educationDegree = (String($scope.user.educationDegree) && selected.length) ? selected[0].text : '暂无';
//                    $scope.getAccountById();
                    $scope.show_1 = false;
                } else if (obj && obj.status === '233') {//modify failed
                    alert(obj.msg);
                } else {
                    alert(obj.msg);
                }
            }).finally(function(){
                UtilsService.hideLoading();
            }).catch(function (err) {
                console.log(err);
            });
        };

        $scope.modifyIncome = function () {
            UtilsService.showLoading();
            if(String($scope.user.income).length>1){
                $scope.user.income='0';
            }
            var promise = AccountService.modifyIncome(String($scope.user.income));
            promise.then(function (obj) {//resolve
                if (obj && obj.status === '000') {//modify success
                    //todo
                    var selected = $filter('filter')($scope.incomes, {value: String($scope.user.income)});
                    $scope.user.income = (String($scope.user.income) && selected.length) ? selected[0].text : '暂无';
                    $scope.show_2 = false;
                } else if (obj && obj.status === '234') {//modify failed
                    alert(obj.msg);
                } else {
                    alert(obj.msg);
                }
            }).finally(function(){
                UtilsService.hideLoading();
            }).catch(function (err) {
                console.log(err);
            });
        };


        $scope.$watch("user.accountIndustry", function (newValue, oldValue) {
            if (!oldValue) {
                oldValue = '暂无';
            }
            if ( oldValue && (newValue !== oldValue)) {
                var promise = AccountService.modifyIndustry(newValue);
                promise.then(function (obj) {//resolve
                    if (obj && obj.status === '000') {//modify success
                        //todo
                    } else if (obj && obj.status === '235') {//modify failed
                        alert(obj.msg);
                        $scope.user.accountIndustry = oldValue;
                    }
                }).catch(function (err) {
                    console.log(err);
                    $scope.user.accountIndustry = oldValue;
                });
            }
        }, true);

        $scope.$watch("user.accountAddress", function (newValue, oldValue) {
            if (!oldValue) {
                oldValue = '暂无';
            }
            if ( oldValue && (newValue !== oldValue)) {
                var promise = AccountService.modifyAddress(newValue);
                promise.then(function (obj) {//resolve
                    if (obj && obj.status === '000') {//modify success
                        //todo
                    } else if (obj && obj.status === '232') {//modify failed
                        alert(obj.msg);
                        $scope.user.accountAddress = oldValue;
                    }
                }).catch(function (err) {
                    console.log(err);
                    $scope.user.accountAddress = oldValue;
                });
            }
        }, true);

        $scope.checkPasswordSecurity = function (safety) {
            var levels = ["1", "2", "3"];
            if (safety) {
                if (safety === 3) {
                    levels = [
                        "normalGreenBg1",
                        "normalGreenBg2",
                        "normalGreenBg3"
                    ];
                } else if (safety === 2) {
                    levels = [
                        "normalOrangeBg1",
                        "normalOrangeBg2",
                        "3"
                    ];

                } else if (safety === 1) {
                    levels = [
                        "normalRedBg",
                        "2",
                        "3"
                    ];
                }
            }
            $scope.levels = levels;
        };


//
//        UtilsService.cache("thirdAccount").then(function (thirdAccount) {
//            $scope.thirdAccount = thirdAccount;
//        }).catch(function (err) {
//            console.log(err);
//        });


    });
