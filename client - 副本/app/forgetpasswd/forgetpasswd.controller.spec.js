'use strict';

describe('Controller: ForgetpasswdCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var ForgetpasswdCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ForgetpasswdCtrl = $controller('ForgetpasswdCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
