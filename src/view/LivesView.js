import ui.View as View;
import ui.ImageView as ImageView;
import animate;

exports = Class(View, function(supr){
	
	var ANIM_DURATION = 400;
	var MARGIN;

	var _numLives;
	var _lifeViewProps;
	var _lifeViews = [];

	this.init = function(opts) {
		MARGIN = opts.lifeViewProps.margin;		
		opts = merge(opts, {
			width: opts.lifeViewProps.width * (opts.numLives + MARGIN),
			height: opts.parent.height,
			x: opts.parent.style.width - ((opts.lifeViewProps.width+MARGIN)*opts.numLives),
			y: -MARGIN/2.5,
		});

		_numLives = opts.numLives;
		_lifeViewProps = opts.lifeViewProps;
		supr(this, 'init', [opts]);
		this.build();
	};

	this.build = function() {
		var newView;
		for(var i = 0; i < _numLives; i++) {
			newView = new ImageView(_lifeViewProps);
			newView.style.x = i*(_lifeViewProps.width + MARGIN);
			newView.style.y = MARGIN;
			_lifeViews.push(newView);
			this.addSubview(newView);
		}
		//lives will be removed in reverse order
		_lifeViews.reverse();
	};

	this.updateLives = function(currentLives) {
		var view = _lifeViews[currentLives];
		animate(view)
			.now({opacity: 0, y: view.style.y + view.style.height/2 }, ANIM_DURATION, animate.easeIn)
			.then(function() {
				view.style.y = MARGIN;
			});
	};

	this.resetLives = function() {
		for(var idx in _lifeViews) {
			_lifeViews[idx].style.opacity = 1;
		}
	};
});
