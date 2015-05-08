'use strict';

describe('Controller: Helpitem05Ctrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var Helpitem05Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Helpitem05Ctrl = $controller('Helpitem05Ctrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
