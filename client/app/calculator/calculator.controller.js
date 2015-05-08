'use strict';

angular.module('p2pClientApp')
    .controller('CalculatorCtrl', function ($scope, FinanceService, CMSService, _) {
        $scope.calculatorInput = {
            "capital": "",
            "period": "6",
            "rate": "",
            "isRoll": false
        }

        $scope.reset = function () {
            $scope.calculatorInput = {
                "capital": "",
                "period": "",
                "rate": "",
                "isRoll": false
            };
            $scope.typeList.forEach(function(item){
                item.selected = false;
            })
        }

        $scope.calculate = function () {
            var model = $scope.calculatorInput;
            if (model.capital > 0, model.rate > 0) {
                CMSService.showLoading();
                FinanceService.calculate(model.capital, model.period, model.rate / 100, model.isRoll)
                    .then(function (d) {
                        var selectedP = $scope.typeList.filter(function (item) {
                            return item.selected;
                        });
                        var array = [d.custom];
                        selectedP.forEach(function (t) {
                            array.push(d[t.field]);
                        });
                        //结果存放在数组里，
                        //console.log(array);
						$('#result_pop').addInteractivePop({magTitle: '对比结果', mark :true,drag: false, position:"fixed"});
						var colors = ['#cbe4c4', '#ffd2c1', '#f49fab', '#089bff','#089bff'],
						categorie = [],result = [],arraySort=[];
						var resultOrder = array.sort(
							function(a, b)
							{
								return (a.result - b.result);
							}
						);
						$.each(resultOrder, function(index, value){
							if(value.description == "用户自定义"){
								arraySort.splice(index,0);
							}else{
								categorie.push(value.description);
								arraySort.push({description : value.description, y : Number(value.result), color:colors[index]});
							}
						});
						$('#container').highcharts({
							chart: {
								type: 'column',
							},
							title: {
								text: ''
							},
							credits: {
								enabled: false
							},
							exporting: {
								enabled: false
							},
							legend: {
								enabled: false
							},
							xAxis: {
								categories: categorie,
								gridLineWidth: 1,
								gridLineDashStyle:'ShortDot'
							},
							yAxis: {
								min: 0,
								title: {
									text: ''
								},
								gridLineWidth: 1,
								gridLineDashStyle:'ShortDot'
							},
							plotOptions: {
								column: {
									dataLabels: {
										enabled: true,
										color: '#666',
										style: {
											fontWeight: 'bold'
										},
										formatter: function() {
											return this.y;
										}
									}
								}
							},
							series: [{
								name: name,
								data: arraySort,
								color: 'white'
								}]
						})
                    })
                    .catch(function (err) {
                        console.error(err);
                    })
                    .finally(function () {
                        CMSService.hideLoading();
                    })
            } else {
                alert("请输入金额和利率")
            }

        }

        $scope.typeList = [
            {
                "name": "平台贷款项目",
                "field": "platform",
                "selected": false
            }, {
                "name": "银行活期存款",
                "field": "demand",
                "selected": false
            }, {
                "name": "银行定期存款",
                "field": "deposit",
                "selected": false
            }, {
                "name": "货币基金",
                "field": "fund",
                "selected": false
            }
        ]
    });
