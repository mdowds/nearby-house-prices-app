(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    apiUrl: "http://localhost:5000"
};
},{}],2:[function(require,module,exports){
'use strict';
var controller = require('./prices-controller');

function getLocation(callback){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } else {
        document.getElementById('error-message').innerHTML = "Geolocation is not supported by this browser.";
    }
}

function getPricesForLocation(position) {
    controller.updateViewElements(position.coords, function (error, viewElements) {
        if(error){
            document.getElementById('error-message').innerHTML = error;
            return;
        }

        document.getElementById('location').innerHTML = viewElements.location;
        document.getElementById('average-price').innerHTML = viewElements.averagePrice;
        document.getElementById('transaction-count').innerHTML = viewElements.transactionCount;
    });
}

window.init = function() {
    getLocation(getPricesForLocation);
};

module.exports = {
    getPricesForLocation: getPricesForLocation
};
},{"./prices-controller":3}],3:[function(require,module,exports){
'use strict';
var model = require('./prices-model');

var viewElements = function(locationElement, averagePriceElement, transactionCountElement) {
    this.location = locationElement;
    this.averagePrice = averagePriceElement;
    this.transactionCount = transactionCountElement;
};

var updateViewElements = function (coords, callback) {

    if(coords){
        model.getPricesData(coords, function(error, response){

            if(error != null || response.averagePrice == null){
                callback("Sorry, an error has occurred", null);
                return;
            } else {
                var locationString;
                if(response.areaName == null){
                    locationString = response.outcode;
                } else {
                    locationString = response.outcode + " (" + response.areaName + ")";
                }

                var formattedPrice = "£" + response.averagePrice.toLocaleString('en-GB');
            }

            var returnElements = new viewElements(locationString, formattedPrice, response.transactionCount);

            callback(null, returnElements);
        });
    }
};

module.exports = {
    updateViewElements: updateViewElements
};
},{"./prices-model":4}],4:[function(require,module,exports){
'use strict';
var get = require('./utils').get;
var appConfig = require('./config');

var PricesModel = function(outcode, areaName, averagePrice, detachedAverage, flatAverage, semiDetachedAverage, terracedAverage, transactionCount) {

    this.outcode = outcode;
    this.areaName = areaName;
    this.averagePrice = averagePrice;
    this.detachedAverage = detachedAverage;
    this.flatAverage = flatAverage;
    this.semiDetachedAverage = semiDetachedAverage;
    this.terracedAverage = terracedAverage;
    this.transactionCount = transactionCount;
};

var getPricesData = function(coords, callback) {

    var url = appConfig.apiUrl + "/prices/position?lat=" + coords.latitude + "&long=" + coords.longitude;

    get(url, function (response, status) {
        if (status === 200) {
            var data = JSON.parse(response);
            var model = new PricesModel(
                data.outcode,
                data.areaName,
                data.averagePrice,
                data.detachedAverage,
                data.flatAverage,
                data.semiDetachedAverage,
                data.terracedAverage,
                data.transactionCount
            );

            callback(null, model);
        } else if (status === 400){
            var error = JSON.parse(response).errors;
            callback(error);
        } else {
            var error = {"error": "An unhandled request error was returned with status " + status};
            callback(error);
        }
    });
};

module.exports = {
    getPricesData: getPricesData,
    createModel: PricesModel
};

},{"./config":1,"./utils":5}],5:[function(require,module,exports){
var get = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function(){
        if(xhr.readyState ==  4){
            callback(xhr.responseText, xhr.status);
        }
    };
    xhr.send();
};

module.exports = {
    get: get
};
},{}]},{},[2]);
