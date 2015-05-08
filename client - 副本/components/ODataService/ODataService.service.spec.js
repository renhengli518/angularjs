'use strict';

describe('Service: ODataService', function () {

  // load the service's module
  beforeEach(module('p2pClientApp'));

  // instantiate service
  var ODataService;
  beforeEach(inject(function (_ODataService_) {
    ODataService = _ODataService_;
  }));

  it('should do something', function () {
    expect(!!ODataService).toBe(true);
  });

});
