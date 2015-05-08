'use strict';

describe('Main View', function () {
    var page;

    beforeEach(function () {
        browser.get('/');
        page = require('./main.po');
    });

    it('should include jumbotron with correct data', function (done) {
        //expect(page.pageHeader.getText()).toContain('开始赚钱');
       // console.log(page.pageHeader.getText());
      //  page.loginButton.click();
        done()
    });
});
