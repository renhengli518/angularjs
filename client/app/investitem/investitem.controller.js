'use strict';

angular.module('p2pClientApp')
    .controller('InvestitemCtrl', function ($scope, $stateParams, $filter, $interval, InvestService, ngTableParams, AccountService, CapitalService,$sessionStorage,
                                            CMSService, DateTimeService, ConstantService, $location) {
        $scope.hidetab = true;
        AccountService.checkLoginStatus()
            .then(function () {
                $scope.login = true;
                return AccountService.getAccountById().then(function (data) {
                    if (data && data.status === '000' && data.data) {
                        var account = data.data;
                        $scope.username_1 = account.userName;
                        // console.log($scope.username_1+'-----------------dd----------------')
                    }
                });
            })
            .finally(function () {

                // 获取商品详情 及 贷款人详情
                AccountService.getInvestItem($stateParams.id)
                    .then(function (results) {
                        if(results.data == ''){
                            window.location.href = ConstantService.APIUrl() + '/#/error';
                            return false;
                        }
                        CMSService.showLoading();
                        afterReady();

                        results.data.forEach(function (r) {
                            //向下取整。 99.5 == 99
                            r.investment.investmentProgress = Math.floor(r.investment.investmentProgress * 100);
                            r.investment.progressStyle = {"width": r.investment.investmentProgress + "%"};
                            r.investment.progressLeft = {"margin-left": (r.investment.investmentProgress - 10) + "%"};
                        });
                        $scope.product = results.data[0].investment;
                        // 标的上线时间
                        $scope.product.investmentStartDate = DateTimeService.getTzfmtTime(new Date($scope.product.investmentStartDate), "yyyy/MM/dd");
                        $scope.product.investmentCreditDate = DateTimeService.getTzfmtTime(new Date($scope.product.investmentCreditDate), "yyyy.MM.dd");
                        $scope.riskBackCapital = results.data[0].riskBackCapital; //风险备用金

                        $scope.user = results.data[0].account;
                        if ($scope.login) {
                            // $scope.user = results.data[0].account;
                            _getUserAge();
                        }
                        $scope.investmentOverDate = DateTimeService.getTzfmtTime(new Date($scope.product.investmentOverDate), "yyyy.MM.dd");//结清日
                        //to confirm
                        if (isNaN($scope.product.investmentStatus)) {
                            $scope.investStatus = $scope.product.investmentStatusKey; // 标的状态
                        } else {
                            $scope.investStatus = $scope.product.investmentStatus; // 标的状态
                        }

                        console.log('标的id；' + $stateParams.id);
                        console.log('标的product；');
                        console.log($scope.product);
                        console.log('项目状态：' + $scope.investStatus);
                        // console.log($scope.investStatus);

                        _get();

                        console.log('商品详情');
                        console.log($scope.product);
                        console.log('用户详情：-----------')
                        console.log($scope.user);
                        _showLatestTime($scope.product.investmentEndDate);
                        $interval(function () {
                            _showLatestTime($scope.product.investmentEndDate);
                        }, 1000 * 30);
                    })
                    .catch(function (err) {
                        console.error(err);
                    });
                    CMSService.hideLoading();
            })
            .catch(function (err) {
                $scope.login = false;
            })


        // tab处理,默认详情页
        $scope.selection = 'tab1';
        $scope.totalData = {};
        $scope.sumHasInvested = 0; //投资用户已投资项目数量
        $scope.chkHasInvested = false; //投资用户是否已投资过该项目
        $scope.investStatus;

        $scope.$watch("selection", function (newV, oldV) {
            if (newV && oldV && (newV !== oldV)) {
                _reloadTableParams();
            }
        });

        var _reloadTableParams = function () {
            var newValue = $scope.selection;
            if (newValue === "tRecord") {
                $scope.tRecordTableParams.reload();
            } else if (newValue === "planNf") {
                $scope.planNfTableParams.reload();
            } else if (newValue === "planF") {
                $scope.planFTableParams.reload();
            } else if (newValue === "creditor") {
                $scope.creditorTableParams.reload();
            }
            CMSService.hideLoading();
            $scope.hidetab = false;
        }

        var _getVestAmtj = function (val) {
            if ("" === val) {
                return 0;
            } else {
                return val;
            }
        }

        // 投标记录
        $scope.tRecordTableParams = new ngTableParams(
            {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    'accountOrder.tradeDate': 'desc'
                }
            }, {
                total: 0,           // length of data
                getData: function ($defer, params) {
                    var selectTab = $scope.selection;
                    var data = $scope.totalData[selectTab];
                    console.log('投标tab记录');
                    console.log(data);
                    if (data) {
                        var data = params.sorting() ?
                            $filter('orderBy')(data, params.orderBy()) :
                            data;
                        params.total(data.length);
                        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            });

        //债权信息
        $scope.creditorTableParams = new ngTableParams(
            {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    'number': 'asc'
                }
            }, {
                total: 0,           // length of data
                getData: function ($defer, params) {
                    var selectTab = $scope.selection;
                    var data = $scope.totalData[selectTab];
                    console.log('债权tab记录');
                    console.log(data);
                    if (data) {
                        var data = params.sorting() ?
                            $filter('orderBy')(data, params.orderBy()) :
                            data;
                        params.total(data.length);
                        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            });

        //还款计划（非 已满标、招标中），还款计划（已满标、招标中）
        $scope.planNfTableParams = $scope.planFTableParams = new ngTableParams(
            {
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    'claimPayPlan.claimPayPlanNumber': 'asc'
                }
            }, {
                total: 0,           // length of data
                getData: function ($defer, params) {
                    var selectTab = $scope.selection;
                    var data = $scope.totalData[selectTab];
                    console.log('还款计划tab记录');
                    console.log(data);
                    if (data) {
                        var data = params.sorting() ?
                            $filter('orderBy')(data, params.orderBy()) :
                            data;
                        params.total(data.length);
                        $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                }
            });


        // 初始化tab数据
        var _get = function () {
            return AccountService.myInvestTabs($stateParams.id, $scope.username_1)
                .then(function (obj) {
                    $scope.totalData = obj;
                    console.log('totalData记录 sumHasInvested已投资项目的数量，chkHasInvested是否已投资过该项目，sumInvestmentAmt已投资过该项目的金额');
                    console.log($scope.totalData);
                    $scope.sumHasInvested = obj.sumHasInvested; // 已投资项目的数量
                    $scope.chkHasInvested = obj.chkHasInvested; // 是否已投资过该项目
                    $scope.sumHasInvestedAmt = obj.sumInvestmentAmt; // 已投资过该项目的金额
                    $scope.nextPaidDate = obj.nextPaidDate; // 下期还款日（已放款时）
                    $scope.payedPeriod = obj.payedPeriod; // 已还期数（已放款时）
                   // $scope.investmentOverDate = obj.investmentOverDate;//结清日

                    //显示新手提示: 从未投资过，已登录用户，未点击过提示
                    if($scope.sumHasInvested < 1 && !$sessionStorage.mindClick && $scope.login){
                        $('.investDes').attr('style', 'display:block');
                    }

                    // 非(已满标、招标中)的
                    if ($scope.totalData.planStatus == '1') {
                        if ($scope.chkHasInvested) {
                            // 用户投资过 显示 非(已满标、招标中)的 （planF数据）
                            $('#planNf').attr({
                                'hidden': true
                            });
                            $('#planF').attr({
                                'hidden': false
                            });
                        } else {
                            // 用户未投资过 显示 已满标、招标中的 （planNf数据）
                            $('#planNf').attr({
                                'hidden': false
                            });
                            $('#planF').attr({
                                'hidden': true
                            });
                        }
                    } else if ($scope.totalData.planStatus == '0') {
                        // 显示 已满标、招标中的 （planNf数据）
                        $('#planNf').attr({
                            'hidden': false
                        });
                        $('#planF').attr({
                            'hidden': true
                        });
                    }

                    // 项目该投资人投资过、且已放款时，显示债权信息
                    var arr = [7, 8, 9, 10, 11, 15, 17, 18, 21];
                    var showCredit = false;
                    for (var i in arr) {
                        if ($scope.investStatus === arr[i]) {
                            showCredit = true;
                            break;
                        }
                    }
                    ;
                    console.log('_get方法加载,showCredit:' + showCredit)
                    if (showCredit && $scope.chkHasInvested) {
                        $('#creditor').attr('hidden', false);
                    } else {
                        $('#creditor').attr('hidden', true);
                    }

                    // 改变收益计算栏显示样式
                    // 已满标样式：已满标6（已满标） 13（满标放款中） 14（满标放款失败）
                    if (6 === $scope.investStatus || 13 === $scope.investStatus || 14 === $scope.investStatus) {
                        $('.pa.calculateBox').addClass('fullBox');
                        $('.fullIcon').html('已满标');
                        $scope.showGetAmt = false;
                        // 已流标样式：16（已流标）5（流标中）
                    } else if (16 === $scope.investStatus || 5 === $scope.investStatus) {
                        $('.pa.calculateBox').addClass('fullBox');
                        $('.fullIcon').html('已流标');
                        $scope.showGetAmt = false;
                    } else {
                        $('.pa.calculateBox').removeClass('fullBox');
                        $('.fullIcon').html('');
                        $scope.showGetAmt = true;
                    }

                    // 交易成功样式：（还款中）
                    if (15 === $scope.investStatus || 18 === $scope.investStatus || 19 === $scope.investStatus || 20 === $scope.investStatus || 21 === $scope.investStatus) {
                        $('.pa.calculateBox').attr('style', 'display:none');
                        $('.pa.calculateBox.transaction').attr('style', 'display:block');
                        $('#transactionIconText').html('交易成功');
                        $('#nextPaidText').html('下期还款日');
                        $('#sumHasInvestedAmt').html($scope.sumHasInvestedAmt);
                        $('#investmentCreditDate').html($scope.product.investmentCreditDate);
                        $('#nextPaidDate').html($scope.nextPaidDate);
                        $('#payedPeriod').html($scope.payedPeriod);
                    } else if (7 === $scope.investStatus) {
                        $('.pa.calculateBox').attr('style', 'display:none');
                        $('.pa.calculateBox.transaction').attr('style', 'display:block');
                        $('#transactionIconText').html('已结清');
                        $('#nextPaidText').html('结清日期');
                        $('#sumHasInvestedAmt').html($scope.sumHasInvestedAmt);
                        $('#investmentCreditDate').html($scope.product.investmentCreditDate);
                        $('#nextPaidDate').html($scope.investmentOverDate);
                        $('#payedPeriod').html($scope.payedPeriod);
                    }else {
                        $('.pa.calculateBox').attr('style', 'display:block');
                        $('.pa.calculateBox.transaction').attr('style', 'display:none');
                    }

                    // 已满标、已流标,禁用操作
                    if ($('.calculateBox').hasClass('fullBox')) {
                        $('#vestAmt').attr('disabled', true);
                        $('#chkBtn').attr('disabled', true);
                    }

                    _reloadTableParams();
                    // CMSService.hideLoading();
                });
        }


        // 获取用户资金信息
        $scope.getUserCapitalInfo = function () {
            CapitalService.queryCapitalInfo().then(function (rs) {
                if (rs.status === "000") {
                    var data = rs.data;
                    $scope.availableBalance = data.availableBalance;

                    _changeShow(false);
                } else if (rs.status === "491") {
                    console.log("用户未开通第三方账户")
                    _changeShow(true);
                } else {
                    console.err("获取用户资金信息失败：" + rs.msg);
                }
            })
        };


        // 显示开户或充值
        function _changeShow(booShow) {
            $('#actAmt').attr('hidden', booShow);
            $('#actAmt').next().attr('hidden', booShow);
            $('#actAmt').next().next().attr('hidden', booShow);
            $('#txtOpen').attr('hidden', !booShow);
            $('#txtOpen').next().attr('hidden', !booShow);
            $scope.hasOpen = !booShow;
        }

        // 立即投资按钮
        $('#chkBtn').bind('click', function () {
            var flag = $('#chkBtn').is(':checked');
            $('#vestBtn').attr('disabled', !flag);
            if (flag) {
                $('#vestBtn').removeClass('btnDisabled')
            } else {
                $('#vestBtn').addClass('btnDisabled');
            }
        });

        $scope.openAccount = function () {
            // 开户接口
            var url = '/acct/postnroute?jsonStr={"url":"-channelPay-registerparam"}';
            window.open(ConstantService.RouteUrl() + url);
        }

        // 计算收益
        $scope.calculateAmt = function () {
            var vestAmt = parseFloat(_getVestAmtj($('#vestAmt').val()));
            var actAmt = parseFloat($('#actAmt').text().replace(new RegExp(',', 'g'),''));
            if (vestAmt > actAmt && $scope.login) {
                $('#errMsg').html('投资金额不能大于账户金额');
                $('.msgError').attr('style', 'display:block');
                return false;
            } else if (vestAmt <= 0) {
                $('#errMsg').html('请输入正确的投资金额');
                $('.msgError').attr('style', 'display:block');
                return false;
            } else {
                $('.msgError').removeAttr('style');
            }
            var yearRate = parseFloat($('#yearRate').html()) / 100;
            InvestService.capitalMath(vestAmt, $('#period').html(), yearRate).then(function (obj) {
                if (obj && obj.status === "000") {
                    // console.log(obj.data);
                    $scope.firstPeriods = obj.data.firstPeriods;
                    $scope.totalPeriods = obj.data.totalPeriods - vestAmt;
                }
            }, function (err) {
                console.log(err);
            }).catch(function (err) {
                console.error(err);
            });
        }

        $scope.addAmt = function () {
            if ($('.calculateBox').hasClass('fullBox')) {
                return false;
            }
            var vestAmt = parseFloat(_getVestAmtj($('#vestAmt').val()));
            // var restAmt = parseFloat($('#restAmt').text());
            var actAmt = parseFloat($('#actAmt').text().replace(new RegExp(',', 'g'),''));
            var leftAmt = parseFloat($('#leftAmount').html().replace(new RegExp(',', 'g'),''));
            //用户已登录 且 已开通第3方资金账户
            if ($scope.login && $scope.hasOpen) {
                // 账户钱大于 剩余金额
                if (actAmt > leftAmt) {
                    if ((vestAmt + 50) < leftAmt) {
                        $('#vestAmt').val(vestAmt + 50);
                    } else {
                        $('#vestAmt').val(leftAmt);
                    }
                } else {
                    if ((vestAmt + 50) < actAmt) {
                        $('#vestAmt').val(vestAmt + 50);
                    } else {
                        $('#vestAmt').val(actAmt);
                    }
                }
            } else {
                //用户未登陆 或者 未开通 第3方资金账户
                if ((vestAmt + 50) < leftAmt) {
                    $('#vestAmt').val(vestAmt + 50);
                } else {
                    $('#vestAmt').val(leftAmt);
                }
            }
            $scope.vestAmtBlur();
        };

        $scope.minusAmt = function () {
            if ($('.calculateBox').hasClass('fullBox')) {
                return false;
            }
            var vestAmt = parseFloat(_getVestAmtj($('#vestAmt').val()));
            var actAmt = parseFloat($('#actAmt').text().replace(new RegExp(',', 'g'),''));
            var leftAmt = parseFloat($('#leftAmount').html().replace(new RegExp(',', 'g'),''));
            if ((vestAmt - 50) > 0) {
                $('#vestAmt').val(vestAmt - 50);
            } else {
                $('#vestAmt').val(0);
            }
            $scope.vestAmtBlur();
        };

        $scope.mindClick = function () {
            $('.investDes').hide();
            $sessionStorage.mindClick = true;
        };

        // 手动投资方法
        $scope.vestNow = function () {

            if (AccountService.isLogin()) {

                // if(!$scope.vestAmtBlur()) return;

                if (!$scope.hasOpen) {
                    $('#errMsg').html('您还未开通第三方账户，请先去开通');
                    $('.msgError').attr('style', 'display:block');
                    return false;
                }

                var seq = $stateParams.id;
                var amt = parseFloat(_getVestAmtj($('#vestAmt').val()));

                if (undefined === $('.msgError').attr('style') && 0 != amt) { // 正确金额
                    // return true;
                } else {
                    $('#errMsg').html('请输入正确金额');
                    $('.msgError').attr('style', 'display:block');
                    return false;
                }


                InvestService.manualInvestChk(seq, amt).then(function (obj) {
                    if (obj && obj.status === "000") {
                        // 手动投资接口
                        var url = '/acct/postnroute?jsonStr={"url":"-channelPay-getInitiativeTender","param":{"investmentSequence":"';
                        url = url + seq + '","amount":"';
                        url = url + amt + '"}}';
                        // window.open(ConstantService.RouteUrl() + url);
                        // window.location.reload();
                        window.location.href = ConstantService.RouteUrl() + url;
                    } else if (obj && obj.status === "300") {
                        // 第三方账户未开
                        alert('您还未开通第三方账户，请先去开通');
                    } else if (obj && obj.status === "301") {
                        // 余额不足，需要充值
                        alert('余额不足，需要充值');
                    } else {
                        alert(obj.msg);
                    }

                }, function (err) {
                    console.log(err);
                }).catch(function (err) {
                    console.error(err);
                });
            } else {
                $('.autoMsg').attr('style', 'display:block'); 
            }

        };


        // 项目倒计时
        var _showLatestTime = function (date) {
            var countDown = DateTimeService.countDown(date);
            // console.log(countDown);
            // 只有招标中的 剩余时间显示
            if (parseInt(countDown.date.days) < 0 || (5 != $scope.investStatus && 12 != $scope.investStatus)) {
                $('#day').text(0);
                $('#hour').text(0);
                $('#minute').text(0);
            } else {
                $('#day').text(_fill(countDown.date.days));
                $('#hour').text(_fill(countDown.date.hours));
                $('#minute').text(_fill(countDown.date.minutes));
            }

            // $('#second').text(countDown.date.seconds);
        }

        var _fill = function (n) {
            n += "";
            if (n.length === 1) {
                n = "0" + n;
            }
            return n;
        }

        //
        var _getUserAge = function () {
            var birthYmd = $scope.user.pid.substr(6, 8);
            var sysYmd = DateTimeService.getTzfmtTime(new Date(), "yyyyMMdd");
            var year = sysYmd.substr(0, 4) - birthYmd.substr(0, 4);
            $scope.user.age = year;
            /*if(parseInt(birthYmd.substr(4)) > parseInt(sysYmd.substr(4))){
             $scope.user.age = year-1;
             }else{
             $scope.user.age = year;
             }*/

            // 工作年限 月to年
            var m = $scope.user.workTime;
            if (!isNaN(m)) {
                var y = 0;
                var restM = 0;
                if (m > Math.round(m / 12) * 12) {
                    restM = m - Math.round(m / 12) * 12;
                    if (Math.round(m / 12) != 0) {
                        $scope.user.workTime = Math.round(m / 12) + '年' + restM + '月';
                    } else {
                        $scope.user.workTime = restM + '月';
                    }
                } else if (m == Math.round(m / 12) * 12) {
                    $scope.user.workTime = Math.round(m / 12) + '年';
                } else {
                    y = Math.round(m / 12) - 1;
                    restM = m - Math.round(y) * 12;
                    if (y != 0) {
                        $scope.user.workTime = y + '年' + restM + '月';
                    } else {
                        $scope.user.workTime = restM + '月';
                    }
                }
            }


            /*restM = m - Math.round(m/12)*12;
             if(0 != restM){
             $scope.user.workTime = Math.round(m/12)+'年'+restM+'月';
             }else{
             $scope.user.workTime = Math.round(m/12)+'年';
             }*/
        }

        // event end

        $scope.vestAmtBlur = function () {

            //雪妍确认需求：begin
            // 用户未登录 ，要计算预期金额 每月还款额；
            // 用户登录了，但未开通第3方，不要计算 预期金额和还款额;
            // 用户登录了，且开通第3方了，要计算。。
            if(!$scope.login){
                $('#errMsg').html('您还未登录，请先登录');
                $('.msgError').attr('style', 'display:block');
                return false;
            }
            if (!$scope.hasOpen) {
                $('#errMsg').html('您还未开通第三方账户，请先去开通');
                $('.msgError').attr('style', 'display:block');
                return false;
            }

            //雪妍确认需求：end

            // 输入数字
            var v = $('#vestAmt').val();
            if ('' === v) {
                $scope.firstPeriods = 0;
                $scope.totalPeriods = 0;
                $('.msgError').removeAttr('style');
                return false;
            }
            //判断是否为数字
            if (isNaN(v)) {
                v = '';
            } else {
                //是否为整型
                if (parseInt(v) != Number(v)) {
                    v = parseInt(v);
                }
            }

            // v = v.replace(/[^\d]/g,'');
            if (v === '') {
                $('#vestAmt').val(0);
            } else {
                $('#vestAmt').val(v);
            }

            var leftAmt = parseFloat($('#leftAmount').html().replace(new RegExp(',', 'g'),''));
            var vestAmt = parseFloat($('#vestAmt').val());
            var actAmt = parseFloat($('#actAmt').text().replace(new RegExp(',', 'g'),''));
            var totalAmt = parseFloat($('#totalAmt').html().replace(new RegExp(',', 'g'),'')); //总金额
            if (vestAmt < 50) {
                $('#errMsg').html('投资金额不能小于50元');
                $('.msgError').attr('style', 'display:block');
                return false;
            }

            if (vestAmt % 50 != 0) {
                $('#errMsg').html('投资金额必须等于50的整数倍');
                $('.msgError').attr('style', 'display:block');
                return false;
            } else {
                $('.msgError').removeAttr('style');
            }

            if (vestAmt > actAmt && $scope.login) {
                $('#errMsg').html('投资金额不能大于账户余额，请先去充值');
                $('.msgError').attr('style', 'display:block');
                return false;
            } else if (vestAmt < 0) {
                $('#errMsg').html('请输入正确的投资金额');
                $('.msgError').attr('style', 'display:block');
                return false;
            } else if (vestAmt > leftAmt) {
                $('#errMsg').html('投资金额超过项目剩余金额，请刷新页面后重新输入');
                $('.msgError').attr('style', 'display:block');
                return false;
            } else {
                $('.msgError').removeAttr('style');
            }

            var sumHasInvested = $scope.sumHasInvested;
            var sumHasInvestedAmt = $scope.sumHasInvestedAmt;
            // 没投资过 或者 投资了5个以内项目
            // if(!sumHasInvested || (sumHasInvested && sumHasInvested < 6)){
            // 投资了5个以内项目,且已登陆
            if ($scope.login && sumHasInvested < 5) {
                if (vestAmt > totalAmt * 0.05) {
                    $('#errMsg').html('投资人注册后前5个投资的项目，投资金额不得超过所投资标的总借款金额的5%。');
                    $('.msgError').attr('style', 'display:block');
                    return false;
                } else if ((sumHasInvestedAmt + vestAmt) > totalAmt * 0.05) {
                    $('#errMsg').html('同一个投资人重复投资时，投资同一个项目累加金额不得超过5%');
                    $('.msgError').attr('style', 'display:block');
                    return false;
                } else {
                    $('.msgError').removeAttr('style');
                }
            }
            $scope.calculateAmt();
        }

        var afterReady = function () {
            $scope.firstPeriods = 0;
            $scope.totalPeriods = 0;

            if ($scope.login) {
                $scope.getUserCapitalInfo();
                $('#notLoginAmt').attr('hidden', true);
            } else {
                $('#creditor').attr('hidden', true);

                // 未登录 tab显示信息
                $('.itemBox').html('');
                $('.itemBox').html($('#notLogin').html());

                // 未登录 显示：登录链接
                $('#notLoginAmt').attr('hidden', false);

                // 未登录 隐藏 账户信息
                $('#actAmt').attr('hidden', true);
                $('#actAmt').next().attr('hidden', true);
                $('#actAmt').next().next().attr('hidden', true);
            }
        }

        $scope.selectionC = 'incomeCal';
        $scope.calculatorBox = function () {
            if ($('.calculateBox').hasClass('fullBox')) {
                return false;
            }
            // $('#calculator_pop').addInteractivePop({magTitle: '', mark :true,drag: true, position:"fixed"});
            $('#calculator_pop').addInteractivePop({magTitle: '', mark: true, drag: false, position: "fixed"});
        }

    });
