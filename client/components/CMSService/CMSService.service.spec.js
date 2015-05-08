'use strict';

describe('Service: CMSService', function () {

    // load the service's module
    beforeEach(module('p2pClientApp'));

    // instantiate service
    var CMSService;
    beforeEach(inject(function (_CMSService_) {
        CMSService = _CMSService_;
    }));

    it('should do something', function () {
        expect(!!CMSService).toBe(true);
    });

});
