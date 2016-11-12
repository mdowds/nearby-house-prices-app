'use strict';
var assert = require('chai').assert;
var sinon = require('sinon')

describe('PricesModel', function() {

    beforeEach(function() {
        //var PricesModel = require('../prices-model.js');
        //this.model = PricesModel;
        var t = require('../prices-model.js');
        this.model = new PricesModel()

        this.ajaxRequest = sinon.useFakeXMLHttpRequest();

        this.requests = [];
        this.ajaxRequest.onCreate = function(xhr) {
            this.requests.push(xhr);
        }.bind(this);
    });

    afterEach(function() {
        this.ajaxRequest.restore();
    });

    it('should exist', function() {
        var PricesModel = require('../prices-model.js');

        assert.isNotNull(this.model)
    });

    describe('#getData()', function () {

        it('should parse fetched data as JSON', function(done) {
            var data = { foo: 'bar' };
            var dataJson = JSON.stringify(data);

            this.model.getData(function(err, result) {
                assert.deepEqual(result, data)
                done();
            });

            // Mocks the server response: response-type, content-type, result data
            this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);
        });
    });


});