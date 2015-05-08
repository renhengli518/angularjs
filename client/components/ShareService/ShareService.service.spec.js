'use strict';

describe('Service: ShareService', function () {

    // load the service's module
    beforeEach(module('p2pClientApp'));

    // instantiate service
    var ShareService;
    beforeEach(inject(function (_ShareService_) {
        ShareService = _ShareService_;
    }));

    it('should do something', function () {
        expect(!!ShareService).toBe(true);
    });

});
