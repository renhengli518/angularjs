'use strict';

describe('Filter: moneyFormat', function () {

  // load the filter's module
  beforeEach(module('p2pClientApp'));

  // initialize a new instance of the filter before each test
  var moneyFormat;
  beforeEach(inject(function ($filter) {
    moneyFormat = $filter('moneyFormat');
  }));

  it('should return the input prefixed with "moneyFormat filter:"', function () {
    var text = 'angularjs';
    expect(moneyFormat(text)).toBe('moneyFormat filter: ' + text);
  });

});
