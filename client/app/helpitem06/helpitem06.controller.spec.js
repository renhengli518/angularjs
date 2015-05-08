'use strict';

describe('Controller: Helpitem06Ctrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var Helpitem06Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Helpitem06Ctrl = $controller('Helpitem06Ctrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
