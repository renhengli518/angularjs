'use strict';

angular.module('p2pClientApp')
  .controller('AccountPacketCtrl', function ($scope, AccountService) {
    $scope.selection = '1';

    //分页 
    $scope.currentPage = 1;
    $scope.totalPage = 1;
    $scope.pageSize = 7;
    $scope.pages = [];
    $scope.endPage = 1;

	$scope.$watch("selection", function (newV, oldV) {
            // $scope.showList = $scope.totalData[newV];
            $scope.selection = newV;
            getPackets(newV,1,$scope.pageSize);
            // alert(1)
    });

    /**
     * 兑换福利
     * @return {[type]} [description]
     */
	$scope.exchangeWelfare = function (amt) {
        // var amt = 
        AccountService.exchangeWelfare(amt);
    };

    /**
     * 分页 //todo 后期优化
     * @return {[type]} [description]
     */
    var paginationInit = function(){
        //生成数字链接
        var pArray = [];
        $scope.currentPage = $scope.currentPage + 1; //db返回当前页 计数从0开始
        if ($scope.currentPage > 1 && $scope.currentPage < $scope.totalPage) {
            if($scope.totalPage > 3){
                for (var i = $scope.currentPage,y=0; i <= $scope.totalPage; i++,y++) {
                    pArray.push(i-1);
                    if(y == 2){
                        break;
                    }
                };
            }else{
                if($scope.totalPage == 3){
                    pArray.push($scope.currentPage);
                }
                
            }
            
        } else if ($scope.currentPage == 1 && $scope.totalPage > 1) {
            if($scope.totalPage > 3){
                for (var i = $scope.currentPage,y=0; i < $scope.totalPage; i++,y++) {
                    pArray.push(i+1);
                    if(y == 2){
                        break;
                    }
                };
            }else{
                if($scope.totalPage == 3){
                    pArray.push($scope.currentPage + 1)
                }
            }
            
        } else if ($scope.currentPage == $scope.totalPage && $scope.totalPage > 1) {
            if($scope.totalPage > 3){
                pArray.push($scope.currentPage - 2);
                pArray.push($scope.currentPage - 1);
            }else{
                if($scope.totalPage == 3){
                    pArray.push($scope.currentPage - 1);     
                }
                
            }
            
        }
        $scope.pages = pArray;

    }

    $scope.next = function () {
        if ($scope.currentPage < $scope.totalPage) {
            $scope.currentPage++;
            getPackets($scope.selection,$scope.currentPage,$scope.pageSize);
        }
    };
 
    $scope.prev = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            getPackets($scope.selection,$scope.currentPage,$scope.pageSize);
        }
    };

    $scope.loadPage = function(page) {
        $scope.currentPage = page;
        getPackets($scope.selection,page,$scope.pageSize);
    };


    /**
     * 获取红包
     * @param  {[type]} p [description]
     * @return {[type]}   [description]
     */
    var getPackets = function(st,pageNum,pageSize){
        AccountService.myPackets(st,pageNum,$scope.pageSize).then(function(obj){
            $scope.showList = obj.content;
            $scope.totalPage = obj.totalPages;
            $scope.endPage = obj.totalPages;
            $scope.currentPage = obj.number;
            paginationInit();
        }).catch(function(err){
            console.error(err);
        });
    }

    // getPackets(1,1);

});
