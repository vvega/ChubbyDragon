import src.view.ParallaxView as ParallaxView;
import ui.ViewPool;
import ui.ImageView;

exports = Class(ParallaxView.Layer, function(supr){

	var BAD_ITEM_MODIFIER = .5;
	var _badTerrainModifier;

	this.init = function(opts) {
		this.parent = opts.parent;
		supr(this, 'init', [opts]);
	}

	this.obtainView = function(ctor, viewOpts, opts) {
		//generate terrain based on speed (increased speed = increased difficulty)
		_badTerrainModifier = (this.parent.getChar().speed > 0) ? this.parent.getChar().speed/150 : 1/150;
		viewOpts._active = (this.parent.getChar().isImmune()) ? false : true;
		viewOpts.opacity = 1;
		viewOpts.scale = 1;
		viewOpts._flaggedForRemoval = false;

		if(viewOpts.group === "terrain") {
			//only start generating bad terrain when game has started 
			viewOpts._harmful = (Math.random() < _badTerrainModifier && viewOpts._active) ? true : false;
			if(viewOpts._harmful) {
				viewOpts.image = "resources/images/terrain_block_brambles.png";
				viewOpts.height = viewOpts.height + viewOpts.height/3;
				viewOpts.y = viewOpts.y - viewOpts.height/6;
				viewOpts.width = viewOpts.width + viewOpts.width/4;
			} 
		}

		if(viewOpts.group === "items") {
		    //only start generating bad items when game has started 
			if (Math.random() < BAD_ITEM_MODIFIER && viewOpts._active) {
				viewOpts._harmful = true;
				viewOpts.image = "resources/images/cake.png";
				viewOpts.type = 'cake';
				viewOpts._value = -2;
				viewOpts._pointValue = 0;
			} else {
				viewOpts._harmful = false;
				viewOpts.image = "resources/images/apple.png";
				viewOpts.type = 'apple';
				viewOpts._value = 1;
				viewOpts._pointValue = 10;
			}
		}

		if(viewOpts.group === "clouds") {
			if(Math.random() > .5) {
				viewOpts.image = "resources/images/clouds/cloud_001.png";
				viewOpts.height = viewOpts.height/1.5;
			}
			if(Math.random() > .5) {
					viewOpts.y = viewOpts.y + viewOpts.height/2;
			}
		}
        return supr(this, 'obtainView', [ctor, viewOpts, opts]);
	}
});
