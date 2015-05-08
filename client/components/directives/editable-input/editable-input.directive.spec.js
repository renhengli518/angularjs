'use strict';

describe('Directive: editableInput', function () {

  // load the directive's module and view
  beforeEach(module('p2pClientApp'));
  beforeEach(module('components/directives/editable-input/editable-input.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<editable-input></editable-input>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the editableInput directive');
  }));
});