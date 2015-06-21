exports = Class(function() {

	this.init = function() {
		BL.onPurchase = this.handlePurchase;
		BL.onFailure = this.handleFailure;
		GC.app.ads && BL.restore(function(err) {
		    if (err) {
		        logger.log("Unable to restore purchases:", err);
		    } else {
		        logger.log("Finished restoring purchases!");
    		}
		});
	};

    this.handlePurchase = function(item) {
        var handler = this.purchaseHandlers[item];
        if (typeof handler === "function") {
            handler();
        }
    };

    this.purchaseHandlers = {
        "no_ads" : function() {
            GC.app.ads = false;
            storageManager.setData(KEY_ADS, false);
        }
    };

    this.handleFailure = function(reason, item) {
    	if (reason !== "cancel") {
        	// Market is unavailable - User should turn off Airplane mode or find reception.
    	}
    	AMP.track("purchaseFailure", {reason: reason});
    	// Else: Item purchase canceled - No need to present a dialog in response.
    };

});