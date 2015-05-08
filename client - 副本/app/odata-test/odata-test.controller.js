'use strict';

angular.module('p2pClientApp')
    .controller('OdataTestCtrl', function ($scope, $data, ODataService) {
        console.log("111:" + new Date())
        ODataService.getDB()
            .then(function (p2pDB) {
                console.log("111:" + new Date())
                p2pDB.Dictionarys.Dictionary.readAll().then(function (results) {
                    results = results.map(function (t) {
                        return t.initData;
                    });
                    $scope.$apply(function () {
                        $scope.dictionarays = results;
                    });
                });
            });
    });
