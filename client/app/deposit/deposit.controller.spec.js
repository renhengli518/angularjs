'use strict';

describe('Controller: DepositCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var DepositCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DepositCtrl = $controller('DepositCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
