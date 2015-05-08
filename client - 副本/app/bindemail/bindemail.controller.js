'use strict';

angular.module('p2pClientApp')
  .controller('BindemailCtrl', function ($scope,AccountService) {
        $scope.sendSuccess=false;
        $scope.submitForm = function(isValid){
            if(isValid){
                var promise = AccountService.modifyAccountEmail($scope.email,'1');
                promise.then(function (obj) {//resolve
                    if (obj && obj.status === '000') {//modify success
                        $scope.sendSuccess=true;
                    } else if (obj && obj.status === '217') {//modify failed
                        $scope.sendSuccess=false;
                        alert(obj.msg);
                    }else{
                        $scope.sendSuccess=false;
                        alert(obj.msg);
                    }
                }).catch(function (err) {
                    $scope.sendSuccess=false;
                    console.log(err);
                });
            }
        }
  });
