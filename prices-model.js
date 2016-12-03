'use strict';
var get = require('./utils').get;

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

var getPricesData = function(outcode, callback) {
    var url = "/prices/" + outcode;

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

            callback(model, url);
        } else if (status === 500){
            var error = JSON.parse(response).error;
            callback(null, url, error);
        } else {
            var error = {"error": "An unhandled request error was returned with status " + status};
            callback(null, url, error);
        }
    });
};

module.exports = {
    getPricesData: getPricesData
};
