'use strict';

describe('Service: AccountFundService', function () {

  // load the service's module
  beforeEach(module('p2pClientApp'));

  // instantiate service
  var AccountFundService;
  beforeEach(inject(function (_AccountFundService_) {
    AccountFundService = _AccountFundService_;
  }));

  it('should do something', function () {
    expect(!!AccountFundService).toBe(true);
  });

});
