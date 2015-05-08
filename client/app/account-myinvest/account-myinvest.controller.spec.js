'use strict';

describe('Controller: AccountMyinvestCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var AccountMyinvestCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountMyinvestCtrl = $controller('AccountMyinvestCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
