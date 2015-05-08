'use strict';

describe('Filter: chineseNumber', function () {

  // load the filter's module
  beforeEach(module('p2pClientApp'));

  // initialize a new instance of the filter before each test
  var chineseNumber;
  beforeEach(inject(function ($filter) {
    chineseNumber = $filter('chineseNumber');
  }));

  it('should return the input prefixed with "chineseNumber filter:"', function () {
    var text = 'angularjs';
    expect(chineseNumber(text)).toBe('chineseNumber filter: ' + text);
  });

});
