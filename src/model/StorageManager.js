exports = Class(function () {

	KEY_HIGH_SCORE = "high_score";
	KEY_SFX = "sfx";
	KEY_MUSIC = "music";

	this.init = function(opts) {
		this._gameData = {};
		this._key = CONFIG.appID + "_data";
        var storedData = localStorage.getItem(this._key);
        if(storedData) {
            this._gameData = JSON.parse(storedData);
        } else {
        	this._resetData();
        }
	};

	this._resetData = function() {
		this._gameData[KEY_HIGH_SCORE] = 0;
	};

	this.setData = function(key, val) {
		this._gameData[key] = val;
		localStorage.setItem(this._key, JSON.stringify(this._gameData));
	};

	this.getData = function(key) {
		return this._gameData[key];
	};
});
