'use strict';

describe('Directive: investButton', function () {

  // load the directive's module and view
  beforeEach(module('p2pClientApp'));
  beforeEach(module('components/directives/invest-button/invest-button.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<invest-button></invest-button>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the investButton directive');
  }));
});