'use strict';

describe('Controller: AnnouncementdetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('p2pClientApp'));

  var AnnouncementdetailsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AnnouncementdetailsCtrl = $controller('AnnouncementdetailsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
