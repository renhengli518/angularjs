'use strict';

describe('Controller: HelpitemCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var HelpitemCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HelpitemCtrl = $controller('HelpitemCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
