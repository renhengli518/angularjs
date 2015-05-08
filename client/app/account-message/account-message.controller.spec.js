'use strict';

describe('Controller: AccountMessageCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var AccountMessageCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountMessageCtrl = $controller('AccountMessageCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
