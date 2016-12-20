'use strict';
var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

var pricesModel = require('../lib/prices-model');
var pricesController = require('../lib/prices-controller');

var mockCoords = {
    latitude: 51.5,
    longitude: -0.5
};

describe('PricesController', function() {

    it('Can be initialised', function() {
        assert.isDefined(pricesController);
    });

    describe('updateViewElements()', function () {

        it('Calls getPricesData() with coords', function() {
            var getPricesDataStub = sinon.stub();
            var mockPricesModel = { getPricesData: getPricesDataStub };
            var controller = proxyquire('../lib/prices-controller', {'./prices-model': mockPricesModel});

            controller.updateViewElements(mockCoords);
            assert.isTrue(getPricesDataStub.calledWith(mockCoords));
        });

        it('Does not call getPricesData() with no coords', function() {
            var getPricesDataStub = sinon.stub();
            var mockPricesModel = { getPricesData: getPricesDataStub };
            var controller = proxyquire('../lib/prices-controller', {'./prices-model': mockPricesModel});

            controller.updateViewElements();
            assert.isFalse(getPricesDataStub.called);
        });

        it('Calls callback with updated viewElements', function(done) {
            var model = new pricesModel.createModel("WC2N", "London", 100000, 101000, 102000, 103000, 104000, 1000);

            var getPricesDataStub = function (coords, callback) {
                callback(null, model)
            };

            var mockPricesModel = { getPricesData: getPricesDataStub };

            var controller = proxyquire('../lib/prices-controller', {'./prices-model': mockPricesModel});

            controller.updateViewElements(mockCoords, function (error, elements) {
                assert.equal(elements.outcode, "WC2N");
                assert.equal(elements.location, "WC2N (London)");
                assert.equal(elements.averagePrice, "£100,000");
                assert.equal(elements.transactionCount, "1000");
                assert.equal(elements.detachedAverage, "£101,000");
                assert.equal(elements.flatAverage, "£102,000");
                assert.equal(elements.semiDetachedAverage, "£103,000");
                assert.equal(elements.terracedAverage, "£104,000");
                done();
            });
        });

        it('Calls callback with error message when averagePrice data is missing', function(done) {
            var model = new pricesModel.createModel("WC2N", "London", null, 101000, 102000, 103000, 104000, 1000);

            var getPricesDataStub = function (coords, callback) {
                callback(null, model)
            };

            var mockPricesModel = { getPricesData: getPricesDataStub };

            var controller = proxyquire('../lib/prices-controller', {'./prices-model': mockPricesModel});

            controller.updateViewElements(mockCoords, function (error) {
                assert.isNotNull(error);
                done();
            });
        });

        it('Omits area name when it is missing from data', function(done) {
            var model = new pricesModel.createModel("WC2N", null, 100000, 101000, 102000, 103000, 104000, 1000);

            var getPricesDataStub = function (coords, callback) {
                callback(null, model)
            };

            var mockPricesModel = { getPricesData: getPricesDataStub };

            var controller = proxyquire('../lib/prices-controller', {'./prices-model': mockPricesModel});

            controller.updateViewElements(mockCoords, function (error, elements) {
                assert.equal(elements.location, "WC2N");
                done();
            });

        });

        it('Handles getPricesData returning an error', function(done) {
            var getPricesDataStub = function (coords, callback) {
                callback("An error has occurred")
            };

            var mockPricesModel = { getPricesData: getPricesDataStub };

            var controller = proxyquire('../lib/prices-controller', {'./prices-model': mockPricesModel});

            controller.updateViewElements(mockCoords, function (error) {
                assert.isNotNull(error);
                done();
            });
        });

    });

});