'use strict';

angular.module('p2pClientApp')
  .controller('ProtocolCtrl', function ($scope,$stateParams) {
    $scope.message = 'Hello';
	if($stateParams.id == undefined || $stateParams.id == ''){
		$scope.selection = 1;
	}else{
		$scope.selection = $stateParams.id;
	}
  });
