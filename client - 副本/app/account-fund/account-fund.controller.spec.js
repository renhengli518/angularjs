'use strict';

describe('Controller: AccountFundCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var AccountFundCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountFundCtrl = $controller('AccountFundCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
