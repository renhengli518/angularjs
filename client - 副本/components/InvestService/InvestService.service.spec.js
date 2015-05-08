'use strict';

describe('Service: InvestService', function () {

  // load the service's module
  beforeEach(module('p2pClientApp'));

  // instantiate service
  var InvestService;
  beforeEach(inject(function (_InvestService_) {
    InvestService = _InvestService_;
  }));

  it('should do something', function () {
    expect(!!InvestService).toBe(true);
  });

});
