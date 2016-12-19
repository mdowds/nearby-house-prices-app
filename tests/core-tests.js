'use strict';
var assert = require('chai').assert;
var sinon = require('sinon');
var jsdom = require("jsdom");
var fs = require("fs");
var proxyquire = require('proxyquire');

var pricesController = require('../lib/prices-controller');

// jsdom setup
var core = fs.readFileSync("./lib/core.js", "utf-8");
var jsdomFeatures = {
    FetchExternalResources : ['script'],
    ProcessExternalResources : ['script']
};

// Mocks
var mockHTML = '<h2 id="location"></h2><div id="average-price"></div><div id="transaction-count"></div><div id="overlay" style="display: none"><div id="error-message"></div></div>';

var mockPosition = {
    coords: { latitude: 51.5, longitude: -0.5}
};

var mockViewElements = {
    location: "WC2N (London)",
    averagePrice: "£100,000",
    transactionCount: "1000"
};

describe('Core', function() {

    describe('getLocation()', function () {

        it('Asks for device location', function(done) {
            jsdom.env({
                html: mockHTML,
                src: [core],
                features : jsdomFeatures,
                done: function (err, window) {
                    window.navigator.geolocation = {};
                    window.navigator.geolocation.getCurrentPosition = function (callback) {
                        callback(mockPosition);
                    };

                    window.getLocation(function (position) {
                        assert.equal(position, mockPosition);
                        done();
                    });
                }
            });
        });
    });

    describe('getPricesForLocation()', function () {

        it('Calls updateViewElements() with position data and view elements', function(done) {
            jsdom.env({
                html: mockHTML,
                src: [core],
                features : jsdomFeatures,
                done: function (err, window) {
                    var updateViewElementsStub = sinon.stub();
                    window.controller = { updateViewElements: updateViewElementsStub };;

                    window.getPricesForLocation(mockPosition);
                    assert.isTrue(updateViewElementsStub.calledWith(mockPosition.coords));
                    done();
                }
            });
        });

        it('Updates HTML with viewElement data', function (done) {
            jsdom.env({
                html: mockHTML,
                src: [core],
                features : jsdomFeatures,
                done: function (err, window) {
                    window.controller = { updateViewElements: function (coords, callback) {
                        callback(null, mockViewElements);
                    }};

                    window.getPricesForLocation(mockPosition);

                    assert.equal(window.document.getElementById('location').innerHTML, mockViewElements.location);
                    assert.equal(window.document.getElementById('average-price').innerHTML, mockViewElements.averagePrice);
                    assert.equal(window.document.getElementById('transaction-count').innerHTML, mockViewElements.transactionCount);

                    done();
                }
            });
        });

        it('Makes overlay visible when error returned from controller', function (done) {
            jsdom.env({
                html: mockHTML,
                src: [core],
                features : jsdomFeatures,
                done: function (err, window) {
                    var errString = "Sorry, an error has occurred";

                    window.controller = { updateViewElements: function (coords, callback) {
                        callback(errString, null);
                    }};

                    window.getPricesForLocation(mockPosition);

                    assert.equal(window.document.getElementById('overlay').style.display, "block");

                    done();
                }
            });
        });

        it('Displays error message returned from controller', function (done) {
            jsdom.env({
                html: mockHTML,
                src: [core],
                features : jsdomFeatures,
                done: function (err, window) {
                    var errString = "Sorry, an error has occurred";

                    window.controller = { updateViewElements: function (coords, callback) {
                        callback(errString, null);
                    }};

                    window.getPricesForLocation(mockPosition);

                    assert.equal(window.document.getElementById('error-message').innerHTML, errString);

                    done();
                }
            });
        });

    });
});