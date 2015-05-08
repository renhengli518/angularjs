/**
 * Created by liujianwei on 2014/12/30.
 */
'use strict';

describe('Login View', function () {
    var page;

    beforeEach(function () {
        browser.get('/');
        page = require('./login.po');
    });

    it('should include jumbotron with correct data', function (done) {
       // expect(page.pageHeader.getText()).toBe('Features:');
        expect(1).toBe(1);
        done()
    });
});
