'use strict';

describe('Controller: OnetouchCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var OnetouchCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OnetouchCtrl = $controller('OnetouchCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
