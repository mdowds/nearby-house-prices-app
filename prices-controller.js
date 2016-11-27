var PricesController = function(priceObj){
    this.prices = priceObj;

    this.updateView = function (outcode) {
        if(outcode){
            this.prices.getData(outcode, function(model, url, error){

                if(error != null || model.averagePrice == null){
                    $('#error-message').html("Sorry, an error has occured");
                } else {

                    var locationString;
                    if(model.areaName == null){
                        locationString = outcode;
                    } else {
                        locationString = outcode + " (" + model.areaName + ")";
                    }

                    $('#location').html(locationString);

                    var formattedPrice = "£" + model.averagePrice.toLocaleString('en-GB');
                    $('#average-price').html(formattedPrice);

                    $('#transaction-count').html(model.transactionCount);
                }
            });
        }
    };
};