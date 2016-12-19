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
                callback(error, null);
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