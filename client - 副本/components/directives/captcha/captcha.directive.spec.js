'use strict';

describe('Directive: captcha', function () {

  // load the directive's module and view
  beforeEach(module('p2pClientApp'));
  beforeEach(module('components/directives/captcha/captcha.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<captcha></captcha>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the captcha directive');
  }));
});