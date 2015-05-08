'use strict';

describe('Controller: OdataTestCtrl', function () {

    // load the controller's module
    beforeEach(module('p2pClientApp'));

    var OdataTestCtrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        OdataTestCtrl = $controller('OdataTestCtrl', {
            $scope: scope
        });
    }));

    it('should ...', function () {
        expect(1).toEqual(1);
    });
});
