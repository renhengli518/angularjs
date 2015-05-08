'use strict';

angular.module('p2pClientApp')
    .factory('ODataService', function ($data, $rootScope, $q, ConstantService, UtilsService) {
        var dicPromise = null;
        var _getDic = function () {
            var name = "p2p-dictionary";
            if (!dicPromise) {
                dicPromise = UtilsService.cache(name)
                    .then(function (res) {
                        if (!res) {
                            return publicMembers.getDB()
                                .then(function (p2pDB) {
                                    return p2pDB.Dictionarys.Dictionary.readAll().then(function (results) {
                                        results = results.map(function (t) {
                                            return t.initData;
                                        });
                                        var json = {};
                                        results.forEach(function (item) {
                                            var tmp = json[item.TableName] || {};
                                            if (!tmp[item.ColumnName]) {
                                                tmp[item.ColumnName] = [];
                                            }
                                            tmp[item.ColumnName].push(item);
                                            json[item.TableName] = tmp;
                                        });
                                        UtilsService.cache(name, json);
                                        return json;
                                    });
                                });
                        } else {
                            return res;
                        }
                    });
            }
            return dicPromise;
        };

        var resourcePromise = null;
        var _getResource = function () {
            var name = "p2p-image-table";
            if (!resourcePromise) {
                resourcePromise = UtilsService.cache(name)
                    .then(function (res) {
                        if (!res) {
                            return publicMembers.getDB()
                                .then(function (p2pDB) {
                                    return p2pDB.Resources.Resource.readAll().then(function (results) {
                                        results = results.map(function (t) {
                                            return t.initData;
                                        });
                                        var json = {};
                                        results.forEach(function (item) {
                                            json[item.ResourceType] = item.ResourcePath;
                                        });
                                        if (Object.keys(json).length > 0) {
                                            UtilsService.cache(name, json);
                                        }
                                        return json;
                                    });
                                });
                        } else {
                            return res;
                        }
                    });
            }
            return resourcePromise;
        };

        var areaPromise = null;
        var _getArea = function () {
            var name = "p2p-area";
            if (!areaPromise) {
                areaPromise = UtilsService.cache(name)
                    .then(function (res) {
                        if (!res) {
                            return publicMembers.getDB()
                                .then(function (p2pDB) {
                                    return p2pDB.Areas.Area.readAll().then(function (results) {
                                        results = results.map(function (t) {
                                            return t.initData;
                                        });
                                        var json = {};
                                        results.forEach(function (item) {
                                            // json[item.CityCode] = item.CityChineseName;
                                            json[item.AddressId] = item.AddressChineseName;
                                        });
                                        if (Object.keys(json).length > 0) {
                                            UtilsService.cache(name, json);
                                        }
                                        return json;
                                    });
                                });
                        } else {
                            return res;
                        }
                    });
            }
            return areaPromise;
        };


        var dbPromise = null;
        var publicMembers = {
            getDB: function () {
                var db = $rootScope.p2pDatabase;
                if (db) {
                    var defer = $q.defer();
                    defer.resolve(db);
                    return defer.promise;
                } else {
                    if(dbPromise) {
                        return dbPromise;
                    } else {
                        dbPromise = $data.initService(ConstantService.ODataServicePath())
                            .then(function (db) {
                                $rootScope.p2pDatabase = db;
                                return db;
                            });
                        return dbPromise;
                    }

                }
            },
            dictionary: function (tableName, fieldName, key) {//t_dic 中 tab_name, col_name, col_value get  col_cvcn
                return _getDic()
                    .then(function (obj) {
                        if (obj && tableName) {
                            var t = obj[tableName];
                            t.getValue = function (fieldName, key) {
                                var t1 = _.find(this[fieldName], {ColumnValue: key});
                                //if(!t1 && /[\d]/.test(key)) {
                                //    t1 = _.find(this[fieldName], {ColumnValue: parseInt(key)});
                                //}
                                return t1 ? t1.ColumnValueChineseMean : "";
                            };
                            if (fieldName && key) {
                                return t.getValue(fieldName, key);
                            } else {
                                return t;
                            }
                        }
                    });
            },
            resource: function (type) {
                return _getResource()
                    .then(function (obj) {
                        if (type) {
                            return obj ? obj[type] : "";
                        } else {
                            return obj;
                        }
                    });
            },
            area: function (type) {
                return _getArea()
                    .then(function (obj) {
                        if (type) {
                            return obj ? obj[type] : "";
                        } else {
                            return obj;
                        }
                    });
            }
        };
        return publicMembers;
    });
