'use strict';

describe('Directive: loadingIndicator', function () {

    // load the directive's module and view
    beforeEach(module('p2pClientApp'));
    beforeEach(module('components/loadingIndicator/loadingIndicator.html'));

    var element, scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
        element = angular.element('<loading-indicator></loading-indicator>');
        element = $compile(element)(scope);
        scope.$apply();
        expect(element.text()).toBe('this is the loadingIndicator directive');
    }));
});
