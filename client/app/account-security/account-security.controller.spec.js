'use strict';

describe('Controller: AccountSecurityCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var AccountSecurityCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountSecurityCtrl = $controller('AccountSecurityCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
