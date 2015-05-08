'use strict';

describe('Service: DateTimeService', function () {

  // load the service's module
  beforeEach(module('p2pClientApp'));

  // instantiate service
  var DateTimeService;
  beforeEach(inject(function (_DateTimeService_) {
    DateTimeService = _DateTimeService_;
  }));

  it('should do something', function () {
    expect(!!DateTimeService).toBe(true);
  });

});
