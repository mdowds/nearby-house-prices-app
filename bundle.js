(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    apiUrl: "http://localhost:5000",
    gmapsApiKey: "123456789"
};

},{}],2:[function(require,module,exports){
'use strict';
var controller = require('./prices-controller');
var appConfig = require('./config');

function getLocation(callback){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } else {
        handleError("Geolocation is not supported by this browser.");
    }
}

function getPricesForLocation(position) {
    controller.updateViewElements(position.coords, function (error, viewElements) {
        if(error){
            var message = "";
            if(typeof error == 'string'){
                message = error;
            }
            handleError(message);
            return;
        }

        document.getElementById('location').innerHTML = viewElements.location;
        document.getElementById('average-price').innerHTML = viewElements.averagePrice;
        document.getElementById('transaction-count').innerHTML = viewElements.transactionCount;

        document.getElementById('detached-average').innerHTML = viewElements.detachedAverage;
        document.getElementById('flat-average').innerHTML = viewElements.flatAverage;
        document.getElementById('semidetached-average').innerHTML = viewElements.semiDetachedAverage;
        document.getElementById('terraced-average').innerHTML = viewElements.terracedAverage;

        loadMap(viewElements.outcode);
    });
}

function loadMap(outcode) {

    var map = document.createElement('iframe');
    var url = "https://www.google.com/maps/embed/v1/place?key=" + appConfig.gmapsApiKey + "&q=" + outcode + "+UK";
    map.src = url;
    map.frameBorder = 0;
    map.style.border = 0;

    document.getElementById('map-spinner').style.display = 'none';
    document.getElementById('map').appendChild(map);
}

function handleError(message) {
    document.getElementById('error-message').innerHTML = message;
    document.getElementById('overlay').style.display = "block";
}

window.init = function() {
    getLocation(getPricesForLocation);
};

module.exports = {
    getPricesForLocation: getPricesForLocation
};
},{"./config":1,"./prices-controller":3}],3:[function(require,module,exports){
'use strict';
var model = require('./prices-model');

var viewElements = function(outcode, location, averagePrice, transactionCount, detached, flat, semiDetached, terraced) {
    this.outcode = outcode;
    this.location = location;
    this.averagePrice = averagePrice;
    this.transactionCount = transactionCount;

    this.detachedAverage = detached;
    this.flatAverage = flat;
    this.semiDetachedAverage = semiDetached;
    this.terracedAverage = terraced;
};

var updateViewElements = function (coords, callback) {

    if(coords){
        model.getPricesData(coords, function(error, response){

            var responseError = checkForErrors(error, response);
            if(responseError != null){
                callback(responseError, null);
                return;
            }

            var returnElements = new viewElements(
                response.outcode,
                formatLocationString(response.areaName, response.outcode),
                formatPrice(response.averagePrice),
                response.transactionCount,
                formatPrice(response.detachedAverage),
                formatPrice(response.flatAverage),
                formatPrice(response.semiDetachedAverage),
                formatPrice(response.terracedAverage)
            );

            callback(null, returnElements);
        });
    }
};

function checkForErrors(error, response) {
    if(error != null) {
        return error;
    } else if(response.averagePrice == null){
        return "No average price data";
    } else {
        return null;
    }
}

function formatLocationString(areaName, outcode){
    if(areaName == null){
        return outcode;
    } else {
        return outcode + " (" + areaName + ")";
    }
}

function formatPrice(price) {
    if(price == null){
        return "No data";
    }

    return "£" + price.toLocaleString('en-GB');
}

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
