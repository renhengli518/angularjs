'use strict';

describe('Controller: RegprotocolCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var RegprotocolCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegprotocolCtrl = $controller('RegprotocolCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
