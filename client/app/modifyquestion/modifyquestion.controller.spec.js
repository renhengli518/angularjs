'use strict';

describe('Controller: ModifyquestionCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var ModifyquestionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModifyquestionCtrl = $controller('ModifyquestionCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
