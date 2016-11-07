var app = require('../app');
var supertest = require('supertest');
// cheerio a library used to parse response HTML
var cheerio = require('cheerio');

describe('html response',function () {
    var request;
    beforeEach(function () {
        request = supertest(app)
            .get('/')
            .set('User-Agent', 'my cool browser')
            .set('Accept', 'text/plain')
    });
    it('returns an HTML response', function(done){
        request
            .expect('Content-Type', /html/)
            .expect(200)
            .end(done);
    });

});