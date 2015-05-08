'use strict';

describe('Controller: GradeCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var GradeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GradeCtrl = $controller('GradeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
