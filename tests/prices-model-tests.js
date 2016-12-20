'use strict';
var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

var mockCoords = {
    latitude: 51.5,
    longitude: -0.5
};

describe('PricesModel', function() {

    it('Can be initialised', function() {
        var prices = require('../lib/prices-model');
        assert.isDefined(prices);
    });

    describe('getPricesData()', function () {

        it('Calls get with the correct URL', function () {

            var getStub = sinon.stub();
            var mockUtils = { get: getStub };
            var mockConfig = { apiUrl: ""};
            var prices = proxyquire('../lib/prices-model', {'./config': mockConfig, './utils': mockUtils});

            prices.getPricesData(mockCoords);
            assert.isTrue(getStub.calledWith("/prices/position?lat=" + mockCoords.latitude + "&long=" + mockCoords.longitude));
        });

        it('Returns the correct values', function (done) {

            var response = JSON.stringify({
                "areaName": "London",
                "averagePrice": 100,
                "detachedAverage": 101,
                "flatAverage": 102,
                "outcode": "WC2N",
                "pastAveragePrice": 0,
                "priceChange": 0,
                "semiDetachedAverage": 103,
                "terracedAverage": 104,
                "transactionCount": 105
            });

            var getStub = sinon.stub().callsArgWith(1, response, 200); // Call the second arg (1) passed to getStub as a callback, with other params as params for the callback
            var mockUtils = { get: getStub };
            var prices = proxyquire('../lib/prices-model', {'./utils': mockUtils});

            prices.getPricesData(mockCoords, function (error, model) {
                assert.equal(model.outcode, "WC2N");
                assert.equal(model.areaName, "London");
                assert.equal(model.averagePrice, 100);
                assert.equal(model.detachedAverage, 101);
                assert.equal(model.flatAverage, 102);
                assert.equal(model.semiDetachedAverage, 103);
                assert.equal(model.terracedAverage, 104);
                assert.equal(model.transactionCount, 105);

                done();
            });
        });

        it('Returns an error when API returns invalid request', function (done) {

            var response = JSON.stringify({ "error": "An error occured: no valid data returned"});

            var getStub = sinon.stub().callsArgWith(1, response, 500);
            var mockUtils = { get: getStub };
            var prices = proxyquire('../lib/prices-model', {'./utils': mockUtils});

            prices.getPricesData(mockCoords, function (error) {
                assert.isDefined(error);
                done();
            });
        });

        it('Returns an error when there is a HTTP error', function (done) {

            var getStub = sinon.stub().callsArgWith(1, null, 404);
            var mockUtils = { get: getStub };
            var prices = proxyquire('../lib/prices-model', {'./utils': mockUtils});

            prices.getPricesData(mockCoords, function (error) {
                assert.isDefined(error);
                done();
            });
        });
    });
});