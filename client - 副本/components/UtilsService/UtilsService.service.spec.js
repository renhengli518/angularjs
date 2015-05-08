'use strict';

describe('Service: UtilsService', function () {

  // load the service's module
  beforeEach(module('p2pClientApp'));

  // instantiate service
  var UtilsService;
  beforeEach(inject(function (_UtilsService_) {
    UtilsService = _UtilsService_;
  }));

  it('should do something', function () {
    expect(!!UtilsService).toBe(true);
  });

});
