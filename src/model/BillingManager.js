exports = Class(function() {

	this.init = function() {
		BL.onPurchase = this.handlePurchase;
		BL.onFailure = this.handleFailure;
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
            GC.app.popup.openView({
                image: imageData.popups.no_ads
            });
        }
    };

    this.handleFailure = function(reason, item) {
    	AMP.track("purchaseFailure", {reason: reason});
    };
});