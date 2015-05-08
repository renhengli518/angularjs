'use strict';

angular.module('p2pClientApp')
    .controller('SafeCtrl', function ($scope, FinanceService, UtilsService) {
        FinanceService.imprest()
            .then(function (balance) {
                var t = parseFloat(balance);
                t = UtilsService.formatMoney(t, 3, 2);
               $scope.$apply(function(){
                   $scope.moneyBalance = t;
               })
            })
    });
