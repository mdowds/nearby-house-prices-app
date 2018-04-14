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