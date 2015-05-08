'use strict';

describe('Controller: BuffetCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var BuffetCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BuffetCtrl = $controller('BuffetCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
