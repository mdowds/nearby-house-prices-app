'use strict';
var assert = require('chai').assert;
var atomus = require('atomus');
var sinon = require('sinon');
var proxyquire = require('proxyquire');

var pricesModel = require('../prices-model');

describe('PricesController', function() {

    beforeEach(function() {
        var browser = atomus()
            .html('<h2 id="location"></h2><div id="average-price"></div><div id="transaction-count"></div><div id="error-message"></div>')
            //.external('prices-model.js')
            .external('prices-controller.js');
    });

    it('Can be initialised', function() {
        var controller = require('../prices-controller');
        assert.isDefined(controller);
    });

    describe('updateView()', function () {

        it('Calls getPricesData() with outcode', function() {
            var getPricesDataStub = sinon.stub();
            var mockPricesModel = { getPricesData: getPricesDataStub };
            var controller = proxyquire('../prices-controller', {'./prices-model': mockPricesModel});

            controller.updateView("E17");
            assert.isTrue(getPricesDataStub.calledWith("E17"));
        });

        it('Does not call getPricesData() with no outcode', function() {
            var getPricesDataStub = sinon.stub();
            var mockPricesModel = { getPricesData: getPricesDataStub };
            var controller = proxyquire('../prices-controller', {'./prices-model': mockPricesModel});

            controller.updateView();
            assert.isFalse(getPricesDataStub.called);
        });

        it('Updates view with price data', function() {
            // Set up stub for prices-model
            var model = new pricesModel.createModel("E17", "London", 100000, 101000, 102000, 103000, 104000, 1000);

            var getPricesDataStub = function (outcode, callback) {
                callback(null, model)
            };

            var mockPricesModel = { getPricesData: getPricesDataStub };

            var controller = proxyquire('../prices-controller', {'./prices-model': mockPricesModel});

            //Set up stub for view elements
            var mockElements = new controller.viewElements();

            controller.updateView("E17", mockElements);
            assert.equal(mockElements.location, "E17 (London)");
            assert.equal(mockElements.averagePrice, "£100,000");
            assert.equal(mockElements.transactionCount, "1000");
        });

        it('Displays an error when averagePrice data is missing', function() {
            // Set up stub for prices-model
            var model = new pricesModel.createModel("E17", "London", null, 101000, 102000, 103000, 104000, 1000);

            var getPricesDataStub = function (outcode, callback) {
                callback(null, model)
            };

            var mockPricesModel = { getPricesData: getPricesDataStub };

            var controller = proxyquire('../prices-controller', {'./prices-model': mockPricesModel});

            //Set up stub for view elements
            var mockElements = new controller.viewElements();

            controller.updateView("E17", mockElements);

            assert.equal(mockElements.errorMessage, "Sorry, an error has occurred");
        });

        it('Omits area name when it is missing from data', function() {
            // Set up stub for prices-model
            var model = new pricesModel.createModel("E17", null, 100000, 101000, 102000, 103000, 104000, 1000);

            var getPricesDataStub = function (outcode, callback) {
                callback(null, model)
            };

            var mockPricesModel = { getPricesData: getPricesDataStub };

            var controller = proxyquire('../prices-controller', {'./prices-model': mockPricesModel});

            //Set up stub for view elements
            var mockElements = new controller.viewElements();

            controller.updateView("E17", mockElements);
            assert.equal(mockElements.location, "E17");
        });

        it('Handles getPricesData returning an error', function() {
            // Set up stub for prices-model
            var getPricesDataStub = function (outcode, callback) {
                callback("An error has occurred")
            };

            var mockPricesModel = { getPricesData: getPricesDataStub };

            var controller = proxyquire('../prices-controller', {'./prices-model': mockPricesModel});

            //Set up stub for view elements
            var mockElements = new controller.viewElements();

            controller.updateView("E17", mockElements);
            assert.equal(mockElements.errorMessage, "Sorry, an error has occurred");
        });

    });

});