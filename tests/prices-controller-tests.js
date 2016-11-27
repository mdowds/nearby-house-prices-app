'use strict';
var assert = require('chai').assert;
var atomus = require('atomus');
var sinon = require('sinon');

describe('PricesController', function() {

    var browser;

    beforeEach(function() {
        browser = atomus()
            .html('<h2 id="location"></h2><div id="average-price"></div><div id="transaction-count"></div><div id="error-message"></div>')
            .external('prices-model.js')
            .external('prices-controller.js');
    });

    it('Can be initialised', function(done) {
        browser.ready(function(errors, window) {
            var controller = new window.PricesController();

            assert.isDefined(controller);
            done();
        });
    });

    it('Initialises Prices', function(done) {
        browser.ready(function(errors, window) {
            var model = new window.Prices();
            var controller = new window.PricesController(model);

            assert.isDefined(controller.prices);
            done();
        });
    });

    describe('updateView()', function () {

        it('Calls Prices.getData() with outcode', function(done) {
            browser.ready(function(errors, window) {

                var model = new window.Prices();
                var getData = sinon.stub(model, "getData");
                var controller = new window.PricesController(model);

                controller.updateView("E17");

                assert.isTrue(getData.calledWith("E17"));

                getData.restore();
                done();
            });
        });

        it('Does not call Prices.getData() with no outcode', function(done) {
            browser.ready(function(errors, window) {

                var prices = new window.Prices();
                var getData = sinon.stub(prices, "getData");
                var controller = new window.PricesController(prices);

                controller.updateView();

                assert.isFalse(getData.called);

                getData.restore();
                done();
            });
        });

        it('Updates view with price data', function(done) {
            browser.ready(function(errors, window) {
                var $ = browser.$;
                var model = new window.PricesModel("E17", "London", 100000, 101000, 102000, 103000, 104000, 1000);

                var prices = new window.Prices();
                var getData = sinon.stub(prices, "getData");
                getData.callsArgWith(1, model); // Call the second arg passed to getData as a callback, with model as param passed to the callback
                var controller = new window.PricesController(prices);

                controller.updateView("E17");

                assert.equal($('#location').html(), "E17 (London)");
                assert.equal($('#average-price').html(), "£100,000");
                assert.equal($('#transaction-count').html(), "1000");

                getData.restore();
                done();
            });
        });

        it('Displays an error when averagePrice data is missing', function(done) {
            browser.ready(function(errors, window) {
                var $ = browser.$;
                var model = new window.PricesModel("E17", "London", null, 101000, 102000, 103000, 104000, 1000);

                var prices = new window.Prices();
                var getData = sinon.stub(prices, "getData");
                getData.callsArgWith(1, model);
                var controller = new window.PricesController(prices);

                controller.updateView("E17");

                assert.equal($('#error-message').html(), "Sorry, an error has occured");

                getData.restore();
                done();
            });
        });

        it('Omits area name when it is missing from data', function(done) {
            browser.ready(function(errors, window) {
                var $ = browser.$;
                var model = new window.PricesModel("E17", null, 100000, 101000, 102000, 103000, 104000, 1000);

                var prices = new window.Prices();
                var getData = sinon.stub(prices, "getData");
                getData.callsArgWith(1, model);
                var controller = new window.PricesController(prices);

                controller.updateView("E17");

                assert.equal($('#location').html(), "E17");

                getData.restore();
                done();
            });
        });

        it('Handles getData returning an error', function(done) {
            browser.ready(function(errors, window) {
                var $ = browser.$;

                var prices = new window.Prices();
                var getData = sinon.stub(prices, "getData");
                getData.callsArgWith(1, null, null, "An error has occured");
                var controller = new window.PricesController(prices);

                controller.updateView("E17");

                assert.equal($('#error-message').html(), "Sorry, an error has occured");

                getData.restore();
                done();
            });
        });

    });

});