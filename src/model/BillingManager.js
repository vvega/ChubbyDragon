exports = Class(function() {
    var _purchaseHandlers;

	this.init = function() {
		BL.onPurchase = this.handlePurchase;
		BL.onFailure = this.handleFailure;
        _purchaseHandlers =  {
            "no_ads" : function() {
                GC.app.ads = false;
                storageManager.setData(KEY_ADS, false);
                GC.app.titleScreen.restoreButton.style.visible = false;
                GC.app.gameOverScreen.purchaseButton.style.visible = false;
                GC.app.popup.openView({
                    image: imageData.popups.no_ads
                });
            }
        };
	};

    this.handlePurchase = function(item) {
        var handler = _purchaseHandlers[item];
        if (typeof handler === "function") {
            handler();
        }
    };

    this.handleFailure = function(reason, item) {
    	AMP.track("purchaseFailure", {reason: reason});
    };
});