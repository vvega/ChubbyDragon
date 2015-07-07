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
                GC.app.gameOverScreen.purchaseButton.disabled = false;
                !GC.app.gameScreen.gameStarted && GC.app.popup.openView({
                    image: imageData.ui.popups.no_ads
                });
                AMP.track("purchaseSuccess", {player: GC.app.loggedInPlayer, ads: GC.app.ads});
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
        !GC.app.gameScreen.gameStarted && GC.app.popup.openView({
            text: "Unable to purchase item."
        });
        GC.app.gameOverScreen.purchaseButton.disabled = false;
    };
});