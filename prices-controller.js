var PricesController = function(priceObj){
    this.prices = priceObj;

    this.updateView = function (outcode) {
        if(outcode){
            this.prices.getData(outcode, function(model, url){
                $('#location').html(model.areaName);

                var formattedPrice = "£" + model.averagePrice.toLocaleString('en-GB');
                $('#average-price').html(formattedPrice);

                $('#transaction-count').html(model.transactionCount);
            });
        }
    };
};