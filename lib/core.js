'use strict';
var controller = require('./prices-controller');

function getLocation(callback){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } else {
        // x.innerHTML = "Geolocation is not supported by this browser.";
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

module.exports = {
    getPricesForLocation: getPricesForLocation
};