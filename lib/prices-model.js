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
