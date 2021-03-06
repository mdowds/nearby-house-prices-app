'use strict';
var controller = require('./prices-controller');

function getLocation(callback, gmapsApiKey){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            callback(position, gmapsApiKey)
        });
    } else {
        handleError("Geolocation is not supported by this browser.");
    }
}

function getPricesForLocation(position, gmapsApiKey) {
    controller.updateViewElements(position.coords, function (error, viewElements) {
        if(error){
            var message = "";
            if(typeof error === 'string'){
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

        loadMap(viewElements.outcode, gmapsApiKey);
    });
}

function loadMap(outcode, gmapsApiKey) {
    var map = document.createElement('iframe');
    map.src = "https://www.google.com/maps/embed/v1/place?key=" + gmapsApiKey + "&q=" + outcode + "+United+Kingdom";
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
    var gmapsApiKey = process.env.GMAPS_API_KEY;
    getLocation(getPricesForLocation, gmapsApiKey);
};

module.exports = {
    getPricesForLocation: getPricesForLocation
};