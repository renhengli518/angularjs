'use strict';

describe('Controller: AccountPacketCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var AccountPacketCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountPacketCtrl = $controller('AccountPacketCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
