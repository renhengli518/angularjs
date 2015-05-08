'use strict';

describe('Controller: AutoInvestCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var AutoInvestCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AutoInvestCtrl = $controller('AutoInvestCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
