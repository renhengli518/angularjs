'use strict';

angular.module('p2pClientApp')
    .factory('AccountService', function ($q, $http, ConstantService, DateTimeService, $rootScope, $sessionStorage, $localStorage, $resource, ODataService, $state, $location) {
        var baseAPI = ConstantService.APIRoot();
        var apiUrl = ConstantService.APIUrl();
        var map = {
            "dictionary": {
                "welfareSource": "taw_res", //福利来源
                "investmentStatus": "inv_stat", //项目状态
                "investmentPeriod": "inv_period", //期数
                "investmentGuaranteedInterestType": "inv_stype", //保额保息情况
                "investmentGuarantee": "inv_grt", //保障机构， todo 字典表暂无该字段，后续liuwei加
                "investmentAnnualInterestRate": "inv_irate", //年利率
                "investmentPayType": "inv_ptype", //还款方式
                "investmentType": "inv_type", //项目发布方式
                "investmentTarget": "inv_target", //项目用途.
                "accountInvestmentStatus": "act_inv_stat",
                "investmentLevel": "inv_lv" //项目信用等级
            }
        };
        var mapAccount = {
            "dictionary": {
                "marryStatus": "tac_mstat", //婚姻状况

                "gender": "tac_gender", //性别
                "educationDegree": "tac_edu_degree", //最高学历
                "companyProperty": "tac_cpt", //企业性质
                "companyInustry": "tac_cinds", //公司行业
                "income": "tac_income", //婚姻状况
                "companySize": "tac_csize", //公司规模
                "houseProperty": "tac_house", //房产情况
                "accountHouseLoan": "tac_house_loan", //房贷情况
                "loanType": "tac_ltype", //贷款人类型

                "pidCredibilityStatus": "tac_idcs", //身份证明状态
                "incomeCredibilityStatus": "tac_iccs", //收入证明状态
                "jobCredibilityStatus": "tac_jcs", //工作证明状态
                "addressCredibilityStatus": "tac_addcs" //住址证明状态
            },
            "area": {
                // "hometownCity": "tac_hcity", //所在地级市
                "hometownProvince": "tac_hprov", //户籍地所在省、直辖市
                "workCity": "tac_wcity" //工作所在地级市
            }
        }

        var viewHelper = {
            "investment": [{//t_dic inv_stat
                "name": "招标中",
                "values": [12]//招标中
            }, {
                "name": "已满标",
                "values": [6, 13, 14]//已满标，满标放款中，满标放款失败
            }, {
                "name": "已流标",
                "values": [16]//已流标
            }, {
                "name": "还款中",
                "values": [15, 18, 19, 20, 21]//满标放款成功，还款中，自动提现中，自动提现失败，自动提现成功
            }, {
                "name": "逾期",
                "values": [9, 10, 11, 17]//回购中，已回购，待回购，逾期
            }],
            "accountInvestment": [//t_dic act_inv_stat
                {
                    "name": "还款中",
                    "values": [1]//正常还款
                }, {
                    "name": "逾期",
                    "values": [15]//逾期
                }
            ]
        };

        function _getMask(username, userName_1) {
            if (username != userName_1) {
                var left = username.substring(0, 2);
                var right = username.substring(username.length - 2);
                var replaceStr = username.substring(2, username.length - 2);
                var mask = '';
                for (var i = 0; i < replaceStr.length; i++) {
                    mask += '*';
                }
                var rtn = left + mask + right;
                return rtn;
            } else {
                return username;
            }

        }

        function _getMapName(type, value, defaultV) {
            var t = null;
            var array = [];
            if (type === 0) {
                array = viewHelper.investment;
            } else if (type === 1) {
                array = viewHelper.accountInvestment;
            }
            if (array) {
                for (var i = 0; i < array.length; i++) {
                    if (_.contains(array[i].values, value)) {
                        t = array[i];
                        break;
                    }
                }
                return t ? t.name : defaultV;
            } else {
                return defaultV
            }

        }

        var _convert = function (item, tableName, mapName) {
            if ("t_act_wf" == tableName) {
                item.welfareExpiredDate = new Date(item.welfareExpiredDate);
            }
            if ("t_acct" == tableName) {
                item.pidCredibilityPassDate = DateTimeService.getTzfmtTime(new Date(item.pidCredibilityPassDate), "yyyy-MM-dd");
                item.incomeCredibilityPassDate = DateTimeService.getTzfmtTime(new Date(item.incomeCredibilityPassDate), "yyyy-MM-dd");
                item.jobCredibilityPassDate = DateTimeService.getTzfmtTime(new Date(item.jobCredibilityPassDate), "yyyy-MM-dd");
                item.addressCredibilityPassDate = DateTimeService.getTzfmtTime(new Date(item.addressCredibilityPassDate), "yyyy-MM-dd");
            }


            var promise = null;
            if (mapName.dictionary) {
                promise = ODataService.dictionary(tableName)
                    .then(function (dicTable) {
                        if (dicTable) {
                            Object.keys(item).forEach(function (key) {

                                var t = item[key];
                                if (t && typeof t === "object" && Object.keys(t).length > 0) {
                                    Object.keys(t).forEach(function (key1) {
                                        var field = mapName.dictionary[key1];
                                        if (field) {
                                            item[key][key1 + "Key"] = item[key][key1];
                                            item[key][key1] = dicTable.getValue(field, item[key][key1]) || item[key][key1];
                                        }
                                    })
                                } else {
                                    var field = mapName.dictionary[key];
                                    if (field) {
                                        item[key + "Key"] = item[key];
                                        item[key] = dicTable.getValue(field, item[key]);
                                    }
                                }

                            });
                        }

                        if (item.AccountInvestment) {
                            console.log(1);
                        }

                        return item;
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
                    .finally(function () {
                        return item;
                    })
            }

            if (mapName.area) {
                promise = ODataService.area()
                    .then(function (dicTable) {
                        if (dicTable) {
                            Object.keys(item).forEach(function (key) {
                                var field = mapName.area[key];
                                if (field) {
                                    item[key + "Key"] = item[key];
                                    item[key] = dicTable[item[key]];
                                }
                            });
                        }
                        return item;
                    })
                    .catch(function (err) {
                        console.log(err);
                    })
                    .finally(function () {
                        return item;
                    })
            }

            promise = promise.then(function (item) {
                if (item.Investment && item.Investment.investmentStatusKey) {
                    item.Investment.investmentStatus = _getMapName(0, item.Investment.investmentStatusKey, item.Investment.investmentStatus);
                }
                if (item.AccountInvestment && item.AccountInvestment.accountInvestmentStatusKey) {
                    item.AccountInvestment.accountInvestmentStatus = _getMapName(1, item.AccountInvestment.accountInvestmentStatusKey, item.AccountInvestment.accountInvestmentStatus);
                }
                return item;
            })

            if (promise) {
                return promise;
            } else {
                var defer = $q.defer();
                defer.resolve(item);
                return defer.promise;
            }

        };

        var publicMembers = {
            "accountStatus": function () {
                //:/data/ws/rest/sudoor/SpringSecurity/Authentication
                return $resource(baseAPI + "/sudoor/SpringSecurity/Authentication")
                    .get().$promise;
            },
            login: function (username, password, verificationCode) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/login", {
                    "userName": username,
                    "password": password,
                    "verificationCode": verificationCode
                })
                    .success(function (re) {
                        if (re && re.status === "000") {
                            $sessionStorage.login = true;
                        } else {
                            $sessionStorage.login = false;
                        }
                        defer.resolve(re);
                    })
                    .error(function (err) {
//            defer.resolve(err);
                        defer.reject(err);
                    });
                return defer.promise;
            },
            accountIsExist: function (username) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/accountisexist", {"userName": username})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            "exit": function () {
                // delete $sessionStorage.login;

                //TODO dk 2015.2.28 add logout
                var defer = $q.defer();
                $sessionStorage.$reset();
                delete $rootScope.username_1;
                delete $rootScope.login;
                $http.post(apiUrl + "/p2p/j_spring_security_logout", {})
                    .success(function (re) {
                        $state.go("portal");
                        defer.resolve(re);
                    })
                    .error(function (err) {
                        defer.reject(err);
                        $sessionStorage.$reset();
                        $state.go("portal");
                    });
            },
            "isLogin": function () {
                return $sessionStorage.login;
                //return $resource(baseAPI + "/sudoor/SpringSecurity/Authentication")
                //    .get().$promise
                //    .then(function (o) {
                //        console.log(o)
                //    })
                //    .catch(function (err) {
                //        console.log(err);
                //    })
            },
            "checkLoginStatus": function () {
                var defer = $q.defer();
                $resource(baseAPI + "/sudoor/SpringSecurity/Authentication")
                    .get().$promise
                    .then(function (obj) {
                        var flag = obj && obj.authenticated && obj.name !== "anonymousUser";
                        if (!flag) {
                            $sessionStorage.$reset();
                            defer.reject("用戶未登录");
                        } else {
                            $sessionStorage.login = true;
                            $rootScope.login = true;
                            $rootScope.accountSequence = obj.name;
                            defer.resolve(obj);
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        $sessionStorage.$reset();
                        defer.reject(err);
                    })

                return defer.promise;
            },
            register: function (username, password, mobile) {

                //20150131 chenchang begin : check cookie for recommend info
                var url = window.location.href;
                if (url.indexOf("?refid=") == -1 || url.indexOf("&reftype=") == -1) {
                    var refid = this.getCookie("refid");
                    var reftype = this.getCookie("reftype");
                    if (refid != "" && reftype != "") {
                        url = url + "?refid=" + refid + "&reftype=" + reftype;
                    }
                }
                //20150131 chenchang end

                var defer = $q.defer();
                $http.post(baseAPI + "/account/register", {
                    "url": url,    //20150130 chenchang 记录当前页面链接,判定是否有推荐人
                    "userName": username, "password": password,
                    "mobile": mobile
                })
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            sendMobileVerificationCode: function (mobile, sendKind) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/sendMobileVerificationCode", {"mobile": mobile, "sendKind": sendKind})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            validMobileVerificationCode: function (mobile, mobileVerificationCode) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/validMobileVerificationCode", {
                    "mobile": mobile,
                    "mobileVerificationCode": mobileVerificationCode
                })
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            findPassword: function (username, password) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/findPassword", {"userName": username, "password": password})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            checkAccountIsSetQuestion: function (username) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/checkAccountIsSetQuestion", {"userName": username})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            getQuestionList: function () {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/getQuestionList", {})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            checkAccountQuestionAnswer: function (systemQuestionSequence, answer, userName) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/checkAccountQuestionAnswer", {
                    "systemQuestionSequence": systemQuestionSequence,
                    "answer": answer,
                    "userName": userName
                })
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            getQuestionListByUserName: function (username) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/getQuestionListByUserName", {"userName": username})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            myInvestments: function () {
                return $resource(baseAPI + "/deal/wdzh02MyInvestList", null, {
                    "list": {
                        "method": "POST"
                    }
                }).list({}).$promise
                    .then(function (data) {
                        if (data && data.status === '000') {
                            data = data.data;
                            var array1 = [];
                            if (data && data.allying) {
                                data.allying.forEach(function (t) {
                                    array1.push(_convert(t, "t_inv", map));
                                })
                            }
                            var array2 = [];
                            if (data && data.hold) {
                                data.hold.forEach(function (t) {
                                    array2.push(_convert(t, "t_act_inv", map));
                                })
                            }

                            var array3 = [];
                            if (data && data.end) {
                                var array3 = [];
                                data.end.forEach(function (t) {
                                    array3.push(_convert(t, "t_inv", map));
                                })
                                //return $q.all(array3)
                                //    .then(function (list) {
                                //        data.end = list;
                                //        return data;
                                //    })
                                // return data;
                            }
                            return $q.all(array1)
                                .then(function (list) {
                                    data.allying = list;
                                    //return data;
                                    return $q.all(array2);
                                })
                                .then(function (d) {
                                    data.hold = d;
                                    return $q.all(array3);
                                })
                                .then(function (list) {
                                    data.end = list;
                                    return data;
                                })
                                .finally(function () {
                                    return data;
                                })
                            // return data;
                        } else {
                            return $q.reject(data ? data.msg : "get nothing from server");
                        }
                    });
            },
            /**
             * 修改最高学历
             * @param educationDegree
             * @returns {*}
             */
            modifyEducationDegree: function (educationDegree) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/modifyEducationDegree", {"value": educationDegree})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            /**
             * 修改职业
             * @param accountIndustry
             * @returns {*}
             */
            modifyIndustry: function (accountIndustry) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/modifyIndustry", {"value": accountIndustry})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            /**
             * 修改收入
             * @param income
             * @returns {*}
             */
            modifyIncome: function (income) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/modifyIncome", {"value": income})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            /**
             * 修改手机号码、绑定手机号码
             * @param mobile
             * @returns {*}
             */
            modifyAccountMobile: function (mobile) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/modifyAccountMobile", {"mobile": mobile})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            /**
             * 修改邮箱、绑定邮箱
             * @param email
             * @returns {*}
             */
            modifyAccountEmail: function (email, type) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/modifyAccountEmail", {"email": email, "type": type})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            /**
             * 修改地址
             * @param address
             * @returns {*}
             */
            modifyAddress: function (address) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/modifyAddress", {"value": address})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            /**
             * 获取个人账户资料
             * @returns {*}
             */
            getAccountById: function () {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/getAccountById", {})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            //红包
            myPackets: function (st, page, pageSize) {
                //testData
                /*var _data = function (m) {
                 var json = {};
                 json.status = '000';

                 var content = [];
                 for (var i = 1; i < m; i++) {
                 var cJson = {};
                 cJson.accountWelfareSequence = 1; //账户福利流水号
                 cJson.welfareSource = 1; //福利来源
                 cJson.welfareQuota = 19 + i; //金额
                 cJson.welfareExpiredDate = '2015.08.08 09:59:32'; //失效时间
                 content.push(cJson);
                 }
                 ;

                 var data = {};
                 data.last = true; //?
                 data.totalPages = 3; //总页数
                 data.totalElements = 6; //总记录数
                 data.number = 1; //当前第几页
                 data.size = 2; //一页多少条
                 data.numberOfElements = 3 //当前页多少条
                 data.content = content;
                 json.data = data;

                 return json;
                 };*/

                var defer = $q.defer();
                $http.post(baseAPI + "/accountWelfare/queryAccountWelfareByAccountAndStatus",
                    {"welfareStatus": st, "page": page, "size": pageSize}).success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });

                return defer.promise.then(function (res) {
                    if (res && res.status === '000') {
                        //分页
                        var rData = res.data;

                        var array = [];
                        res.data.content.forEach(function (t) {
                            array.push(_convert(t, "t_act_wf", map))
                        });
                        rData.content = array;
                        // return rData;
                        return $q.all(rData.content)
                            .then(function (list) {
                                // return list;
                                rData.content = list;
                                return rData;
                            });
                    } else {
                        console.log(res);
                        return [];
                    }
                }).catch(function (err) {
                    console.log(err);
                    return [];
                });
            },
            //投资项目详情
            getInvestItem: function (id) {
                var defer = $q.defer();
                $http.post(baseAPI + "/merchant/queryInvestmentInfoById", {"investmentId": id})
                    .success(function (obj) {
                        var datas = new Array();
                        var array = [];
                        if ('' != obj.data) {
                            obj.data.forEach(
                                function (t) {
                                    datas[0] = _convert(t.investment, "t_inv", map);
                                    datas[1] = _convert(t.account, "t_acct", mapAccount);
                                    array.push(datas);
                                }
                            )
                        }

                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            //投资项目tab记录
            myInvestTabs: function (investmentSequence, userName_1) {
                console.log('-----登陆用户' + userName_1)
                var defer = $q.defer();
                $http.post(baseAPI + "/deal/wytz0101List", {"investmentSequence": investmentSequence})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise.then(function (res) {
                    if (res && res.status === "000") {
                        var rData = res.data;
                        if (rData.tRecord) {
                            rData.tRecord.forEach(function (t) {
                                t.accountOrder.tradeDate = DateTimeService.getTzfmtTime(new Date(t.accountOrder.tradeDate), "yyyy.MM.dd hh:mm");
                                t.userName = _getMask(t.userName, userName_1);
                            })
                        }
                        if (rData.planF) {
                            rData.planF.forEach(function (t) {
                                t.claimPayPlan.claimPayPlanNatureDate = DateTimeService.getTzfmtTime(new Date(t.claimPayPlan.claimPayPlanNatureDate), "yyyy.MM.dd");
                                if (t.claimPayRecord) {
                                    if (t.claimPayRecord.claimPayDate) {
                                        t.claimPayRecord.claimPayDate = DateTimeService.getTzfmtTime(new Date(t.claimPayRecord.claimPayDate), "yyyy.MM.dd");
                                    }
                                }
                            })
                        }


                        return rData;
                    }
                }).catch(function (err) {
                    console.log(err);
                    return [];
                });
            },
            //红包兑换 --todo 朱球后台修改
            exchangeWelfare: function (amt) {
                var defer = $q.defer();
                $http.post(baseAPI + "/deal/consumeRedEnvelope", {"amount": amt})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            //跳汇富开通用户
            openAccount: function (accountId) {
                // $location.url(ConstantService.PostUrl + "\""+ accountId +"\"}}");
                window.open(ConstantService.PostUrl + "\"" + accountId + "\"}}");
            },
            resetPassword: function (oldpwd, newpwd) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/resetPassword", {"oldpwd": oldpwd, "newpwd": newpwd})
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            saveAccountQuestionAnswer: function (data, password) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/saveAccountQuestionAnswer", {
                    "data": data,
                    "password": password
                })
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            getAllSystemQuestion: function (questionStatus) {
                var defer = $q.defer();
                ODataService.getDB().then(function (p2pDB) {
                    var array = [];
                    p2pDB.SystemQuestions
                        .filter("it.QuestionStatus === " + questionStatus)
                        .forEach(
                        function (t) {
                            array.push(t.initData);
                        })
                        .then(function (res) {
                            return $q.all(array).then(function (list) {
                                console.log(list);
                                defer.resolve(list);
                            });
                        });
                });
                return defer.promise;
            },
            updateAccountQuestionAnswer: function (data) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/updateAccountQuestionAnswer", {
                    "data": data
                })
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            checkMobile: function (mobile) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/checkMobile", {
                    "mobile": mobile
                })
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            checkMobileAndPwd: function (mobile, password) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/checkMobileAndPwd", {
                    "mobile": mobile,
                    "password": password
                })
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            getCurrentUserLoginLog: function (accountSequence) {
                var defer = $q.defer();
                ODataService.getDB().then(function (p2pDB) {
                    var array = [];
                    p2pDB.AccountLoginRecords
                        .filter("it.AccountSequence === " + accountSequence)
                        .forEach(
                        function (t) {
                            array.push(t.initData);
                        })
                        .then(function (res) {
                            return $q.all(array).then(function (list) {
                                defer.resolve(list);
                            });
                        });
                });
                return defer.promise;
            },
            isUserNameMatchMobile: function (userName, mobile) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/isUserNameMatchMobile", {
                    "userName": userName,
                    "mobile": mobile
                })
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            queryAreaProvinces: function () {
                var defer = $q.defer();
                ODataService.getDB().then(function (p2pDB) {
                    var array = [];
                    p2pDB.Areas
                        .filter("it.AddressLevel ==='1' || it.AddressLevel==='2'")
                        .forEach(
                        function (t) {
                            array.push(t.initData);
                        })
                        .then(function (res) {
                            return $q.all(array).then(function (list) {
                                console.log(list);
                                defer.resolve(list);
                            });
                        });
                });
                return defer.promise;
            },
            queryAreaCitys: function () {
                var defer = $q.defer();
                ODataService.getDB().then(function (p2pDB) {
                    var array = [];
                    p2pDB.Areas
                        .filter("it.AddressLevel ==='3'")
                        .forEach(
                        function (t) {
                            array.push(t.initData);
                        })
                        .then(function (res) {
                            return $q.all(array).then(function (list) {
                                console.log(list);
                                defer.resolve(list);
                            });
                        });
                });
                return defer.promise;
            },
            modifyProvinceAndCity: function (provinceCode, cityCode) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/modifyProvinceAndCity", {
                    "provinceCode": provinceCode,
                    "cityCode": cityCode
                })
                    .success(function (obj) {
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            },
            getCookie: function (c_name) {
                if (document.cookie.length > 0) {
                    var c_start = document.cookie.indexOf(c_name + "=")
                    if (c_start != -1) {
                        c_start = c_start + c_name.length + 1;
                        var c_end = document.cookie.indexOf(";", c_start);
                        if (c_end == -1) c_end = document.cookie.length
                        return decodeURI(document.cookie.substring(c_start, c_end))
                    }
                }
                return ""
            },
            setCookie: function (c_name, value, expiredays) {
                var exdate = new Date();
                exdate.setDate(exdate.getDate() + expiredays);
                document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
            },
            checkMobileIsExist: function (mobile) {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/checkMobileIsExist", {
                    "mobile": mobile
                }).success(function (obj) {
                    defer.resolve(obj);
                }).error(function (obj) {
                    defer.reject(obj);
                });
                return defer.promise;
            },
            logout: function () {
                var defer = $q.defer();
                $http.post(baseAPI + "/account/logout", {})
                    .success(function (obj) {
                        $sessionStorage.$reset();
                        defer.resolve(obj);
                    }).error(function (obj) {
                        defer.reject(obj);
                    });
                return defer.promise;
            }, reLogin: function () {
                $rootScope.historyPath = $location.path();
                $sessionStorage.$reset();
                $state.go("login");
            },
            "currentUserDeals": function (start, end) {
                if (start && end) {
                    return $resource(baseAPI + "/deal/dailyPaymentStatus").save({
                        "beginDate": start.toString(),
                        "endDate": end.toString()
                    }).$promise;
                } else {
                    return $q.reject("both start and end are required");
                }
                //var defer = $q.defer();
                //var testData = {"status":"000","msg":"请求数据成功!","data":{"2015/09":{"expect":4041.0549200184,"paid":4608.5694745365,"date":{"18":[{"claimGatherPlanActualTotalAmount":3803.3458070761,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4366},{"claimGatherPlanActualTotalAmount":237.7091129423,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4390}],"15":[{"claimGatherPlanActualTotalAmount":3871.1983586107,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4522},{"claimGatherPlanActualTotalAmount":430.1331509567,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4540},{"claimGatherPlanActualTotalAmount":307.2379649691,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4558}]}},"2015/07":{"expect":8649.6243945549,"paid":0,"date":{"18":[{"claimGatherPlanActualTotalAmount":3803.3458070761,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4364},{"claimGatherPlanActualTotalAmount":237.7091129423,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4388}],"15":[{"claimGatherPlanActualTotalAmount":3871.1983586107,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4520},{"claimGatherPlanActualTotalAmount":430.1331509567,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4538},{"claimGatherPlanActualTotalAmount":307.2379649691,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4556}]}},"2015/08":{"expect":8649.6243945549,"paid":0,"date":{"18":[{"claimGatherPlanActualTotalAmount":3803.3458070761,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4365},{"claimGatherPlanActualTotalAmount":237.7091129423,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4389}],"15":[{"claimGatherPlanActualTotalAmount":3871.1983586107,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4521},{"claimGatherPlanActualTotalAmount":430.1331509567,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4539},{"claimGatherPlanActualTotalAmount":307.2379649691,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4557}]}},"2015/05":{"expect":4041.0549200184,"paid":4608.5694745365,"date":{"18":[{"claimGatherPlanActualTotalAmount":3803.3458070761,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4362},{"claimGatherPlanActualTotalAmount":237.7091129423,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4386}],"15":[{"claimGatherPlanActualTotalAmount":3871.1983586107,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4518},{"claimGatherPlanActualTotalAmount":430.1331509567,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4536},{"claimGatherPlanActualTotalAmount":307.2379649691,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4554}]}},"2015/06":{"expect":8649.6243945549,"paid":0,"date":{"18":[{"claimGatherPlanActualTotalAmount":3803.3458070761,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4363},{"claimGatherPlanActualTotalAmount":237.7091129423,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4387}],"15":[{"claimGatherPlanActualTotalAmount":3871.1983586107,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4519},{"claimGatherPlanActualTotalAmount":430.1331509567,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4537},{"claimGatherPlanActualTotalAmount":307.2379649691,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4555}]}},"2015/04":{"expect":4041.0549200184,"paid":4608.5694745365,"date":{"18":[{"claimGatherPlanActualTotalAmount":3803.3458070761,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4361},{"claimGatherPlanActualTotalAmount":237.7091129423,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4385}],"15":[{"claimGatherPlanActualTotalAmount":3871.1983586107,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4517},{"claimGatherPlanActualTotalAmount":430.1331509567,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4535},{"claimGatherPlanActualTotalAmount":307.2379649691,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4553}]}},"2015/11":{"expect":8649.6243945549,"paid":0,"date":{"18":[{"claimGatherPlanActualTotalAmount":3803.3458070761,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4368},{"claimGatherPlanActualTotalAmount":237.7091129423,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4392}],"15":[{"claimGatherPlanActualTotalAmount":3871.1983586107,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4524},{"claimGatherPlanActualTotalAmount":430.1331509567,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4542},{"claimGatherPlanActualTotalAmount":307.2379649691,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4560}]}},"2015/10":{"expect":4041.0549200184,"paid":4608.5694745365,"date":{"18":[{"claimGatherPlanActualTotalAmount":3803.3458070761,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4367},{"claimGatherPlanActualTotalAmount":237.7091129423,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4391}],"15":[{"claimGatherPlanActualTotalAmount":3871.1983586107,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4523},{"claimGatherPlanActualTotalAmount":430.1331509567,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4541},{"claimGatherPlanActualTotalAmount":307.2379649691,"claimGatherPlanStatus":4,"claimGatherPlanSequence":4559}]}},"2015/12":{"expect":8649.6243945549,"paid":0,"date":{"18":[{"claimGatherPlanActualTotalAmount":3803.3458070761,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4369},{"claimGatherPlanActualTotalAmount":237.7091129423,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4393}],"15":[{"claimGatherPlanActualTotalAmount":3871.1983586107,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4525},{"claimGatherPlanActualTotalAmount":430.1331509567,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4543},{"claimGatherPlanActualTotalAmount":307.2379649691,"claimGatherPlanStatus":3,"claimGatherPlanSequence":4561}]}}}};
                //defer.resolve(testData);
                //return defer.promise;
            }
        };

        return publicMembers;
    });
