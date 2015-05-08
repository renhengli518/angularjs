'use strict';

describe('Directive: numberInput', function () {

  // load the directive's module and view
  beforeEach(module('p2pClientApp'));
  beforeEach(module('components/directives/number-input/number-input.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<number-input></number-input>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the numberInput directive');
  }));
});