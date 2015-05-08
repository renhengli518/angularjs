'use strict';

describe('Service: CapitalService', function () {

  // load the service's module
  beforeEach(module('p2pClientApp'));

  // instantiate service
  var CapitalService;
  beforeEach(inject(function (_CapitalService_) {
    CapitalService = _CapitalService_;
  }));

  it('should do something', function () {
    expect(!!CapitalService).toBe(true);
  });

});
