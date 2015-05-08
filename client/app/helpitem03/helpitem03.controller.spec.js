'use strict';

describe('Controller: Helpitem03Ctrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var Helpitem03Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Helpitem03Ctrl = $controller('Helpitem03Ctrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
