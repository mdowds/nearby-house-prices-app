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

function getData(outcode, callback) {

    var url = "/prices/" + outcode;

    $.get(url)
        .done(function(response) {

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
        })
        .fail(function(data){
            if(data.responseText == null)
            var error = JSON.parse(data.responseText).error;
            callback(null, url, error);
        });
}