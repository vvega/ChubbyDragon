import ui.View as View;
import ui.ImageView as ImageView;
import animate;

exports = Class(View, function(supr){
	
	var ANIM_DURATION = 400;
	var SCALE_AMOUNT = 12;
	var MARGIN;

	var _numLives;
	var _lifeViewProps;
	var _lifeViews = [];

	this.init = function(opts) {
		MARGIN = opts.lifeViewProps.margin;
		opts.numLives += 1;		
		opts = merge(opts, {
			width: opts.lifeViewProps.width * (opts.numLives + MARGIN),
			height: opts.parent.height,
			x: opts.parent.style.width - ((opts.lifeViewProps.width+MARGIN)*(opts.numLives)),
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
		this._startLivesAnim();
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
		if(!GC.app.reward) {
			_lifeViews[_numLives - 1].style.visible = false;
		} else {
			_lifeViews[_numLives - 1].style.visible = true;
		}
		for(var idx in _lifeViews) {
			_lifeViews[idx].style.opacity = 1;
			_lifeViews[idx].style.y = MARGIN;
		}
		this._startLivesAnim();
	};

	this._startLivesAnim = function() {
		for(var index in _lifeViews) {
			this._runScaleAnim(_lifeViews[index], _lifeViews[index].style);
		}
	}

	this._runScaleAnim = function(view, origStyle) {
		animate(view)
			.now({
				width: _lifeViewProps.width + SCALE_AMOUNT,
				y: origStyle.y + SCALE_AMOUNT/3
			}, 700, animate.linear)
			.then({
				width: _lifeViewProps.width,
				y: origStyle.y
			}, 700, animate.linear)
			.then(bind(this, function() {
				this._runScaleAnim(view, origStyle);
			}));
	};
});
