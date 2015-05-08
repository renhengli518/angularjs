'use strict';

describe('Controller: Details01Ctrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var Details01Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Details01Ctrl = $controller('Details01Ctrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
