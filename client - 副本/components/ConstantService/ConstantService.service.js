'use strict';

angular.module('p2pClientApp')
    .factory('ConstantService', function () {
        //return {
        //    "APIRoot": "/proxy/p2p/data/ws/rest",
        //    "ODataServicePath": "http://10.100.9.85/p2p/data/odata.svc/$metadata",
        //    "APIUrl": "/proxy"
        //};

        return {
            "APIRoot": function () {
                var location = window.location;
                var port = location.port && ":" + location.port;
                var base = "/p2p/data/ws/rest";
                return location.protocol + "//" + location.hostname + port + base;
            },
            "ODataServicePath": function () {
                var location = window.location;
                var port = location.port && ":" + location.port;
                var base = "/p2p/data/odata.svc/$metadata";
                return location.protocol + "//" + location.hostname + port + base;
            },
            "APIUrl": function () {
                var location = window.location;
                var port = location.port && ":" + location.port;
                return location.protocol + "//" + location.hostname + port;
            },
            "RouteUrl": function () {
            	var location = window.location;
            	var port = location.port && ":" + location.port;
            	var base = "/p2p/app";
            	return location.protocol + "//" + location.hostname + port + base;
            } 
        }
        //return {
//             "APIRoot": "http://10.100.9.85/p2p/data/ws/rest",
//             "ODataServicePath": "http://10.100.9.85/p2p/data/odata.svc/$metadata",
//             "APIUrl": "http://10.100.9.85",
//             "RouteUrl": "http://10.100.9.85/p2p/app"
//            //return {
        //    "APIRoot": "/proxy/p2p/data/ws/rest",
        //    "ODataServicePath": "http://10.100.9.85/p2p/data/odata.svc/$metadata",
        //    "APIUrl": "/proxy"
        //};
        //return {


    });
