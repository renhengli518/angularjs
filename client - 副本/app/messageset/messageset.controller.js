'use strict';

angular.module('p2pClientApp')
    .controller('MessagesetCtrl', function ($scope, AccountMessageService, CMSService, _) {
        var typeList = [
            {
                "title": "放款通知",
                "value": 1,
                "selected": false
            }, {
                "title": "流标通知",
                "value": 2,
                "selected": false
            }, {
                "title": "正常还款通知",
                "value": 3,
                "selected": false
            }, {
                "title": "逾期还款通知",
                "value": 4,
                "selected": false
            }, {
                "title": "逾期通知",
                "value": 5,
                "selected": false
            }, {
                "title": "垫付通知",
                "value": 6,
                "selected": false
            }, {
                "title": "回购通知",
                "value": 7,
                "selected": false
            }, {
                "title": "结清通知",
                "value": 8,
                "selected": false
            }, {
                "title": "债权转让通知",
                "value": 9,
                "selected": false
            }, {
                "title": "红包通知",
                "value": 10,
                "selected": false
            }
        ];
        CMSService.showLoading();
        AccountMessageService.getMessageSetting()
            .then(function (types) {
                if (types) {
                    var typeList1 = _.cloneDeep(typeList);
                    typeList1.forEach(function (item1) {
                        item1.selected = true;
                        types.forEach(function (item) {
                            //item1.selected = (item.systemRemindOptionSequence === item1.value && item.remindStatus);
                            if (item.systemRemindOptionSequence === item1.value) {
                                item1.selected = (item.remindStatus === 0 ? true : false);
                            }
                        });
                    });
                    $scope.list = typeList1;
                } else {
                    $scope.list = typeList;
                }
            })
            .catch(function (err) {
                console.log(err);
            })
            .finally(function () {
                CMSService.hideLoading();
            });

        $scope.updateSetting = function (type) {
            var remindStatus = type.selected ? 1 : 0;//must use it reversely, due to the ng-click will be triggered before the ng-model been filled
            CMSService.showLoading();
            AccountMessageService.updateMessageSetting(type.value, remindStatus)
                .catch(function (err) {
                    console.log(err);
                })
                .finally(function () {
                    CMSService.hideLoading();
                });
        }
    });
