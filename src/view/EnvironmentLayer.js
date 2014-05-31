import src.view.ParallaxView as ParallaxView;
import ui.ViewPool;
import ui.ImageView;

exports = Class(ParallaxView.Layer, function(supr){

	var _badTerrainModifier;
	var _random = Math.random;

	this.init = function(opts) {
		this.parent = opts.parent;
		supr(this, 'init', [opts]);
	}

	this.obtainView = function(ctor, viewOpts, opts) {

		_badTerrainModifier = (this.parent.character.speed > 0) ? this.parent.character.speed/150 : 1/150;
		viewOpts._active = (this.parent.character.isImmune()) ? false : true;

		if(viewOpts.group === "terrain") {
			viewOpts._harmful = ((_random() < _badTerrainModifier) && viewOpts._active) ? true : false;
			if(viewOpts._harmful) {
				viewOpts.image = "resources/images/terrain_block_brambles.png";
				viewOpts.height = viewOpts.height + viewOpts.height/3;
				viewOpts.y = viewOpts.y - viewOpts.height/6;
				viewOpts.width = viewOpts.width + viewOpts.width/4;
			} 
		}

		if(viewOpts.group === "clouds") {
			if(_random() > .5) {
				viewOpts.image = "resources/images/clouds/cloud_001.png";
				viewOpts.height = viewOpts.height/1.5;
			}
			if(_random() > .5) {
				viewOpts.y = viewOpts.y + viewOpts.height/2;
			}
		}

        return supr(this, 'obtainView', [ctor, viewOpts, opts]);
	}
});
