'use strict';

describe('Controller: ProtocolCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var ProtocolCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProtocolCtrl = $controller('ProtocolCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
