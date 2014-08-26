import src.view.ParallaxView as ParallaxView;

exports = Class(ParallaxView.Layer, function(supr) {

	this.init = function(opts) {
		supr(this, 'init', [opts]);
		this.scrollPos = 0;
	};

	this.obtainView = function(ctor, viewOpts, opts) {
		viewOpts = merge(viewOpts, {
			image: imageData.environment.mountains,
            width: WIDTH,
            height: HEIGHT/1.6,
            y: HEIGHT - HEIGHT/1.6
    	});

        return supr(this, 'obtainView', [ctor, viewOpts, opts]);
	};

	this._scrollTo = function(x, y) {
		GC.app.gameScreen.gameStarted && (this.scrollPos += this._opts.parent.speed/this._opts.parent.MAX_DISTANCE);
		supr(this, '_scrollTo', [this.scrollPos, y]);
	};
	
});