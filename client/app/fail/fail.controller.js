'use strict';

angular.module('p2pClientApp')
  .controller('FailCtrl', function (ConstantService, $scope, $stateParams) {
    $scope.message = 'Hello';
    $scope.divParam = $stateParams.param;//param 是url中参数的key
    $scope.errCode = $stateParams.respcode;//param 是url中参数的key
    $scope.errMsg = encodeURI(encodeURI($stateParams.respdesc));//param 是url中参数的key
    
    //跳汇富开通用户
    $scope.openAccount = function () {
        var url = '/acct/postnroute?jsonStr={"url":"-channelPay-registerparam"}';
        window.open(ConstantService.RouteUrl() + url);
    };
  });
