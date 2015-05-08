'use strict';

describe('Controller: ModifyemailCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var ModifyemailCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModifyemailCtrl = $controller('ModifyemailCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
