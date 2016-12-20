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

            if(error != null) {
                callback(error, null);
                return;
            } else if(response.averagePrice == null){
                callback("No average price data", null);
                return;
            } else {
                var locationString;
                if(response.areaName == null){
                    locationString = response.outcode;
                } else {
                    locationString = response.outcode + " (" + response.areaName + ")";
                }
            }

            var returnElements = new viewElements(
                response.outcode,
                locationString,
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

function formatPrice(price) {
    return "£" + price.toLocaleString('en-GB');
}

module.exports = {
    updateViewElements: updateViewElements
};