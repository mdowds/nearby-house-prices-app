'use strict';
var model = require('./prices-model');

var viewElements = function(errorElement, locationElement, averagePriceElement, transactionCountElement) {
    this.errorMessage = errorElement;
    this.location = locationElement;
    this.averagePrice = averagePriceElement;
    this.transactionCount = transactionCountElement;
};

var updateView = function (outcode, viewElements) {

    if(outcode){
        model.getPricesData(outcode, function(error, response){

            if(error != null || response.averagePrice == null){
                viewElements.errorMessage = "Sorry, an error has occurred"
                // $('#error-message').html("Sorry, an error has occurred");
            } else {

                var locationString;
                if(response.areaName == null){
                    locationString = outcode;
                } else {
                    locationString = outcode + " (" + response.areaName + ")";
                }

                // $('#location').html(locationString);
                viewElements.location = locationString;

                var formattedPrice = "£" + response.averagePrice.toLocaleString('en-GB');
                // $('#average-price').html(formattedPrice);
                viewElements.averagePrice = formattedPrice;

                // $('#transaction-count').html(response.transactionCount);
                viewElements.transactionCount = response.transactionCount;
            }
        });
    }
};

module.exports = {
    updateView: updateView,
    viewElements: viewElements
};