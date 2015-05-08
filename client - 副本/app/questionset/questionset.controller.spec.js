'use strict';

describe('Controller: QuestionsetCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var QuestionsetCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuestionsetCtrl = $controller('QuestionsetCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
