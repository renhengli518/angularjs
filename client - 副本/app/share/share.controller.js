'use strict';

angular.module('p2pClientApp')
    .controller('ShareCtrl', function ($scope, ShareService, UtilsService) {

        /*通过短信推荐*/
        $scope.sms = function () {
            $('#sms_pop').addInteractivePop({magTitle: '通过短信推荐', mark: true, drag: false, position: "fixed"});
        }
        /*通过邮件推荐*/
        $scope.email = function () {
            $('#email_pop').addInteractivePop({magTitle: '通过邮件推荐', mark: true, drag: false, position: "fixed"});
        }
        /*直接复制链接推荐*/
        $scope.link = function () {
            $('#link_pop').addInteractivePop({magTitle: '直接复制链接', mark: true, drag: false, position: "fixed"});
        }

        //1 qq 2 新浪微博 3 腾讯微博 4 微信 5 短信 6 邮箱
        UtilsService.cache("account").then(function (account) {
            if (account) {
                $scope.refid = account.AccountSequence;
                $scope.refUrlOri =  "http://www.vmoney.cn/#/register?refid=" +   $scope.refid;
            }
        }).catch(function (err) {
            console.log(err);
        });

        $scope.shareWeibo = function () {
            var rnd = new Date().valueOf();
            $scope.refUrl = encodeURIComponent($scope.refUrlOri +"&reftype=2");
            window.open("http://service.weibo.com/share/share.php?url=" + $scope.refUrl + "&title=亲,你的钱还在银行定存吗？那就太out啦,推荐你高大上的理财平台---平xxx,12.5%以上预期年化利率,本息担保,维信旗下公司,资金安全有保障。戳右侧链接注册即送50元红包，让你的首笔投资收益再飙升！&language=zh_cn&pic=&appkey=&rnd=" + rnd
                , "_blank",
                "width=615,height=505");
        };

        $scope.shareTencentWeibo = function () {
            var _url = encodeURIComponent($scope.refUrlOri + "&reftype=3");
            var _assname = encodeURI("");//你注册的帐号，不是昵称
            var _appkey = encodeURI("53cd70accec50aa6de08f6c691fa4458");//你从腾讯获得的appkey
            var _pic = encodeURI('');//（例如：var _pic='图片url1|图片url2|图片url3....）
            var _t = '亲,你的钱还在银行定存吗？那就太out啦,推荐你高大上的理财平台---平xxx,12.5%以上预期年化利率,本息担保,维信旗下公司,资金安全有保障。戳右侧链接注册即送50元红包，让你的首笔投资收益再飙升！';//标题和描述信息
            // _t = document.title + _t;//请在这里添加你自定义的分享内容
            _t = encodeURI(_t);

            var _u = 'http://share.v.t.qq.com/index.php?c=share&a=index&url=' + _url
                + '&appkey=' + _appkey + '&pic=' + _pic + '&assname=' + _assname
                + '&title=' + _t;
            window
                .open(
                _u,
                '',
                'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
        };

        $scope.shareByEmail = function () {
            var promise = ShareService.sendMailRecommend($('#emailAddr').val(), $('#emailSubject').val(), $('#emailContent').val());
            promise.then(function (obj) {
                if (obj && obj.status === '000') {
                    alert("邮件发送成功!");
                } else {
                    alert(obj.msg);
                }
            }).catch(function (err) {
                console.log(err)
            })
        };

        $scope.getTextToCopy = function () {
            return $('#shareText').val();
        }
        $scope.doSomething = function () {
            alert("已成功复制内容!");
        };

        $scope.queryRecommendCount = function () {
            var promise = ShareService.queryAccountRecommendRecordCount();
            promise.then(function (obj) {
                if (obj && obj.status == '000') {
                    $scope.rCount = obj.data;
                } else {
                    alert(obj.msg);
                }
            }).catch(function (err) {
                console.log(err);
            })
        };

        $scope.queryRecommendCount();

        //--------
    });
