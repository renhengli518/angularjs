'use strict';

describe('Service: AccountMessageService', function () {

  // load the service's module
  beforeEach(module('p2pClientApp'));

  // instantiate service
  var AccountMessageService;
  beforeEach(inject(function (_AccountMessageService_) {
    AccountMessageService = _AccountMessageService_;
  }));

  it('should do something', function () {
    expect(!!AccountMessageService).toBe(true);
  });

});
