'use strict';

describe('Controller: MessagesetCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var MessagesetCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MessagesetCtrl = $controller('MessagesetCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
