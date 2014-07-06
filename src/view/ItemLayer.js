import src.view.ParallaxView as ParallaxView;

exports = Class(ParallaxView.Layer, function(supr){

	var BAD_ITEM_MODIFIER = .5;
	var _fattyFood;
	var _healthyFood;
	var _random = Math.random;

	this.init = function(opts) {
		this.parent = opts.parent;
		this.scrollPos = 0;
		supr(this, 'init', [opts]);

		_fattyFood = imageData.food.fatty;
		_healthyFood = imageData.food.healthy;
	};

	this.obtainView = function(ctor, viewOpts, opts) {

		var type;

		viewOpts._active = (this.parent.character.isImmune()) ? false : true;
		viewOpts.opacity = 1;
		viewOpts.scale = 1;
		viewOpts._flaggedForRemoval = false;

		if (Math.random() < BAD_ITEM_MODIFIER && viewOpts._active) {
			type = _fattyFood[~~(_random()*_fattyFood.length)];
			viewOpts._value = -2;
			viewOpts._pointValue = 0;
			viewOpts._boostValue = 1;
		} else {
			type = _healthyFood[~~(_random()*_healthyFood.length)];
			viewOpts._value = 1;
			viewOpts._pointValue = 10;
			viewOpts._boostValue = 2;
		}

		viewOpts.image = imageData.food.base_path + type + '/' + type +'.png';
		viewOpts.type = type;

		return supr(this, 'obtainView', [ctor, viewOpts, opts]);
	};

	this._scrollTo = function(x, y) {
		GC.app.gameView.gameStarted && (this.scrollPos += this._opts.parent.speed);
		supr(this, '_scrollTo', [this.scrollPos, y]);
	};
});