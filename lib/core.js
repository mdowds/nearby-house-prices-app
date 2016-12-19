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
            if(typeof error == 'string'){
                document.getElementById('error-message').innerHTML = error;
            }
            document.getElementById('overlay').style.display = "block";
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