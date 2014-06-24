import src.view.ParallaxView as ParallaxView;
import ui.ViewPool;
import ui.ImageView;

exports = Class(ParallaxView.Layer, function(supr){

	var _badTerrainModifier;
	var _random = Math.random;

	this.init = function(opts) {
		this.parent = opts.parent;
		this.character = opts.character;
		this.scrollPos = 0;
		supr(this, 'init', [opts]);
	}

	this.obtainView = function(ctor, viewOpts, opts) {

		_badTerrainModifier = (this.character.speed > 0) ? this.character.speed/150 : 1/150;
		viewOpts._active = (this.character.isImmune()) ? false : true;

		viewOpts._harmful = ((_random() < _badTerrainModifier) && viewOpts._active) ? true : false;
		if(viewOpts._harmful) {
			viewOpts.image = "resources/images/terrain_block_brambles.png";
			viewOpts.height = viewOpts.height + viewOpts.height/3;
			viewOpts.y = viewOpts.y - viewOpts.height/6;
			viewOpts.width = viewOpts.width + viewOpts.width/4;
		} 
		
        return supr(this, 'obtainView', [ctor, viewOpts, opts]);
	}

	this._scrollTo = function(x, y) {
		GC.app.gameView.gameStarted && (this.scrollPos += this._opts.parent.speed);
		supr(this, '_scrollTo', [this.scrollPos, y]);
	};
});