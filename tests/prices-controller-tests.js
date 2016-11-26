'use strict';
var assert = require('chai').assert;
var atomus = require('atomus');
var sinon = require('sinon');

describe('PricesController', function() {

    var browser;

    beforeEach(function() {
        browser = atomus()
            .html('<h2 id="location"></h2><div id="average-price"></div><div id="transaction-count"></div>')
            .external('prices-controller.js');
    });

    afterEach(function() {

    });

    it('Can be initialised', function() {
        browser.ready(function(errors, window) {
            var controller = new window.PricesController();
            assert.isDefined(controller);
        });
    });

    // Triggered by event & calls getData with outcode
    // Updates location header
    // Updates average price
    // Updates transaction count
});