'use strict';
var model = require('./prices-model');

var viewElements = function(outcode, location, averagePrice, transactionCount) {
    this.outcode = outcode;
    this.location = location;
    this.averagePrice = averagePrice;
    this.transactionCount = transactionCount;
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

                var formattedPrice = "£" + response.averagePrice.toLocaleString('en-GB');
            }

            var returnElements = new viewElements(response.outcode, locationString, formattedPrice, response.transactionCount);

            callback(null, returnElements);
        });
    }
};

module.exports = {
    updateViewElements: updateViewElements
};