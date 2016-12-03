// 'use strict';
// var assert = require('chai').assert;
// var atomus = require('atomus');
// var sinon = require('sinon');
//
// describe('Core', function() {
//     var browser;
//
//     beforeEach(function() {
//         browser = atomus()
//             .html('<h2 id="location"></h2><div id="average-price"></div><div id="transaction-count"></div><div id="error-message"></div>')
//             .external('core.js');
//     });
//
//     describe('getOutcode()', function () {
//
//         // Asks for location
//         // Gets outcode for location
//         // Calls updateView
//
//         it('Asks for device location', function(done) {
//             browser.ready(function(errors, window) {
//                 window.navigator.geolocation = {};
//                 window.navigator.geolocation.getCurrentPosition = function(callback){
//                     var mockPosition;
//                     mockPosition.coords.latitude = 51.5;
//                     mockPosition.coords.longitude = -0.5;
//
//                     callback(mockPosition);
//                 };
//
//                 window.getLocation(function(position){
//                     assert.equal(position, mockPosition);
//                     done();
//                 });
//             });
//         });
//     });
// });