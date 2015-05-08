'use strict';
function messageFn(a) {
    var _next = $(a).parent('tr').siblings();
    if (_next.length) {
        if (_next.is(':visible')) {
            _next.fadeOut("slow");
        } else {
            _next.fadeIn("slow");
            $(a).parent('tr').addClass("noRead");
        }
    }
}
angular.module('p2pClientApp')
    .controller('AccountMessageCtrl', function ($rootScope, $scope, AccountService, AccountMessageService, CMSService, _, $filter, ngTableParams, UtilsService, $state, $stateParams) {
        $scope.today = new Date();
        //  $scope.startdate = new Date("2015-03-01");
        // $scope.enddate = new Date();


        //20150313 chenchang
        $scope.selection = [];
        $scope.filterChange = false;
        $scope.filterMsgCount = 0;

        $scope.toggleSelectAllMsg = function (isSelected) {
            $scope.selection.length = 0;
            var checkboxList = $("input[type='checkbox']");

            if (isSelected == false) {
                for (var i = 0; i < checkboxList.length; i++) {
                    if(checkboxList[i].value!="on"){
                        $scope.selection.push(checkboxList[i].value);
                    }
                }
            } else {
                $scope.checkAll = false;
                for (var i = 0; i < checkboxList.length; i++) {
                    checkboxList[i].checked = false;
                }
            }
            console.log("isSelected:" + isSelected);
            console.log($scope.selection);
        };

        // toggle selection for a given msgId
        $scope.toggleSelection = function toggleSelection(msgId) {
            var idx = $scope.selection.indexOf(msgId);
            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.selection.push(msgId);
            }
            console.log($scope.selection);
        };

        $scope.updateAccountMessagesRead = function () {
            AccountMessageService.updateAccountMessagesRead($scope.selection)
                .finally(function () {
                    $scope.tableParams.reload();
                    $rootScope.refreshUnReadMail();
                });
        };

        $scope.confirmDeleteAccountMessageAll = function () {
            $('#clear_pop').addInteractivePop({magTitle: '提示', mark: true, drag: false, position: "fixed"});
        };

        $scope.deleteAccountMessageAll = function () {
            AccountMessageService.deleteAccountMessageAll()
                .finally(function () {
                    $scope.tableParams.reload();
                    $rootScope.refreshUnReadMail();
					$(".p2p_maskLayer").remove();
					$(".publicPop").hide();
                });
        };
		$scope.deleteCancel = function(){
			$(".p2p_maskLayer").remove();
			$(".publicPop").hide();
		};

        $scope.deleteAccountMessages = function () {
            AccountMessageService.deleteAccountMessages($scope.selection)
                .finally(function () {
                    $scope.tableParams.reload();
                    $rootScope.refreshUnReadMail();
                });
        };
        //20150313 chenchang end

        $scope.readMsg = function (msgId, messageReadStatus) {
            if (messageReadStatus == 1) {//1:消息未读取
                AccountMessageService.readMessage(msgId);
                $rootScope.refreshUnReadMail();
            }
        };

        $scope.statusChangeByValue = function (value) {
            value = parseInt(value);
            $scope.messageStatus = _.map($scope.messageStatus, function (t) {
                t.selected = t.value === value;
                //  console.log(t);
                return t;
            });
        };


        $scope.statusChange = function (name) {
            $scope.messageStatus = _.map($scope.messageStatus, function (t) {
                t.selected = t.name === name;
                return t;
            });
        };

        $scope.typeChange = function (name) {
            $scope.isClearDate = true;
            $scope.messageType = _.map($scope.messageType, function (t) {
                t.selected = (t.name === name);
                return t;
            });
            $scope.filterChange = true;
            $scope.tableParams.reload();
        };

        $scope.$watch("messageStatus", function () {
            $scope.isClearDate = true;
            $scope.filterChange = true;
            $scope.tableParams.reload();
        }, true);

        var _filter = function () {
            var temp = _.cloneDeep($scope.constantList);
            var status = _.find($scope.messageStatus, {"selected": true});
            if (temp && status && status.value >= 0) {
                temp = temp.filter(function (t) {
                    return t.messageReadStatus === status.value;
                })
            }
            var type = _.find($scope.messageType, {"selected": true});
            if (temp && type && type.name !== '全部') {
                temp = temp.filter(function (t) {
                    return _.contains(type.value, t.remindOptionForm);
                })
            }
            //$scope.messageList = temp;
            // $scope.tableParams.reload();
            return temp;
        }


        $scope.constantList = [];

        var _retrieve = function () {
            UtilsService.showLoading();
            //var startDate = $scope.startdate;

            if ($scope.isClearDate == true) {
                $scope.enddate = undefined;
                $scope.startdate = undefined;

                var start = $("#start");
                start.val("");
                var end = $("#end");
                end.val("");

                $scope.isClearDate = false;

            } else {
                $scope.enddate = $scope.enddate || undefined
                $scope.startdate = $scope.startdate || undefined
            }

            var startDate = "";
            if (typeof $scope.startdate === "object") {
                startDate = $scope.startdate.toUTCString();
            } else {
                startDate = $scope.startdate;
            }
            startDate = new Date(startDate);
            startDate.setHours(0, 0, 0);

            var enddate = "";
            if (typeof $scope.enddate === "object") {
                enddate = $scope.enddate.toUTCString();
            } else {
                enddate = $scope.enddate;
            }

            enddate = new Date(enddate);
            enddate.setDate(enddate.getDate() + 1);
            enddate.setHours(0, 0, 0);


            return AccountMessageService.accountMessageList(null, startDate, enddate)
                .then(function (res) {
                    $scope.constantList = res;
                    return _filter();
                })
                .catch(function (err) {
                    console.error(err);
                })
                .finally(function () {

                    UtilsService.hideLoading();
                });
        }

        //_retrieve();

        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: 0,           // length of data
            getData: function ($defer, params) {
                // var data = $scope.messageList;
                _retrieve()
                    .then(function (data) {
                        if (data) {
                            //var data = params.sorting() ?
                            //    $filter('orderBy')(data, params.orderBy()) :
                            //    data;
                            $scope.checkAll =false;
                            $scope.selection.length = 0;

                            params.total(data.length);
                            $scope.filterMsgCount = data.length;
                            // set new data
                            //    $defer.resolve(0, params.page() * params.count());

                            if ($scope.filterChange == true) {
                                params.page(1);
                                $scope.filterChange = false;
                            }
                            $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));


                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                    })

            }
        });


        $scope.messageStatus = [{
            "name": "全部",
            "value": -1,
            "selected": true
        }, {
            "name": "已读",
            "value": 0,
            "selected": false
        }, {
            "name": "未读",
            "value": 1,
            "selected": false
        }];

        $scope.messageType = [{
            "name": "全部",
            "value": "all",
            "selected": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
        }, {
            "name": "放款通知",
            "value": [1],
            "selected": false
        }, {
            "name": "流标通知",
            "value": [2],
            "selected": false
        }, {
            "name": "逾期通知",
            "value": [5],
            "selected": false
        }, {
            "name": "垫付通知",
            "value": [6],
            "selected": false
        }, {
            "name": "回购通知",
            "value": [7],
            "selected": false
        }, {
            "name": "红包通知",
            "value": [10],
            "selected": false
        }];

        //datepicker
        $scope.startDateOptions = {
            dateFormat: 'yy-mm-dd',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            onClose: function (selectedDate) {
                var end = $('#end');
                //var d = $('#start').datepicker("getDate");
                //end.datepicker("setDate", new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));
                end.datepicker("option", "minDate", selectedDate);
                //$scope.enddate = parseInt($scope.startdate) + 24 * 60 * 60 * 1000;
                $scope.startdate = new Date(selectedDate);
                $scope.tableParams.reload();
            }
        };
        $scope.endDateOptions = {
            dateFormat: 'yy-mm-dd',
            monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
                '七月', '八月', '九月', '十月', '十一月', '十二月'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
            dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
            onClose: function (selectedDate) {
                var start = $("#start");
                //if (start.val() == '') {
                //    var d = $('#end').datepicker("getDate");
                //    start.datepicker("setDate",
                //        new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
                //    $scope.startdate = parseInt($scope.enddate) - 24 * 60 * 60 * 1000;
                //}
                start.datepicker("option", "maxDate", selectedDate);
                $scope.enddate = new Date(selectedDate);
                $scope.tableParams.reload();
            }
        };

        if ($stateParams.messageStatusValue) {
            var messageStatusValue = $stateParams.messageStatusValue;
            //   console.log("messageStatusValue:" + messageStatusValue);
            if (messageStatusValue) {
                $scope.statusChangeByValue(messageStatusValue);
            }
        }


    })
    .filter(
    'to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }]
);
