'use strict';

describe('Controller: Details02Ctrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var Details02Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Details02Ctrl = $controller('Details02Ctrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
