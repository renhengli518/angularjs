'use strict';

angular.module('p2pClientApp')
    .factory('DateTimeService', function (_) {
        var _duration = function (timeSpan) {
            var days = Math.floor(timeSpan / 86400000);
            var diff = timeSpan - days * 86400000;
            var hours = Math.floor(diff / 3600000);
            diff = diff - hours * 3600000;
            var minutes = Math.floor(diff / 60000);
            diff = diff - minutes * 60000;
            var secs = Math.floor(diff / 1000);
            return {
                'days': days,
                'hours': (hours < 10) ? '0' + hours : hours,
                'minutes': (minutes < 10) ? '0' + minutes : minutes,
                'seconds': (secs < 10) ? '0' + secs : secs
            };
        };

        function _getRemainigTime(referenceTime) {
            var currentDate = new Date();
            var now = moment(currentDate).utc();
            return moment(referenceTime) - now;
        }

        function _countDown(countDownTime) {
            var remain = _getRemainigTime(countDownTime);
            var duration = _duration(remain);
            var tmp = "";
            if (duration.days > 0) {
                tmp += duration.days + " 天 ";
            }
            var _tmp = "<span>" + _fill(duration.hours) + " </span>时<span>" + _fill(duration.minutes) + " </span>分<span>" + _fill(duration.seconds) + " </span>秒";
            if (duration.hours > 0) {
                tmp += _tmp;
            } else {
                if (duration.minutes > 0) {
                    tmp += tmp += _fill(duration.hours) + " 时 <span>" + _fill(duration.minutes) + " </span>分 <span>" + _fill(duration.seconds) + " </span>秒";
                } else {
                    if (duration.seconds > 0) {
                        tmp += _fill(duration.hours) + " 时 " + _fill(duration.minutes) + " 分 <span>" + _fill(duration.seconds) + " </span>秒";
                    } else {
                        tmp += _fill(duration.hours) + " 时 " + _fill(duration.minutes) + " 分 " + _fill(duration.seconds) + "秒";
                    }
                }
            }
            //tmp += _fill(duration.hours) + " 时 <span>" + _fill(duration.minutes) + "</span> 分 <span>" + _fill(duration.seconds) + "</span> 秒";
            return {
                "text": tmp,
                "date": duration
            };
        }

        function _fill(n, length) {
            n += "";
            if (n.length === 1) {
                n = "0" + n;
            }
            return n;
        }

        /**
         * example: _getFmtTimeStr(new Date(),"yyyy-MM-ddThh:mm:ss.SZ")
         * return: 2014-01-01T01:01:01.111Z"
         */
        function _getFmtTimeStr(date, fmt) {
            var o = {
                "M+": date.getMonth() + 1, // 月份
                "d+": date.getDate(), // 日
                "h+": date.getHours(), // 小时
                "m+": date.getMinutes(), // 分
                "s+": date.getSeconds(), // 秒
                "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
                "S": date.getMilliseconds()             //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        return {
            duration: _duration,
            getRemainigTime: _getRemainigTime,
            countDown: _countDown,
            getNextPublishTime: function (times) {
                var currentDate = new Date();
                var t = new Date(times[0])
                times = times.map(function (publishTime) {
                    var time = publishTime.time;
                    var tmp = time.split(":");
                    var t = _.cloneDeep(currentDate);
                    t.setHours(tmp[0]);
                    t.setMinutes(tmp[1]);
                    t.setSeconds(0);
                    publishTime.date = t;
                    return publishTime;
                });


                //for (var i = 0; i < times.length; i++) {
                //    var flag = false;
                //    flag = (i === 0 && times[0].date.getTime() >= currentDate.getTime()) ||
                //    (i === times.length - 1 && currentDate.getTime() >= times[i].date.getTime()) ||
                //    currentDate.getTime() > times[i].date.getTime() && (i + 1) <= times.length && currentDate.getTime() < times[i + 1].date.getTime();
                //    times[i].current = flag;
                //}

                //times = times.map(function (t) {
                //    var array = t.time.split(":");
                //    if (currentDate.getHours() === parseInt(array[0]) && currentDate.getMinutes() === parseInt(array[1])) {
                //        t.current = true;
                //    } else {
                //        t.current = false;
                //    }
                //    return t;
                //});

                for (var i = 0; i < times.length; i++) {
                    var arrayStart = times[i].time.split(":");
                    var arrayEnd = null;
                    if (i < times.length - 1) {
                        arrayEnd = times[i + 1].time.split(":");


                        if (currentDate.getHours() > parseInt(arrayStart[0]) && currentDate.getHours() < parseInt(arrayEnd[0])) {
                            times[i].current = true;
                        } else if ((currentDate.getHours() === parseInt(arrayStart[0]) && currentDate.getMinutes() >= parseInt(arrayStart[1]) )
                            || (currentDate.getHours() === parseInt(arrayEnd[0]) && currentDate.getMinutes() < parseInt(arrayEnd[1]))) {
                            times[i].current = true;
                        } else {
                            times[i].current = false;
                        }
                    } else {
                        if (currentDate.getHours() >= parseInt(arrayStart[0]) && currentDate.getMinutes() >= parseInt(arrayStart[1])) {
                            times[i].current = true;
                        } else {
                            times[i].current = false;
                        }
                    }

                }

                return _.find(times, function (publishTime) {
                    //var time = publishTime.date;
                    //var flag = (time.getTime() - currentDate.getTime()) > 0;
                    ////if (flag) {
                    ////    publishTime.current = true;
                    ////}
                    //return flag;
                    return (publishTime.date.getTime() - currentDate.getTime()) > 0
                });
            },
            getTzfmtTime: function (date, fmt) {
                return _getFmtTimeStr(date, fmt);
            }
        };
    });
