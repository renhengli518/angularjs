'use strict';

describe('Controller: Helpitem04Ctrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var Helpitem04Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Helpitem04Ctrl = $controller('Helpitem04Ctrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
