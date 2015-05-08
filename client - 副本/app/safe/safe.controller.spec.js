'use strict';

describe('Controller: SafeCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var SafeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SafeCtrl = $controller('SafeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
