'use strict';

describe('Controller: InvestCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var AccountInvestCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountInvestCtrl = $controller('InvestCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
