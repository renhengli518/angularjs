'use strict';

describe('Service: FinanceService', function () {

  // load the service's module
  beforeEach(module('p2pClientApp'));

  // instantiate service
  var FinanceService;
  beforeEach(inject(function (_FinanceService_) {
    FinanceService = _FinanceService_;
  }));

  it('should do something', function () {
    expect(!!FinanceService).toBe(true);
  });

});
