/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var MainPage = function () {
    this.pageHeader = element(by.css('body > div > div:nth-child(3) > div.container.pr > h1 > span'));
    this.loginButton = element(by.css("body > div > div:nth-child(1) > div > div > div > ul:nth-child(3) > li.loginCol > a"))
};

module.exports = new MainPage();

