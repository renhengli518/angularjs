'use strict';

describe('Controller: ApplyCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var ApplyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApplyCtrl = $controller('ApplyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
