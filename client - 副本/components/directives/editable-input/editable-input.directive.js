'use strict';

angular.module('p2pClientApp')
    .directive('editableInput', function () {
        return {
            templateUrl: 'components/directives/editable-input/editable-input.html',
            restrict: 'EA',
            scope:{},
            link: function (scope, element, attrs) {
                scope.t = attrs["d"];
            }
        };
    });
