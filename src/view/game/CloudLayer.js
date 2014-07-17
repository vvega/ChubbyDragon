import src.view.ParallaxView as ParallaxView;

exports = Class(ParallaxView.Layer, function(supr) {
	
	var _random = Math.random;

	this.obtainView = function(ctor, viewOpts, opts) {
		viewOpts = merge(viewOpts, {
            image: imageData.environment.clouds[0],
            width: BLOCK_SIZE*2,
            height: BLOCK_SIZE,
            y: (HEIGHT - HEIGHT/1.6) - BLOCK_SIZE/1.5
		});

		if(_random() > .5) {
			viewOpts.image = imageData.environment.clouds[1];
			viewOpts.height = viewOpts.height/1.5;
		}
		if(_random() > .5) {
			viewOpts.y = viewOpts.y + viewOpts.height/2;
		}

		return supr(this, 'obtainView', [ctor, viewOpts, opts]);
	}
});