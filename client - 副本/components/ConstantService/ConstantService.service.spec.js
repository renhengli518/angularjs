'use strict';

describe('Service: ConstantService', function () {

    // load the service's module
    beforeEach(module('p2pClientApp'));

    // instantiate service
    var ConstantService;
    beforeEach(inject(function (_ConstantService_) {
        ConstantService = _ConstantService_;
    }));

    it('should do something', function () {
        expect(!!ConstantService).toBe(true);
    });

});
