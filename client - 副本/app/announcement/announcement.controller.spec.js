'use strict';

describe('Controller: AnnouncementCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var AnnouncementCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnnouncementCtrl = $controller('AnnouncementCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
