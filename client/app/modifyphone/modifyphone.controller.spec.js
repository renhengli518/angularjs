'use strict';

describe('Controller: ModifyphoneCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var ModifyphoneCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModifyphoneCtrl = $controller('ModifyphoneCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
