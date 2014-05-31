import src.view.ParallaxView as ParallaxView;

exports = Class(ParallaxView.Layer, function(supr){

	var BAD_ITEM_MODIFIER = .5;
	var _badFood = [ "resources/images/cake.png" ];
	var _goodFood = [ "resources/images/apple.png" ];
	var _random = Math.random;

	this.init = function(opts) {
		this.parent = opts.parent;
		supr(this, 'init', [opts]);
	};

	this.obtainView = function(ctor, viewOpts, opts) {

		viewOpts._active = (this.parent.character.isImmune()) ? false : true;
		viewOpts.opacity = 1;
		viewOpts.scale = 1;
		viewOpts._flaggedForRemoval = false;

		if (Math.random() < BAD_ITEM_MODIFIER && viewOpts._active) {
			viewOpts.image = _badFood[~~(_random()*_badFood.length)];
			viewOpts.type = 'cake';
			viewOpts._value = -2;
			viewOpts._pointValue = 0;
			viewOpts._boostValue = 1;
		} else {
			viewOpts.image = _goodFood[~~(_random()*_goodFood.length)];
			viewOpts.type = 'apple';
			viewOpts._value = 1;
			viewOpts._pointValue = 10;
			viewOpts._boostValue = 2;
		}

		return supr(this, 'obtainView', [ctor, viewOpts, opts]);
	};
});