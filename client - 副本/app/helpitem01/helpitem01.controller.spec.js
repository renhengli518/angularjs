'use strict';

describe('Controller: Helpitem01Ctrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var Helpitem01Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Helpitem01Ctrl = $controller('Helpitem01Ctrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
