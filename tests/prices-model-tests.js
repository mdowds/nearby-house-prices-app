'use strict';
var assert = require('chai').assert;
var atomus = require('atomus');
var prices = require('../prices-model.js');

describe('Prices-Model', function() {

    var browser;

    var mockups = [
        {
            url: '/prices/E17',
            response: {
                status: 200,
                responseText: JSON.stringify({
                    "areaName": "London",
                    "averagePrice": 100,
                    "detachedAverage": 101,
                    "flatAverage": 102,
                    "outcode": "E17",
                    "pastAveragePrice": 0,
                    "priceChange": 0,
                    "semiDetachedAverage": 103,
                    "terracedAverage": 104,
                    "transactionCount": 105
                })
            }
        },
        {
            url: '/prices/invalid',
            response: {
                status: 500,
                responseText: JSON.stringify({ "error": "An error occured: no valid data returned"})
            }
        },
        {
            url: '/prices/missing',
            response: JSON.stringify({
                "averagePrice": 100,
                "detachedAverage": 101,
                "flatAverage": 102,
                "outcode": "E17",
                "pastAveragePrice": 0,
                "priceChange": 0,
                "semiDetachedAverage": 103,
                "terracedAverage": 104,
                "transactionCount": 105
            })
        },
        {
            url: '/prices/httperror',
            response: {
                status: 404
            }
        }
    ];

    beforeEach(function() {
        browser = atomus().external('prices-model.js');
    });

    it('Can be initialised', function() {
        assert.isDefined(prices);
    });

    describe('getPricesData()', function () {

        it('Makes an AJAX request', function (done) {

            var requestMade = false;

            browser.ready(function (errors, window) {
                browser.addXHRMock(mockups);

                prices.getPricesData("E17", function () {
                    requestMade = true;
                    assert.isTrue(requestMade);
                    done();
                });
            });
        });

        it('Calls the correct URL', function (done) {

            browser.ready(function (errors, window) {
                browser.addXHRMock(mockups);

                prices.getPricesData("E17", function (result, url) {
                    assert.equal(url, "/prices/E17");
                    done();
                });
            });
        });

        it('Returns the correct values', function (done) {

            browser.ready(function (errors, window) {
                browser.addXHRMock(mockups);

                prices.getPricesData("E17", function (model, url) {
                    assert.equal(model.outcode, "E17");
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
        });

        it('Returns an error when given an invalid request', function (done) {

            browser.ready(function (errors, window) {
                browser.addXHRMock(mockups);

                prices.getPricesData("invalid", function (model, url, error) {
                    assert.isDefined(error);
                    done();
                });
            });
        });

        it('Returns an error when there is a HTTP error', function (done) {

            browser.ready(function (errors, window) {
                browser.addXHRMock(mockups);

                prices.getPricesData("httperror", function (model, url, error) {
                    assert.isDefined(error);
                    done();
                });
            });
        });
    });
});