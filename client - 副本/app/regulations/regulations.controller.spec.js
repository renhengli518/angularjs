'use strict';

describe('Controller: RegulationsCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var RegulationsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RegulationsCtrl = $controller('RegulationsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
