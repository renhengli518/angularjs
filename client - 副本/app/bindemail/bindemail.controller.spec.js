'use strict';

describe('Controller: BindemailCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var BindemailCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BindemailCtrl = $controller('BindemailCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
