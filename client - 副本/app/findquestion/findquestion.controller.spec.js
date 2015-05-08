'use strict';

describe('Controller: FindquestionCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var FindquestionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FindquestionCtrl = $controller('FindquestionCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
