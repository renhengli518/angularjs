'use strict';

angular.module('p2pClientApp')
    .controller('FooterCtrl', function ($scope, $location, CMSService, FinanceService) {

        $scope.$watch("calculatorModel", function () {
            $scope.result = "";
        }, true);

        $scope.calculatorModel = {
            "capital": "",
            "period": "",
            "rate": ""
        }

        $scope.reset = function() {
            $scope.calculatorModel = {
                "capital": "",
                "period": "",
                "rate": ""
            }
        }
		$scope.selection = 'incomeCal';
        $scope.calculatorBox = function () {
            $('#calculator_pop').addInteractivePop({magTitle: '', mark: true, drag: false, position: "fixed"});
        }

        $scope.result = 0;
        $scope.calculate = function () {
            var model = $scope.calculatorModel;

            if(model.capital > 0 && model.rate > 0) {
                CMSService.showLoading();
                FinanceService.calculate(model.capital, model.period, model.rate/100)
                    .then(function (d) {
                        $scope.result = d.platform.result;
                    })
                    .catch(function(err){
                        console.error(err);
                    })
                    .finally(function(){
                        CMSService.hideLoading();
                    })
            } else {
                alert("请输入金额和利率");
            }

        }
    });
