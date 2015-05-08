/**
 * Created by chenchang on 2015/2/5.
 */
angular.module('p2pClientApp')
    .factory('ShareService', function (ConstantService, $q, $http) {
        var baseAPI = ConstantService.APIRoot();

        return {
            sendMailRecommend: function (toUser, sendSubject, sendContent) {
                var defer = $q.defer();
                $http.post(baseAPI + "/accountRecommendRecord/sendMailRecommend", {
                    "toUser": toUser,
                    "sendSubject": sendSubject,
                    "sendContent": sendContent
                }).success(function (obj) {
                    defer.resolve(obj);
                }).error(function (obj) {
                    defer.reject(obj);
                });
                return defer.promise;
            },
            queryAccountRecommendRecordCount: function () {
                var defer = $q.defer();
                $http.post(baseAPI + "/accountRecommendRecord/queryAccountRecommendRecordCount", {}).success(function (obj) {
                    defer.resolve(obj);
                }).error(function (obj) {
                    defer.reject(obj);
                });
                return defer.promise;
            }
        }

    });
