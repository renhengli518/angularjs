'use strict';

angular.module('p2pClientApp')
    .factory('AccountMessageService', function (ConstantService, $resource, $q, ODataService) {
        var baseAPI = ConstantService.APIRoot();

        var _convert = function (item) {
            var defer = $q.defer();
            if (item.accountRemindSequence) {
                ODataService.dictionary("t_ropt", "ropt_type", item.remindOptionForm)
                    .then(function (v) {
                        item.remindOptionFormMap = v;
                        defer.resolve(item);
                    }).catch(function (err) {
                        console.log(err);
                        return item;
                    });
            } else {
                defer.resolve(item);
            }
            return defer.promise;
        }
        // Public API here
        return {
            accountMessageList: function (userId, dateFrom, dateTo) {
                return $resource(baseAPI + "/accountMessage/queryAccountMessageAllByUserIdDate", null, {
                    list: {
                        "method": "POST"
                    }
                }).list({
                    "userId": userId || 22222,
                    "beginDate": dateFrom.toString(),
                    "endDate": dateTo.toString()
                }).$promise
                    .then(function (d) {
                        if (d && d.status === '000') {
                            var array = [];
                            d.data.forEach(function (item) {
                                array.push(_convert(item));
                            });
                            return $q.all(array).then(function (list) {
                                return list;
                            });
                        } else {
                            return $q.reject(d.msg);
                        }
                    })
                    .catch(function (err) {
                        console.error(err);
                        return [];
                    })
            },
            updateAccountMessagesRead: function (accountMessageIds) {
                if (accountMessageIds) {
                    return $resource(baseAPI + "/accountMessage/updateAccountMessagesRead").save({
                        "accountMessages": accountMessageIds
                    }).$promise;
                }
            },
            deleteAccountMessages: function (accountMessageIds) {
                if (accountMessageIds) {
                    return $resource(baseAPI + "/accountMessage/deleteAccountMessages").save({
                        "accountMessages": accountMessageIds
                    }).$promise;
                }
            },
            deleteAccountMessageAll: function () {
                return $resource(baseAPI + "/accountMessage/deleteAccountMessageAll").get().$promise;
            },
            readMessage: function (messageId) {
                return $resource(baseAPI + "/accountMessage/queryAccountMessageOne").save({
                    "accountMessageId": messageId
                }).$promise;
            },
            accountMail: function () {
                var query = {};
                return $resource(baseAPI + "/accountMessage/queryAccountMessageCount4SiteMsg", null, {
                    "query": {
                        "method": "POST"
                    }
                }).query(query).$promise;
            },
            updateMessageSetting: function (systemRemindOptionSequence, remindStatus) {
                if (systemRemindOptionSequence && (remindStatus || remindStatus === 0)) {
                    return $resource(baseAPI + "/accountRemind/updateAccountRemindOne")
                        .save({
                            systemRemindOptionSequence: systemRemindOptionSequence,
                            remindStatus: remindStatus
                        }).$promise
                        .then(function (r) {
                            if (r && r.status === "000") {
                                return r.data;
                            } else {
                                return $q.reject(r.msg);
                            }
                        });
                } else {
                    return $q.reject("missed required fields");
                }
            },
            "getMessageSetting": function () {
                return $resource(baseAPI + "/accountRemind/queryAccountRemindByUserId").save({}).$promise
                    .then(function (r) {
                        if (r && r.status === "000") {
                            return r.data;
                        } else {
                            return $q.reject(r.msg);
                        }
                    });
            }
        };
    });
