'use strict';

describe('Controller: ModifypwdCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var ModifypwdCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModifypwdCtrl = $controller('ModifypwdCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
